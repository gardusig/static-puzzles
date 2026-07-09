FROM golang:1.22-bookworm AS test
WORKDIR /workspace
RUN apt-get update \
  && apt-get install -y --no-install-recommends bash make curl \
  && rm -rf /var/lib/apt/lists/*
COPY . .
RUN go mod download
RUN .workflows/verify-layout.sh
RUN make test

FROM golang:1.22-bookworm AS runtime
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /app/server ./cmd/server
ENV PORT=8080
EXPOSE 8080
CMD ["/app/server"]
