lemmas:
	go run ./lemmas

index:
	go run ./api.cspapers.org/index -config default.index.config

server:
	GOOS=linux CGO_ENABLED=0 go build -ldflags="-s -w" -o server ./api.cspapers.org/server/