package bleve

import (
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/blevesearch/bleve/v2"
	"github.com/blevesearch/bleve/v2/search/query"
	"github.com/swkim101/cspapers.org/api.cspapers.org/db/dbimpl"
	"github.com/swkim101/cspapers.org/api.cspapers.org/log"
	"github.com/swkim101/cspapers.org/api.cspapers.org/types"
)

func init() {
	dbimpl.Register("bleve", ctor, search, insert)
}

var (
	index     bleve.Index
	flagDebug bool
)

func ctor(connStr string, debug bool) (err error) {
	err = nil
	flagDebug = debug
	if _, err = os.Stat(connStr); err == nil {
		/* if exist */
		index, err = bleve.Open(connStr)
	} else if errors.Is(err, os.ErrNotExist) {
		/* if not exist */
		abstractFieldMapping := bleve.NewTextFieldMapping()
		abstractFieldMapping.Analyzer = "standard"
		titleFieldMapping := bleve.NewTextFieldMapping()
		titleFieldMapping.Analyzer = "standard"

		documentMapping := bleve.NewDocumentMapping()
		documentMapping.AddFieldMappingsAt("abstract", abstractFieldMapping)
		documentMapping.AddFieldMappingsAt("title", titleFieldMapping)

		mapping := bleve.NewIndexMapping()
		mapping.AddDocumentMapping("paper", documentMapping)
		index, err = bleve.New(connStr, mapping)
	}
	if flagDebug {
		b, err := index.Stats().MarshalJSON()
		if err != nil {
			log.Fatalf("%v", err)
		} else {
			log.Debugf("%v", string(b))
		}
	}
	return err
}

func search(req *types.SearchRequest) *types.SearchResponse {
	/* 2014 - 2024 */
	yearFrom := bleve.NewQueryStringQuery(fmt.Sprintf("year:>=%v", req.YearFrom))
	yearTo := bleve.NewQueryStringQuery(fmt.Sprintf("year:<=%v", req.YearTo))
	year := bleve.NewConjunctionQuery(yearFrom, yearTo)

	/* AND */
	/* NDSS or AAAI or ... */
	venueQuery := []query.Query{}
	for _, v := range req.Venue {
		if v == "" {
			continue
		}
		qs := fmt.Sprintf("venue:%v", strings.ToLower(v))
		venueQuery = append(venueQuery, bleve.NewQueryStringQuery(qs))
	}
	venue := bleve.NewDisjunctionQuery(venueQuery...)

	/* AND */
	/* title like <query> or abstract like <query> */
	keywordQuery := []query.Query{}
	req.Query = strings.TrimSpace(req.Query)
	keywordQuery = append(keywordQuery, bleve.NewFuzzyQuery(req.Query))
	if isWord(req.Query) {
		qs := fmt.Sprintf("/.*%v.*/", req.Query)
		keywordQuery = append(keywordQuery, bleve.NewQueryStringQuery(qs))
	} else {
		keywordQuery = append(keywordQuery, bleve.NewPhraseQuery(strings.Fields(req.Query), "title"))
		keywordQuery = append(keywordQuery, bleve.NewPhraseQuery(strings.Fields(req.Query), "abstract"))
		for idx, word := range strings.Fields(req.Query) {
			// heuristic. magic number 3.
			if 3 < len(word) {
				keywordQuery = append(keywordQuery, bleve.NewFuzzyQuery(word))
			} else {
				keywordQuery = append(keywordQuery, bleve.NewMatchQuery(word))
			}
			if 0 < idx {
				// qs := fmt.Sprintf("/%v.*/", word)
				keywordQuery = append(keywordQuery, bleve.NewPrefixQuery(word))
			}
		}
	}
	keyword := bleve.NewDisjunctionQuery(keywordQuery...)

	query := bleve.NewConjunctionQuery(year, venue, keyword)

	log.Debugf("%v", req.Query)
	search := bleve.NewSearchRequest(query)
	sortBy := ""
	switch req.OrderBy {
	case "score":
		sortBy = "_score"
	case "date":
		sortBy = "year"
	default:
		log.Printf("unknown orderby flag %v", req.OrderBy)
		return &types.SearchResponse{}
	}
	if !req.Ascending {
		sortBy = "-" + sortBy
	}
	search.SortBy([]string{sortBy})
	searchResults, err := index.Search(search)
	if err != nil {
		log.Printf("%v", err)
		return &types.SearchResponse{}
	}
	log.Debugf("%v", searchResults)
	data := []*types.SearchResponseUnit{}
	for _, v := range searchResults.Hits {
		year, venue, title, err := types.Decompose(types.Index(v.ID))
		if err != nil {
			log.Printf("err in decomposing %v, %v", v.ID, err)
			continue
		}
		data = append(data, &types.SearchResponseUnit{
			Index: v.ID,
			Score: v.Score,
			Paper: types.Paper{
				Year:  year,
				Venue: venue,
				Title: title,
			},
		})
	}

	return &types.SearchResponse{
		Total: int(searchResults.Total),
		Data:  data,
	}
}

func insert(req *types.InsertRequest) error {
	idx := req.ToIndex()
	return index.Index(idx, req)
}

func isWord(s string) bool {
	return len(strings.Split(s, " ")) == 1
}
