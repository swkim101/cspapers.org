package main

import (
	"github.com/swkim101/cspapers.org/api.cspapers.org/config"
	"github.com/swkim101/cspapers.org/api.cspapers.org/db"
	"github.com/swkim101/cspapers.org/api.cspapers.org/db/dbimpl"
	"github.com/swkim101/cspapers.org/api.cspapers.org/log"
)

type serverConfig struct {
	config.Config
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Prefix   string `json:"prefix"`
	Lemma    string `json:"lemma"`
	LemmaInv string `json:"lemmaInv"`

	dbimpl *dbimpl.Type `json:"-"`
}

func LoadConfig(file string) (*serverConfig, error) {
	cfg := &serverConfig{
		Config: *config.DefaultValues(),
		Host:   "localhost",
		Port:   8000,
		Prefix: "/",
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
