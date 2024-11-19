package main

import (
	"bufio"
	"encoding/gob"
	"log"
	"os"
	"strings"
)

var lemma map[string]string
var lemmaInv map[string][]string

func main() {
	lemma = make(map[string]string)
	lemmaInv = make(map[string][]string)

	readFile("lemmas/lemmatization-en.txt")
	readFile("lemmas/lemmatization-cspapers.txt")

	lemmaFile, err := os.Create("lemma.gob")
	if err != nil {
		panic(err)
	}
	defer lemmaFile.Close()
	enc := gob.NewEncoder(lemmaFile)
	enc.Encode(lemma)

	lemmaInvFile, err := os.Create("lemmaInv.gob")
	if err != nil {
		panic(err)
	}
	defer lemmaInvFile.Close()
	enc = gob.NewEncoder(lemmaInvFile)
	enc.Encode(lemmaInv)
}

func readFile(filename string) {
	file, err := os.Open(filename)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if len(line) == 0 {
			continue
		}
		words := strings.Fields(line)
		left := words[0]
		right := words[1]
		lemma[right] = left

		if a, ok := lemmaInv[left]; ok {
			lemmaInv[left] = append(a, right)
		} else {
			lemmaInv[left] = []string{right}
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

}
