# static-puzzles

**Newspaper-style logic puzzles** for Chrome — solo, offline-friendly, minimal animation.

Sudoku, chess puzzles, checkers, crosswords. Clear UI over flashy graphics. Works like puzzles in a paper: quiet, focused, no multiplayer.

## Games (planned)

| Game | Route |
|------|--------|
| Sudoku | `/play/sudoku` |
| Chess puzzles | `/play/chess` |
| Checkers | `/play/checkers` |
| Crosswords | `/play/crosswords` |

## Principles

- **Chrome-first** — runs in the browser, no install required
- **Offline-capable** — puzzle data in git as CSV/JSON
- **No GPU pressure** — static grids and text, 60fps trivial
- **Single player** — sharpen the mind alone

## Quick start

```bash
cd launcher/frontend && npm install && npm run dev
```

Open http://localhost:8091

## Stack

```
launcher/frontend   → puzzle picker + routes
games/{sudoku,...}/   → per-puzzle micro-frontends + data/
```

Backend optional — most puzzles validate client-side.
