#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

make build

PORT="${PORT:-18080}"
export PORT
./bin/server &
pid=$!
trap 'kill "$pid" 2>/dev/null || true' EXIT

for _ in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:${PORT}/health" >/dev/null 2>&1; then
    break
  fi
  sleep 0.2
done

body="$(curl -fsS "http://127.0.0.1:${PORT}/games")"
echo "$body" | grep -q '"slug":"sudoku"'
echo "$body" | grep -q '"count":'

echo "static-puzzles-backend smoke ok"
