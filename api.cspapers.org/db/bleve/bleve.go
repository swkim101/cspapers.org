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
	"github.com/swkim101/cspapers.org/api.cspapers.org/wordforms"
)

func init() {
	dbimpl.Register("bleve", ctor, dtor, search, insert)
}

var (
	index     bleve.Index
	flagDebug bool
	reqChan   chan *types.InsertRequest
	batchDone chan bool
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
	reqChan = make(chan *types.InsertRequest)
	batchDone = make(chan bool)
	go batchInsert()
	return err
}

func dtor() error {
	close(reqChan)
	<-batchDone
	return nil
}

func escape(str string) string {
	target := "\\+-=&|><!(){}[]^\"~*?:/ "
	for _, c := range target {
		str = strings.ReplaceAll(str, string(c), "\\"+string(c))
	}
	return str
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
			return &types.SearchResponse{}
		}
		qs := fmt.Sprintf("venue:%v", strings.ToLower(v))
		venueQuery = append(venueQuery, bleve.NewQueryStringQuery(qs))
	}
	venue := bleve.NewDisjunctionQuery(venueQuery...)

	/* AND */
	/* title like <query> or abstract like <query> */
	keywordQuery := []query.Query{}
	req.Query = strings.TrimSpace(req.Query)
	words := strings.Fields(req.Query)
	if len(words) == 0 {
		// no word to search
		return &types.SearchResponse{}
	}
	isSentence := len(words) > 7
	for idx, word := range words {
		words[idx] = escape(word)
	}

	qs := fmt.Sprintf("title:\"%v\"^3", strings.Join(words, ""))
	keywordQuery = append(keywordQuery, bleve.NewQueryStringQuery(qs))
	qs = fmt.Sprintf("title:\"%v\"^2", strings.Join(words, " "))
	keywordQuery = append(keywordQuery, bleve.NewQueryStringQuery(qs))
	qs = fmt.Sprintf("abstract:\"%v\"", strings.Join(words, " "))
	keywordQuery = append(keywordQuery, bleve.NewQueryStringQuery(qs))

	/* Word-by-word query is expensive. So, a heuristic is here: A user may
	 * want papers containing a specific sentence, which does not need expensive
	 * word-by-word query. If the query is long, e.g., containing more than 7
	 * words, we infer that a user wants a specific sentence, and skip the expensive
	 * query. This shows 30x faster results.
	 */
	if isSentence {
		rq := fmt.Sprintf("%v", strings.Join(words, " "))
		keywordQuery = append(keywordQuery, bleve.NewMatchQuery(rq))
	} else {
		for _, word := range words {
			qsTitle := fmt.Sprintf("title:%v^2", word)
			qsAbs := fmt.Sprintf("abstract:%v", word)
			keywordQuery = append(keywordQuery, bleve.NewQueryStringQuery(qsTitle))
			keywordQuery = append(keywordQuery, bleve.NewQueryStringQuery(qsAbs))

			/* Do not apply fuzziness for short words. Short words could be abbreviations. */
			if 4 < len(word) {
				fq := bleve.NewFuzzyQuery(word)
				fq.SetFuzziness(2)
				keywordQuery = append(keywordQuery, fq)
			}
			/* try different word forms */
			if 3 < len(word) {
				for _, wf := range wordforms.GetWordForms(word) {
					qsTitle := fmt.Sprintf("title:%v^2", wf)
					qsAbs := fmt.Sprintf("abstract:%v", wf)
					keywordQuery = append(keywordQuery, bleve.NewQueryStringQuery(qsTitle))
					keywordQuery = append(keywordQuery, bleve.NewQueryStringQuery(qsAbs))
				}
			}
		}
	}

	keyword := bleve.NewDisjunctionQuery(keywordQuery...)
	query := bleve.NewConjunctionQuery(year, venue, keyword)

	if len(req.Must) != 0 {
		for _, word := range req.Must {
			log.Debugf("must: %v", word)
			q := bleve.NewMatchQuery(word)
			query = bleve.NewConjunctionQuery(query, q)
		}
	}

	log.Debugf("%v", req.Query)
	search := bleve.NewSearchRequestOptions(query, 20, int(req.Skip), false)
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
		Total:    int(searchResults.Total),
		Duration: int(searchResults.Took.Milliseconds()),
		Skip:     req.Skip,
		Data:     data,
	}
}

func batchInsert() {
	batch := index.NewBatch()
	batchSize := 1000

	for i := 0; true; i++ {
		req, more := <-reqChan
		if more {
			idx := req.ToIndex()
			batch.Index(idx, req)
		}
		if i == batchSize || !more {
			log.Debugf("spool batch len %v", i)
			err := index.Batch(batch)
			if err != nil {
				log.Fatalf("%v", err)
			}
			i = 0
			batch.Reset()
		}
		if !more {
			batchDone <- true
		}
	}
}

func insert(req *types.InsertRequest) error {
	reqChan <- req
	return nil
}

func isWord(s string) bool {
	return len(strings.Fields(s)) == 1
}
