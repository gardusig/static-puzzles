#!/usr/bin/env bash
set -euo pipefail
test -f go.mod
test -f cmd/server/main.go
test -f data/games.yaml
test -d test
test -d scripts
test -f Dockerfile
