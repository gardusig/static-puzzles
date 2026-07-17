# Games — issue todo list

Every game in `games.yaml` is **one GitHub issue**. The repo ships when issues close.

| Status | Game | Slug | Issue | Priority |
|--------|------|------|-------|----------|
| planned | Sudoku | `sudoku` | — | high |
| planned | Chess Puzzles | `chess` | — | high |
| planned | Checkers | `checkers` | — | medium |
| planned | Go Puzzles | `go` | — | medium |
| planned | Logic Puzzles | `logic-puzzles` | — | medium |
| planned | Nonogram | `nonogram` | — | medium |
| planned | Sorting Puzzle | `sorting-puzzle` | — | low |
| planned | Unscrew Puzzle | `unscrew-puzzle` | — | low |
| planned | Bubble Shooter | `bubble-shooter` | — | low |
| planned | Domino | `domino` | — | medium |
| planned | Spider Solitaire | `spider-solitaire` | — | medium |
| planned | N Queens | `n-queens` | — | medium |
| planned | Crosswords | `crosswords` | — | low |

## Workflow

1. Open an issue with the **Game** template (label `game`, slug in title).
2. Copy the **Must** checklist from [`REQUIREMENTS.md`](REQUIREMENTS.md) into the issue body.
3. Implement under `src/games/{slug}/` + route `/play/{slug}`.
4. Set `status: active` in `games.yaml` and fill `github_issue: <number>` when done.

## Create issues from catalog

Open issues directly in GitHub using the Game template. After creation, update `github_issue` fields in `games.yaml` and this table.

## Tags

Generic tags live in [`tags.yaml`](../tags.yaml). Use them on issues and PRs — not game-specific labels.
