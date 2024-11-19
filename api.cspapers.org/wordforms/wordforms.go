package wordforms

import (
	"encoding/gob"
	"os"
)

var lemma map[string]string
var lemmaInv map[string][]string

func LoadLemmas(lemmaPath string, lemmaInvPath string) {
	lemma = make(map[string]string)
	lemmaInv = make(map[string][]string)

	lemmaFile, err := os.Open(lemmaPath)
	if err != nil {
		panic(err)
	}
	dataDecoder := gob.NewDecoder(lemmaFile)
	err = dataDecoder.Decode(&lemma)
	if err != nil {
		panic(err)
	}
	lemmaFile.Close()

	lemmaInvFile, err := os.Open(lemmaInvPath)
	if err != nil {
		panic(err)
	}
	dataDecoder = gob.NewDecoder(lemmaInvFile)
	err = dataDecoder.Decode(&lemmaInv)
	if err != nil {
		panic(err)
	}
	lemmaInvFile.Close()
}

func GetWordForms(word string) []string {
	lem, ok := lemma[word]
	wf := []string{}

	if ok {
		wf = append(wf, lemmaInv[lem]...)
		wf = append(wf, lem)
	} else {
		wf = append(wf, lemmaInv[word]...)
		wf = append(wf, word)
	}

	return wf
}
