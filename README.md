# gardusig/static-puzzles

Production static puzzle games. **Meta-repo only** — leaf code in submodules.

```bash
git submodule update --init --recursive
```

## Leaf submodules

| Path | Repository | Role |
| --- | --- | --- |
| [`frontend/`](frontend/README.md) | [gardusig/static-puzzles-frontend](https://github.com/gardusig/static-puzzles-frontend) | TypeScript launcher and game shell |
| [`backend/`](backend/README.md) | [gardusig/static-puzzles-backend](https://github.com/gardusig/static-puzzles-backend) | Go catalog API |
| [`catalog/`](catalog/README.md) | [gardusig/static-puzzles-catalog](https://github.com/gardusig/static-puzzles-catalog) | `games.yaml` + puzzle data |
| [`docs/`](docs/README.md) | [gardusig/static-puzzles-docs](https://github.com/gardusig/static-puzzles-docs) | GAMES + REQUIREMENTS |

**Parent:** [gardusig/full-stack](https://github.com/gardusig/full-stack) · **Hub:** `public/full-stack/static-puzzles/`.
