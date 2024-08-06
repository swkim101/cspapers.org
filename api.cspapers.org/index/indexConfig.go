package main

import (
	"github.com/swkim101/cspapers.org/api.cspapers.org/config"
	"github.com/swkim101/cspapers.org/api.cspapers.org/db"
	"github.com/swkim101/cspapers.org/api.cspapers.org/db/dbimpl"
	"github.com/swkim101/cspapers.org/api.cspapers.org/log"
)

type indexConfig struct {
	config.Config
	Target string `json:"target"`

	dbimpl *dbimpl.Type `json:"-"`
}

func LoadConfig(file string) (*indexConfig, error) {
	cfg := &indexConfig{
		Config: *config.DefaultValues(),
		Target: "data",
	}
	err := config.LoadFile(file, cfg)
	if err != nil {
		log.Fatalf("%v", err)
	}
	cfg.dbimpl, err = db.Connect(&cfg.Config)
	if err != nil {
		log.Fatalf("%v", err)
	}
	return cfg, nil
}
