package config_test

import (
	"encoding/json"
	"path/filepath"
	"testing"

	. "github.com/swkim101/cspapers.org/api.cspapers.org/config"
)

func TestConfig(t *testing.T) {
	files, err := filepath.Glob(filepath.Join("testdata", "*.json"))
	if err != nil || len(files) == 0 {
		t.Fatalf("failed to read input files: %v", err)
	}
	for _, file := range files {
		t.Run(file, func(t *testing.T) {
			cfg := &Config{}
			err := LoadFile(file, cfg)
			if err != nil {
				t.Fatal(err)
			}
			blob, err := json.Marshal(cfg)
			if err != nil {
				t.Fatal(err)
			}
			t.Log(string(blob))
		})
	}
}
