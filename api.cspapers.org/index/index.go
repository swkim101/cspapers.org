package main

import (
	"bufio"
	"compress/gzip"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/blevesearch/bleve/v2"
	paperdb "github.com/swkim101/cspapers.org/api.cspapers.org/db/bleve"
	"github.com/swkim101/cspapers.org/api.cspapers.org/log"
	"github.com/swkim101/cspapers.org/api.cspapers.org/types"
)

const batchSize = 1000

type buildStats struct {
	lines       int
	indexed     int
	missingYear int
	duplicates  int
	sharedDOI   int
}

type indexedPaper struct {
	metadataID     [sha256.Size]byte
	abstractLength int
}

type sourcePaper struct {
	Title    string `json:"title"`
	Year     uint32 `json:"year"`
	Venue    string `json:"venue_label"`
	DOI      string `json:"doi"`
	Abstract string `json:"abstract"`
}

func main() {
	configPath := flag.String("config", "conf.json", "configuration file")
	debug := flag.Bool("debug", false, "enable debug logging")
	flag.Parse()
	log.SetDebugFlag(*debug)

	if err := run(*configPath); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run(configPath string) error {
	cfg, err := loadConfig(configPath)
	if err != nil {
		return err
	}
	stats, err := buildIndex(cfg.Input, cfg.ConnectionString)
	if err != nil {
		return err
	}
	log.Printf("indexed %d papers from %d lines (%d missing year, %d duplicate; %d additional papers sharing a DOI) into %s",
		stats.indexed, stats.lines, stats.missingYear, stats.duplicates, stats.sharedDOI, cfg.ConnectionString)
	return nil
}

func indexPapers(input string, index bleve.Index) (buildStats, error) {
	var stats buildStats
	file, err := os.Open(input)
	if err != nil {
		return stats, err
	}
	defer file.Close()

	reader, err := gzip.NewReader(file)
	if err != nil {
		return stats, fmt.Errorf("open gzip %s: %w", input, err)
	}
	defer reader.Close()

	seen := make(map[[sha256.Size]byte]indexedPaper)
	batch := index.NewBatch()
	scanner := bufio.NewScanner(reader)
	scanner.Buffer(make([]byte, 64*1024), 4*1024*1024)
	for scanner.Scan() {
		stats.lines++
		var row sourcePaper
		if err := json.Unmarshal(scanner.Bytes(), &row); err != nil {
			return stats, fmt.Errorf("%s:%d: %w", input, stats.lines, err)
		}
		if strings.TrimSpace(row.Title) == "" || strings.TrimSpace(row.Venue) == "" {
			return stats, fmt.Errorf("%s:%d: title and venue_label are required", input, stats.lines)
		}
		if row.Year == 0 {
			stats.missingYear++
			continue
		}

		paper := types.InsertRequest{
			Paper: types.Paper{
				Title: row.Title,
				Year:  row.Year,
				Venue: strings.ToLower(strings.TrimSpace(row.Venue)),
			},
			Abstract: row.Abstract,
		}
		metadataID := metadataPaperID(paper.Paper)
		id := metadataID
		if doi := normalizeDOI(row.DOI); doi != "" {
			id = sha256.Sum256([]byte("doi:" + doi))
		}
		previous, exists := seen[id]
		sharesDOI := exists && previous.metadataID != metadataID
		if sharesDOI {
			// Keep both papers when a DOI was assigned to different metadata.
			key := "shared-doi:" + hex.EncodeToString(id[:]) + ":" + hex.EncodeToString(metadataID[:])
			id = sha256.Sum256([]byte(key))
			previous, exists = seen[id]
		}
		if exists {
			stats.duplicates++
			if len(paper.Abstract) <= previous.abstractLength {
				continue
			}
		} else {
			stats.indexed++
			if sharesDOI {
				stats.sharedDOI++
			}
		}
		seen[id] = indexedPaper{metadataID: metadataID, abstractLength: len(paper.Abstract)}
		if err := batch.Index(hex.EncodeToString(id[:]), paper); err != nil {
			return stats, fmt.Errorf("index %s:%d: %w", input, stats.lines, err)
		}
		if batch.Size() >= batchSize {
			if err := index.Batch(batch); err != nil {
				return stats, fmt.Errorf("save Bleve batch at line %d: %w", stats.lines, err)
			}
			batch.Reset()
			log.Debugf("processed %d lines (%d papers indexed)", stats.lines, stats.indexed)
		}
	}
	if err := scanner.Err(); err != nil {
		return stats, fmt.Errorf("read %s after line %d: %w", input, stats.lines, err)
	}
	if stats.indexed == 0 {
		return stats, fmt.Errorf("%s: no indexable papers in %d lines", input, stats.lines)
	}
	if batch.Size() > 0 {
		if err := index.Batch(batch); err != nil {
			return stats, fmt.Errorf("save final Bleve batch: %w", err)
		}
	}
	count, err := index.DocCount()
	if err != nil {
		return stats, fmt.Errorf("count Bleve documents: %w", err)
	}
	if count != uint64(stats.indexed) {
		return stats, fmt.Errorf("expected %d Bleve documents, found %d", stats.indexed, count)
	}
	return stats, nil
}

func normalizeDOI(doi string) string {
	doi = strings.ToLower(strings.TrimSpace(doi))
	for _, prefix := range []string{"https://doi.org/", "http://doi.org/", "https://dx.doi.org/", "http://dx.doi.org/", "doi:"} {
		if trimmed, found := strings.CutPrefix(doi, prefix); found {
			doi = strings.TrimSpace(trimmed)
			break
		}
	}

	return doi
}

func metadataPaperID(paper types.Paper) [sha256.Size]byte {
	fields, _ := json.Marshal([]any{paper.Venue, paper.Year, paper.Title})
	return sha256.Sum256([]byte("paper:" + string(fields)))
}

func buildIndex(input, output string) (buildStats, error) {
	var stats buildStats
	if _, err := os.Lstat(output); err == nil {
		return stats, fmt.Errorf("output already exists: %s", output)
	} else if !errors.Is(err, os.ErrNotExist) {
		return stats, err
	}

	parent := filepath.Dir(output)
	if err := os.MkdirAll(parent, 0755); err != nil {
		return stats, err
	}
	buildDir, err := os.MkdirTemp(parent, ".bleve-build-")
	if err != nil {
		return stats, err
	}
	defer os.RemoveAll(buildDir)

	indexPath := filepath.Join(buildDir, "index")
	index, err := paperdb.NewPaperIndex(indexPath)
	if err != nil {
		return stats, err
	}
	stats, err = indexPapers(input, index)
	if err := errors.Join(err, index.Close()); err != nil {
		return stats, err
	}
	if err := os.Rename(indexPath, output); err != nil {
		return stats, fmt.Errorf("publish Bleve index: %w", err)
	}
	return stats, nil
}
