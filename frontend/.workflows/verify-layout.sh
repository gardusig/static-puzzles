#!/usr/bin/env bash
set -euo pipefail
test -d src/launcher/frontend
test -f src/launcher/frontend/package.json
test -d test
test -d scripts
test -f Dockerfile
