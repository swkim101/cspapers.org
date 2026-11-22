package main

import (
	"context"
	"fmt"
	"net/http"
	"slices"
	"strings"

	"github.com/modelcontextprotocol/go-sdk/mcp"
	"github.com/swkim101/cspapers.org/api.cspapers.org/db/dbimpl"
	"github.com/swkim101/cspapers.org/api.cspapers.org/log"
	"github.com/swkim101/cspapers.org/api.cspapers.org/types"
)

type paperSearchInput struct {
	Query    string   `json:"query,omitempty" jsonschema:"Keywords to search in paper titles and abstracts"`
	Venues   []string `json:"venues,omitempty" jsonschema:"Conference or journal codes such as OSDI or SOSP. Omit to search all venues."`
	YearFrom *int     `json:"year_from,omitempty" jsonschema:"Earliest publication year to include"`
	YearTo   *int     `json:"year_to,omitempty" jsonschema:"Latest publication year to include"`
	Limit    *int     `json:"limit,omitempty" jsonschema:"Maximum number of results from 1 to 20. Defaults to 5."`
}

type paperSearchHit struct {
	types.Paper
	PaperID string `json:"paper_id"`
}

type paperSearchOutput struct {
	Total  int              `json:"total"`
	Papers []paperSearchHit `json:"papers"`
}

type abstractInput struct {
	PaperID string `json:"paper_id" jsonschema:"Paper ID returned by search_papers"`
}

type abstractOutput struct {
	PaperID     string `json:"paper_id"`
	HasAbstract bool   `json:"has_abstract"`
	Abstract    string `json:"abstract"`
}

func newMCPHandler(db *dbimpl.Type) http.Handler {
	server := mcp.NewServer(&mcp.Implementation{Name: "cspapers.org", Version: "1.0.0"}, nil)
	openWorld := false
	annotations := &mcp.ToolAnnotations{ReadOnlyHint: true, OpenWorldHint: &openWorld}
	mcp.AddTool(server, &mcp.Tool{
		Name:        "search_papers",
		Description: "Search cspapers.org for computer science papers by keyword, venue, or year. Returns papers in relevance order and their IDs for abstract lookup.",
		Annotations: annotations,
	}, func(_ context.Context, _ *mcp.CallToolRequest, input paperSearchInput) (*mcp.CallToolResult, paperSearchOutput, error) {
		request, limit, err := input.searchRequest()
		if err != nil {
			return nil, paperSearchOutput{}, err
		}
		result := db.Search(request)
		count := min(limit, len(result.Data))
		papers := make([]paperSearchHit, 0, count)
		for _, hit := range result.Data[:count] {
			papers = append(papers, paperSearchHit{Paper: hit.Paper, PaperID: hit.Index})
		}
		return nil, paperSearchOutput{Total: result.Total, Papers: papers}, nil
	})
	mcp.AddTool(server, &mcp.Tool{
		Name:        "get_abstract",
		Description: "Read the stored abstract of one paper by the paper_id returned by search_papers.",
		Annotations: annotations,
	}, func(_ context.Context, _ *mcp.CallToolRequest, input abstractInput) (*mcp.CallToolResult, abstractOutput, error) {
		id := input.PaperID
		if !isValidPaperID(id) {
			return nil, abstractOutput{}, fmt.Errorf("invalid paper_id: expected 64 hexadecimal characters")
		}
		abstract, found, err := db.Abstract(id)
		if err != nil {
			log.Printf("read abstract for %s: %v", id, err)
			return nil, abstractOutput{}, fmt.Errorf("could not read abstract")
		}
		if !found {
			return nil, abstractOutput{}, fmt.Errorf("paper not found")
		}
		return nil, abstractOutput{PaperID: id, HasAbstract: abstract != "", Abstract: abstract}, nil
	})

	handler := mcp.NewStreamableHTTPHandler(func(*http.Request) *mcp.Server {
		return server
	}, &mcp.StreamableHTTPOptions{Stateless: true, JSONResponse: true})
	return http.MaxBytesHandler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// MCP clients connect directly to the server without a browser Origin.
		if r.Header.Get("Origin") != "" {
			http.Error(w, "origin not allowed", http.StatusForbidden)
			return
		}
		handler.ServeHTTP(w, r)
	}), 32<<10)
}

func (input paperSearchInput) searchRequest() (*types.SearchRequest, int, error) {
	limit := 5
	if input.Limit != nil {
		limit = *input.Limit
	}
	if limit < 1 || limit > 20 {
		return nil, 0, fmt.Errorf("limit must be between 1 and 20")
	}

	yearFrom, yearTo := 1, 9999
	if input.YearFrom != nil {
		yearFrom = *input.YearFrom
	}
	if input.YearTo != nil {
		yearTo = *input.YearTo
	}
	if yearFrom < 1 || yearTo > 9999 || yearFrom > yearTo {
		return nil, 0, fmt.Errorf("choose a year range from 1 to 9999 with year_from at or before year_to")
	}

	venues := validVenue
	if len(input.Venues) > 0 {
		venues = make([]string, 0, min(len(input.Venues), len(validVenue)))
		for _, name := range input.Venues {
			name = strings.TrimSpace(name)
			i := slices.IndexFunc(validVenue, func(venue string) bool { return strings.EqualFold(venue, name) })
			if i < 0 {
				return nil, 0, fmt.Errorf("unknown venue %q", name)
			}
			if !slices.Contains(venues, validVenue[i]) {
				venues = append(venues, validVenue[i])
			}
		}
	}
	query := strings.TrimSpace(input.Query)
	if query == "" && len(input.Venues) == 0 && input.YearFrom == nil && input.YearTo == nil {
		return nil, 0, fmt.Errorf("provide search keywords, venues, or a year range")
	}
	return &types.SearchRequest{
		Query:    query,
		OrderBy:  "score",
		Venue:    venues,
		YearFrom: uint32(yearFrom),
		YearTo:   uint32(yearTo),
	}, limit, nil
}
