# build stage
FROM golang:1.18-alpine AS build
LABEL stage="builder"

WORKDIR /src

RUN apk update && \
    apk add --no-cache --update --no-progress \
    build-base \
    librdkafka-dev

COPY . .

RUN go mod download
RUN CGO_ENABLED=1 CC=gcc go build -tags musl --ldflags '-linkmode external -extldflags=-static' -o /out/app .

# deploy stage
FROM alpine:3.16 AS bin

WORKDIR /src/data
COPY --from=build /src/src/data .

WORKDIR /
RUN apk add bash

COPY --from=build /out/app /app
COPY --from=build /src/.env .

ENTRYPOINT [ "/app" ]
