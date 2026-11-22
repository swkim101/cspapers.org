FROM alpine:latest
WORKDIR /app

COPY server ./server
COPY lemma.gob lemmaInv.gob full.server.config ./
COPY data/bleve-2026-11-17/ ./data/bleve-2026-11-17/

EXPOSE 8000
CMD ["./server", "-config", "full.server.config"]
