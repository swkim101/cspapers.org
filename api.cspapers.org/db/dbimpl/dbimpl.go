package dbimpl

import "github.com/swkim101/cspapers.org/api.cspapers.org/types"

type ctorFunc func(connStr string, debug bool) error
type dtorFunc func() error
type searchFunc func(req *types.SearchRequest) *types.SearchResponse
type insertFunc func(req *types.InsertRequest) error
type abstractFunc func(id string) (text string, found bool, err error)

type Type struct {
	Ctor     ctorFunc
	Dtor     dtorFunc
	Search   searchFunc
	Insert   insertFunc
	Abstract abstractFunc
}

var (
	Types = make(map[string]*Type)
)

func Register(typ string, ctor ctorFunc, dtor dtorFunc, search searchFunc, insert insertFunc, abstract abstractFunc) {
	Types[typ] = &Type{
		Ctor:     ctor,
		Dtor:     dtor,
		Search:   search,
		Insert:   insert,
		Abstract: abstract,
	}
}
