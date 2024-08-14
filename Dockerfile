FROM golang:1.22 AS build
WORKDIR /src
COPY . .
RUN make index
RUN make server

FROM alpine:latest
WORKDIR /
COPY --from=build /src/server /server
COPY --from=build /src/db.cspapers.org /db.cspapers.org
COPY ./default.server.config /default.server.config
CMD ["/server", "-config", "/default.server.config"]
EXPOSE 8000