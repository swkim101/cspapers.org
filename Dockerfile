FROM golang:1.22 AS build
WORKDIR /src
COPY . .
RUN make index
RUN make server

FROM alpine:latest
WORKDIR /
COPY --from=build /src/server /server
COPY --from=build /src/db.cspapers.org /db.cspapers.org
COPY ./conf.json /conf.json
CMD ["/server", "-config", "/conf.json"]
EXPOSE 8000