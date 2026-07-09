# gardusig/static-puzzles-catalog

YAML catalog and puzzle data for static-puzzles — `games.yaml`, `tags.yaml`, and per-game `data/` trees.

## Quick start

```bash
make test
```

## Layout

- `games.yaml` — game slugs, status, priority, routes, tags, requirements pointers
- `tags.yaml` — generic tags (`board`, `grid`, `logic`, `offline`, …)
- `src/games/{slug}/data/` — versioned puzzle banks (CSV/JSON)
