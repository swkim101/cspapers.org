package db

import (
	"fmt"

	"github.com/swkim101/cspapers.org/api.cspapers.org/config"
	_ "github.com/swkim101/cspapers.org/api.cspapers.org/db/bleve"
	"github.com/swkim101/cspapers.org/api.cspapers.org/db/dbimpl"
)

func Connect(cfg *config.Config) (*dbimpl.Type, error) {
	typ, ok := dbimpl.Types[cfg.Type]
	if !ok {
		return nil, fmt.Errorf("unknown db type '%v'", cfg.Type)
	}
	return typ, nil
}
