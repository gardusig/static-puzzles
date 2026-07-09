#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

pairs=(
  docs/GAMES.md:docs/GAMES.txt
  docs/REQUIREMENTS.md:docs/REQUIREMENTS.txt
  docs/GOALS.md:docs/GOALS.txt
)

for pair in "${pairs[@]}"; do
  md="${pair%%:*}"
  txt="${pair##*:}"
  test -f "$md"
  test -f "$txt"
  echo "present $md and $txt"
done

grep -q 'sudoku' docs/GAMES.md docs/GAMES.txt
grep -q 'Must' docs/REQUIREMENTS.md docs/REQUIREMENTS.txt
grep -q 'Success criteria' docs/GOALS.md docs/GOALS.txt

echo "static-puzzles-docs smoke ok"
