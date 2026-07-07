# static-puzzles

Solo browser puzzles — newspaper vibe, Chrome first, no GPU drama.

Not multiplayer. Not 3D. Open a puzzle, think, close.

## Games (all planned — see issues)

| Game | Slug | Route |
|------|------|-------|
| Sudoku | `sudoku` | `/play/sudoku` |
| Chess puzzles | `chess` | `/play/chess` |
| Checkers | `checkers` | `/play/checkers` |
| Go puzzles | `go` | `/play/go` |
| Logic puzzles | `logic-puzzles` | `/play/logic-puzzles` |
| Nonogram | `nonogram` | `/play/nonogram` |
| Sorting (water tubes) | `sorting-puzzle` | `/play/sorting-puzzle` |
| Unscrew | `unscrew-puzzle` | `/play/unscrew-puzzle` |
| Bubble shooter | `bubble-shooter` | `/play/bubble-shooter` |
| Domino | `domino` | `/play/domino` |
| Spider solitaire | `spider-solitaire` | `/play/spider-solitaire` |
| N queens | `n-queens` | `/play/n-queens` |
| Crosswords | `crosswords` | `/play/crosswords` |

**Todo = GitHub issues.** One issue per slug, label `game`. List: [`docs/GAMES.md`](docs/GAMES.md). Specs: [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md).

Create issues directly in GitHub using the game template.

## Tags

Generic tags in [`tags.yaml`](tags.yaml) — `board`, `grid`, `logic`, `offline`, `newspaper`, etc. Use on issues/PRs, not per-game label sprawl.

## Catalog

[`games.yaml`](games.yaml) is source of truth. Fields: `status`, `priority`, `github_issue`, `tags`, `requirements`.

## Run launcher (picker only for now)

```bash
cd src/launcher/frontend
npm install
npm run dev
```

http://localhost:8091

## Layout

```
games.yaml              # catalog + issue pointers
tags.yaml               # generic tags
docs/
  REQUIREMENTS.md       # per-game Must/Should/Data
  GAMES.md              # issue todo table
  GOALS.md              # product scope
src/games/{slug}/data/      # puzzle banks (CSV/JSON)
src/launcher/frontend/      # Chrome hub
```

Backend optional — validate client-side where possible.

## Principles

- Chrome, static or step-based UI
- Offline after first load
- Puzzle data in git
- Clear errors; hint + reveal answer OK
