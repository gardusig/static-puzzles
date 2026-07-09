# gardusig/static-puzzles-backend

Minimal Go API for the static-puzzles catalog — `GET /games` returns JSON from `data/games.yaml`.

## Quick start

```bash
make test
make run
curl -s localhost:8080/games | head
```

## Layout

- `cmd/server/main.go` — HTTP server (`/health`, `/games`)
- `data/games.yaml` — catalog snapshot
- `internal/catalog/` — YAML loader
