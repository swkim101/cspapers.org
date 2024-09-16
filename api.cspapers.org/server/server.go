package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"net/http"
	"net/url"
	"slices"
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
			w.Header().Set("Cache-Control", "max-age=604800")
			w.Header().Set("Age", "0")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("<p>Wrong query string. Example: ?query=bluetooth&yearFrom=2019&yearTo=2025&venue=NDSS%2CUsenix%2CSP%2CCCS&orderBy=score&ascending=false&skip=0&take=20</p>"))
			w.Write([]byte("<p>Also see: https://github.com/swkim101/cspapers.org?tab=readme-ov-file#query</p>"))
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
		log.Debugf("yearFrom %v", yearFrom)
		return nil, err
	}
	yearTo, err := strconv.ParseUint(query.Get("yearTo"), 10, 32)
	if err != nil {
		log.Debugf("yearTo %v", yearTo)
		return nil, err
	}
	skip, err := strconv.ParseUint(query.Get("skip"), 10, 32)
	if err != nil {
		log.Debugf("skip %v", skip)
		return nil, err
	}
	venue := strings.Split(query.Get("venue"), ",")
	for _, v := range venue {
		if !isValidVenue(v) {
			return nil, fmt.Errorf("invalid venue %v", v)
		}
	}
	return &types.SearchRequest{
		Query:     query.Get("query"),
		OrderBy:   query.Get("orderBy"),
		Ascending: query.Get("ascending") == "true",
		Venue:     venue,
		YearFrom:  uint32(yearFrom),
		YearTo:    uint32(yearTo),
		Skip:      uint32(skip),
	}, nil
}

var validVenue = []string{"AAAI", "IJCAI", "CVPR", "ICLR", "ICML", "NeurIPS", "ACL", "EMNLP", "NAACL", "SIGIR", "WWW", "ASPLOS", "SIGCOMM", "NSDI", "NDSS", "Usenix", "SP", "CCS", "SIGMOD", "VLDB", "DAC", "ICCAD", "HPDC", "ICS", "SC", "IMC", "SIGMETRICS", "EMSOFT", "RTAS", "RTSS", "MobiCom", "MobiSys", "SenSys", "OSDI", "SOSP", "ATC", "EuroSYS", "FSE", "ICSE", "ASE", "ISSTA", "PACMPL", "PLDI", "FOCS", "SODA", "STOC", "CRYPTO", "EuroCrypt", "LICS", "SIGCSE", "EC", "WINE", "CHI", "UbiComp", "UIST", "ICRA", "IROS", "RSS", "ISCA", "MICRO", "HPCA", "ICCV", "ECCV"}

func isValidVenue(venue string) bool {
	return slices.Contains(validVenue, venue) || venue == ""
}
