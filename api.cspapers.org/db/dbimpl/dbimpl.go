package dbimpl

import "github.com/swkim101/cspapers.org/api.cspapers.org/types"

type ctorFunc func(connStr string, debug bool) error
type searchFunc func(req *types.SearchRequest) *types.SearchResponse
type insertFunc func(req *types.InsertRequest) error

type Type struct {
	Ctor   ctorFunc
	Search searchFunc
	Insert insertFunc
}

var (
	Types = make(map[string]*Type)
)

func Register(typ string, ctor ctorFunc, search searchFunc, insert insertFunc) {
	Types[typ] = &Type{
		Ctor:   ctor,
		Search: search,
		Insert: insert,
	}
}
