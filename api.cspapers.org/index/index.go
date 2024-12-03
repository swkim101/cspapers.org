package main

import (
	"bufio"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path"
	"sync"

	"github.com/swkim101/cspapers.org/api.cspapers.org/log"
	"github.com/swkim101/cspapers.org/api.cspapers.org/types"
)

var (
	flagDebug  = flag.Bool("debug", false, "dump all logs to stdout")
	flagConfig = flag.String("config", "conf.json", "configuration file")

	wg sync.WaitGroup
)

func main() {
	flag.Parse()
	log.SetDebugFlag(*flagDebug)
	cfg, err := LoadConfig(*flagConfig)
	log.Debugf("%v", cfg.dbimpl)
	if err != nil {
		log.Fatalf("%v", err)
	}
	runIndex(cfg)
}

func runIndex(cfg *indexConfig) {
	err := cfg.dbimpl.Ctor(cfg.ConnectionString, *flagDebug)
	if err != nil {
		panic(err)
	}
	defer cfg.dbimpl.Dtor()
	reqChan := make(chan *types.InsertRequest)
	done := make(chan bool)
	go indexAbs(reqChan, cfg.dbimpl.Insert, done)
	for _, filename := range cfg.Datafiles {
		wg.Add(1)
		go indexTitle(filename, reqChan)
	}
	wg.Wait()
	close(reqChan)
	<-done
}

func indexAbs(reqChan chan *types.InsertRequest, insertFunc func(req *types.InsertRequest) error, done chan bool) {
	for req := range reqChan {
		absfile := path.Join("index", req.Index)
		blob, err := os.ReadFile(absfile)
		if err == nil {
			req.Abstract = string(blob)
		}
		insertFunc(req)
	}
	done <- true
}

func indexTitle(filename string, reqChan chan *types.InsertRequest) {
	file, err := os.Open(filename)
	if err != nil {
		log.Fatalf("%v", err)
	}
	defer file.Close()
	defer wg.Done()
	scanner := bufio.NewScanner(file)
	buf := make([]byte, 100000)
	scanner.Buffer(buf, 100000)
	var line struct {
		CorpusId int    `json:"corpusid"`
		Year     int    `json:"year"`
		VenueId  string `json:"publicationvenueid"`
		Title    string `json:"title"`
	}
	for scanner.Scan() {
		dat := scanner.Bytes()
		err := json.Unmarshal(dat, &line)
		if err != nil {
			panic(err)
		}
		id := line.CorpusId
		dir := fmt.Sprintf("%v/%v/%v", int((id / 10000 / 1000)), int((id%10000)/1000), id)
		venue, ok := idToVenue[line.VenueId]
		if !ok {
			log.Fatalf("unknown venue id %v in %v", line.VenueId, string(dat))
		}
		if alias, ok := venueAlias[venue]; ok {
			venue = alias
		}
		reqChan <- &types.InsertRequest{
			Paper: types.Paper{
				Title: line.Title,
				Year:  uint32(line.Year),
				Venue: venue,
			},
			Index:    dir,
			Abstract: "",
		}
	}
	if err := scanner.Err(); err != nil {
		log.Fatalf("%v", err)
	}
}
