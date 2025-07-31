FROM golang:1.24 AS build
WORKDIR /
COPY . .
RUN make lemmas -B
RUN make server -B

FROM alpine:latest
WORKDIR /
COPY --from=build /server /server
COPY ./default.server.config /default.server.config
COPY ./db.cspapers.org /db.cspapers.org
COPY --from=build /lemma.gob /lemma.gob
COPY --from=build /lemmaInv.gob /lemmaInv.gob
CMD ["/server", "-config", "/default.server.config"]
EXPOSE 8000
