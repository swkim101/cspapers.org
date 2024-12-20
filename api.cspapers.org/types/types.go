package types

import (
	"os"
	"strconv"
	"strings"
)

type InsertRequest struct {
	Paper
	Index    string
	Abstract string `json:"abstract"`
}

type Paper struct {
	Title string `json:"title"`
	Year  uint32 `json:"year"`
	Venue string `json:"venue"`
}

type SearchResponse struct {
	Total    int                   `json:"total"`
	Duration int                   `json:"duration"`
	Skip     uint32                `json:"skip"`
	Data     []*SearchResponseUnit `json:"data"`
}

type SearchResponseUnit struct {
	Paper
	Index string  `json:"index"`
	Score float64 `json:"score"`
}

type SearchRequest struct {
	Query     string   `json:"query"`
	OrderBy   string   `json:"orderBy"`
	Ascending bool     `json:"ascending"`
	Venue     []string `json:"venue"`
	YearFrom  uint32   `json:"yearFrom"`
	YearTo    uint32   `json:"yearTo"`
	Skip      uint32   `json:"skip"`
	Must      []string `json:"must"`
}

func Decompose(s string) (year uint32, venue string, title string, err error) {
	p := strings.Split(s, string(os.PathSeparator))
	year64, err := strconv.ParseInt(p[0], 10, 32)
	if err != nil {
		return 0, "", "", err
	}
	return uint32(year64), p[1], p[2], nil
}
