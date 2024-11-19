FROM golang:1.22 AS build
WORKDIR /src
COPY . .
RUN make lemmas -B
RUN make server -B
RUN make index -B

FROM alpine:latest
WORKDIR /
COPY --from=build /src/server /server
COPY --from=build /src/db.cspapers.org /db.cspapers.org
COPY ./default.server.config /default.server.config
COPY --from=build /src/lemma.gob /lemma.gob
COPY --from=build /src/lemmaInv.gob /lemmaInv.gob
CMD ["/server", "-config", "/default.server.config"]
EXPOSE 8000