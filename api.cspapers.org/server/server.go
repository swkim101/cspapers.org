package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	// _ "net/http/pprof"

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
	if err != nil {
		panic(err)
	}
	runServer(cfg)
}

func runServer(cfg *serverConfig) {
	err := cfg.dbimpl.Ctor(cfg.ConnectionString, *flagDebug)
	if err != nil {
		log.Fatalf("%v", err)
	}
	prefix := cfg.Prefix
	port := fmt.Sprintf(":%v", cfg.Port)

	http.HandleFunc(prefix, handle(cfg))
	log.Printf("running on %v:%v%v", cfg.Host, cfg.Port, prefix)
	err = http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatalf("%v", err)
	}
}

func handle(cfg *serverConfig) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		req, err := unmarshal(r.URL.Query())
		if err != nil {
			log.Debugf("%v", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		log.Debugf("%#v", req)
		res := cfg.dbimpl.Search(req)
		json.NewEncoder(w).Encode(res)
	}
}

func unmarshal(query url.Values) (*types.SearchRequest, error) {
	/* any idea other than reflection? */
	yearFrom, err := strconv.ParseUint(query.Get("yearFrom"), 10, 32)
	if err != nil {
		return nil, err
	}
	yearTo, err := strconv.ParseUint(query.Get("yearTo"), 10, 32)
	if err != nil {
		return nil, err
	}
	skip, err := strconv.ParseUint(query.Get("skip"), 10, 32)
	if err != nil {
		return nil, err
	}
	take, err := strconv.ParseUint(query.Get("take"), 10, 32)
	if err != nil {
		return nil, err
	}
	return &types.SearchRequest{
		Query:     query.Get("query"),
		OrderBy:   query.Get("orderBy"),
		Ascending: query.Get("ascending") == "true",
		Venue:     strings.Split(query.Get("venue"), ","),
		YearFrom:  uint32(yearFrom),
		YearTo:    uint32(yearTo),
		Skip:      uint32(skip),
		Take:      uint32(take),
	}, nil
}
