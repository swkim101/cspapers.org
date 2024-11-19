package wordforms_test

import (
	"os"
	"reflect"
	"testing"

	"github.com/swkim101/cspapers.org/api.cspapers.org/wordforms"
)

func TestMain(m *testing.M) {
	wordforms.LoadLemmas("../../lemma.gob", "../../lemmaInv.gob")
	code := m.Run()
	os.Exit(code)
}

func TestWords(t *testing.T) {
	{
		got := wordforms.GetWordForms("tests")
		expected := []string{"tested", "testing", "tests", "test"}
		if !reflect.DeepEqual(got, expected) {
			t.Fatalf("expected %v, got %v", expected, got)
		}
	}
	{
		got := wordforms.GetWordForms("fuzzing")
		expected := []string{"fuzzed", "fuzzes", "fuzzing", "fuzzer", "fuzzers", "fuzz"}
		if !reflect.DeepEqual(got, expected) {
			t.Fatalf("expected %v, got %v", expected, got)
		}
	}
}
