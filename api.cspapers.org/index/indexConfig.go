package main

import (
	"fmt"

	"github.com/swkim101/cspapers.org/api.cspapers.org/config"
)

type indexConfig struct {
	Input            string `json:"input"`
	ConnectionString string `json:"connectionString"`
}

func loadConfig(path string) (*indexConfig, error) {
	var cfg indexConfig
	if err := config.LoadFile(path, &cfg); err != nil {
		return nil, err
	}
	if cfg.Input == "" || cfg.ConnectionString == "" {
		return nil, fmt.Errorf("%s: input and connectionString are required", path)
	}
	return &cfg, nil
}
