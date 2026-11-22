package bleve

import (
	"path/filepath"
	"testing"

	"github.com/swkim101/cspapers.org/api.cspapers.org/types"
)

func TestSearchTreatsWildcardPunctuationAsText(t *testing.T) {
	testIndex, err := NewPaperIndex(filepath.Join(t.TempDir(), "papers"))
	if err != nil {
		t.Fatal(err)
	}
	previousIndex := index
	index = testIndex
	t.Cleanup(func() {
		index = previousIndex
		if err := testIndex.Close(); err != nil {
			t.Error(err)
		}
	})

	papers := []struct {
		id       string
		title    string
		abstract string
	}{
		{id: "wireless", title: "Wireless networking"},
		{id: "wirelessness", title: "Wirelessness"},
		{id: "wi", title: "Network protocols", abstract: "Wi standards"},
		{id: "win", title: "Game theory", abstract: "Win conditions"},
	}
	for _, paper := range papers {
		err := testIndex.Index(paper.id, &types.InsertRequest{
			Paper:    types.Paper{Title: paper.title, Year: 2026, Venue: "chi"},
			Abstract: paper.abstract,
		})
		if err != nil {
			t.Fatal(err)
		}
	}

	for _, tc := range []struct {
		query string
		want  string
	}{
		{query: "wireless*", want: "wireless"},
		{query: "wi?", want: "wi"},
	} {
		t.Run(tc.query, func(t *testing.T) {
			result := search(&types.SearchRequest{
				Query:    tc.query,
				OrderBy:  "score",
				Venue:    []string{"CHI"},
				YearFrom: 2026,
				YearTo:   2026,
			})
			if len(result.Data) != 1 {
				t.Fatalf("got %d matches, want one match for %q", len(result.Data), tc.want)
			}
			if got := result.Data[0].Index; got != tc.want {
				t.Errorf("got paper %q, want %q", got, tc.want)
			}
		})
	}
}
