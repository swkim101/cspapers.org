package config

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
)

type Config struct {
	ConnectionString string `json:"connection_string"`
	Type             string `json:"type"`
}

/* refered https://github.com/google/syzkaller/blob/master/pkg/mgrconfig/config.go */

func DefaultValues() *Config {
	return &Config{
		ConnectionString: "db.cspaper.org",
		Type:             "bleve",
	}
}

func LoadFile(filename string, cfg interface{}) error {
	if filename == "" {
		return fmt.Errorf("no config file specified")
	}
	data, err := os.ReadFile(filename)
	if err != nil {
		return fmt.Errorf("failed to read config file: %w", err)
	}
	return loadData(data, cfg)
}

func loadData(data []byte, cfg interface{}) error {
	dec := json.NewDecoder(bytes.NewReader(data))
	// dec.DisallowUnknownFields()
	if err := dec.Decode(cfg); err != nil {
		return fmt.Errorf("failed to parse config file: %w", err)
	}
	return nil
}
