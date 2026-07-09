#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

required=(
  games.yaml
  tags.yaml
  src/games/hub/data/manifest.yaml
)

for path in "${required[@]}"; do
  test -f "$path"
  echo "present $path"
done

grep -q '^games:' games.yaml
grep -q '^tags:' tags.yaml
grep -q 'planned_games:' src/games/hub/data/manifest.yaml

echo "static-puzzles-catalog smoke ok"
