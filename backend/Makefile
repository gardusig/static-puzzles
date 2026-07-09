.PHONY: test build run clean

BIN := bin/server

build:
	go build -o $(BIN) ./cmd/server

test:
	go test ./...
	bash scripts/smoke.sh

run: build
	./$(BIN)

clean:
	rm -rf $(BIN)
