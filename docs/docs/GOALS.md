# Static puzzles — product goals

## Who this is for

Players who want **quiet, focused logic** — not collection grinds or PvP. You open sudoku to think; you close it when done.

## Not in scope

- Multiplayer / matchmaking
- Heavy animation or 3D boards
- Large image assets in the repo
- Cross-linking to interactive game docs (different intent)

## Success criteria

- Load a puzzle in under 2 seconds on a static build
- Play entire session without network (after first load)
- Clear error states (“invalid move”, “row complete”)
- One tap to reveal answer with explanation where applicable

## Data model (sketch)

```
data/
  manifest.yaml
  sudoku/puzzles.csv      # id, difficulty, givens, solution
  chess/puzzles.csv       # id, fen, solution_moves
  crosswords/clues.csv    # id, grid_size, clues_json, solution
```

## Routes

```
/play/static-puzzles           → puzzle picker
/play/static-puzzles/sudoku  → play
/play/static-puzzles/chess
...
```
