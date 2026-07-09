#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRONT="$ROOT/src/launcher/frontend"
cd "$FRONT"

required=(
  package.json
  vite.config.js
  index.html
  src/main.jsx
  src/App.jsx
  src/gamesCatalog.js
)

for path in "${required[@]}"; do
  test -f "$path"
  echo "present $path"
done

test -d dist
grep -q 'Static Puzzles' dist/index.html
grep -q 'sudoku' src/gamesCatalog.js

echo "static-puzzles-frontend smoke ok"
