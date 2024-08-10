package main

import (
	"flag"
	"io/fs"
	"os"
	"path/filepath"
	"strings"

	"github.com/swkim101/cspapers.org/api.cspapers.org/log"
	"github.com/swkim101/cspapers.org/api.cspapers.org/types"
)

var (
	flagDebug  = flag.Bool("debug", false, "dump all logs to stdout")
	flagConfig = flag.String("config", "conf.json", "configuration file")
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
	root := cfg.Target

	filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
		if d.IsDir() {
			log.Debugf("add %v", path)
			return nil
		}
		index := strings.TrimPrefix(path, cfg.Target+string(os.PathSeparator))
		year, venue, title, err := types.Decompose(types.Index(index))
		if err != nil {
			log.Printf("parse error %v %v %v", year, err, path)
			return err
		}
		blob, err := os.ReadFile(path)
		if err != nil {
			log.Printf("failed to read file %v %v", path, err)
			return err
		}

		cfg.dbimpl.Insert(&types.InsertRequest{
			Paper: types.Paper{
				Year:  year,
				Venue: venue,
				Title: title,
			},
			Abstract: string(blob),
		})
		return nil
	})
}
