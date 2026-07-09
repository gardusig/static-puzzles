#!/usr/bin/env bash
set -euo pipefail
test -f games.yaml
test -f tags.yaml
test -d src/games
test -d test
test -d scripts
test -f Dockerfile
