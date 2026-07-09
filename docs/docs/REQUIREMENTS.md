# Game requirements

Each game below is a **todo**: one GitHub issue per slug (label `game`). Ship when every **Must** item passes in Chrome.

Shared **Must** for all games:

- Runs in Chrome without install; static or step-based UI
- Puzzle data versioned under `src/games/{slug}/data/` (CSV/JSON)
- Solo play; no network after first load
- Invalid moves show a clear message; optional hint and reveal-answer
- Keyboard accessible where clicks are primary input

---

## sudoku {#sudoku}

**Must**

- 9×9 grid with 3×3 boxes; givens immutable
- Cell notes (candidates) toggle per cell
- Check row/column/box or full grid; highlight conflicts
- Reveal single cell or full solution with undo before lock

**Should**

- Difficulty tiers (easy / medium / hard) from puzzle bank
- Import puzzle from string (81-char)

**Data**: `puzzles.csv` — `id`, `difficulty`, `givens`, `solution`

---

## chess {#chess}

**Must**

- Board from FEN; side to move enforced
- Legal move generation; illegal moves rejected
- Puzzle mode: goal stated (mate in N, win material, etc.)
- Solution line or single winning move validated

**Should**

- Arrow keys or click-drag pieces; promotion picker
- Step backward through solution line after reveal

**Data**: `puzzles.csv` — `id`, `fen`, `goal`, `solution_moves` (SAN or UCI)

---

## checkers {#checkers}

**Must**

- 8×8 draughts; forced capture when available
- King promotion on back rank
- Multi-jump chains in one turn
- Win/draw detection (no moves, repetition optional later)

**Should**

- Hint: highlight one legal jump
- Play vs puzzle: reach position or capture all

**Data**: `puzzles.csv` — `id`, `position`, `side`, `goal`, `solution`

---

## go {#go}

**Must**

- Board sizes 9×9 (default) and 19×19
- Place stone on empty intersection; suicide and ko rules
- Life-and-death puzzles: mark stones dead/alive or capture group
- Validate against puzzle solution (unique or listed variants)

**Should**

- Territory scoring tutorial mode (separate from tsumego)
- Pass and reset

**Data**: `puzzles.csv` — `id`, `size`, `setup`, `task`, `solution`

---

## logic-puzzles {#logic-puzzles}

**Must**

- Grid of categories (people, houses, colors, etc.) with clue list
- Deduction cells: user marks X (eliminate) or O (assign)
- Check consistency; reveal when solved
- Single solution per puzzle id

**Should**

- Classic templates: zebra, ordering, grid size 3–5 categories
- Print-friendly layout

**Data**: `puzzles.json` — `id`, `categories`, `clues`, `solution_grid`

---

## nonogram {#nonogram}

**Must**

- Row and column clue arrays (run lengths)
- Fill / empty / unknown per cell
- Line completion feedback (optional auto-cross)
- Solved picture matches solution bitmap

**Should**

- Sizes 5×5 through 25×25
- Palette not required — binary fill is enough v1

**Data**: `puzzles.csv` — `id`, `width`, `height`, `row_clues`, `col_clues`, `solution`

---

## sorting-puzzle {#sorting-puzzle}

**Must**

- N tubes (columns); each holds stacked colored layers
- Pour top layer to another tube if color matches and space exists
- Win when each tube is single color (or empty)
- Move counter; undo last pour

**Should**

- 4–8 tubes; no hidden colors in v1
- Preset level packs by difficulty

**Data**: `levels.json` — `id`, `tubes`, `moves_par`

---

## unscrew-puzzle {#unscrew-puzzle}

**Must**

- Bolts/plates in layers; only exposed bolts removable
- Collision order enforced (blocked bolt cannot be removed)
- Visual stack or top-down layers
- Level complete when all bolts removed

**Should**

- Undo; minimal animation (fade/slide only)
- 20+ levels in data

**Data**: `levels.json` — `id`, `layers`, `bolt_order_solution`

---

## bubble-shooter {#bubble-shooter}

**Must**

- Grid of bubbles; shooter aims on click or angle keys
- Match 3+ same color on attach; gravity drop clusters
- **Step mode**: no timer; shoot on confirm
- Out of shots / clear board win-lose states

**Should**

- Ceiling drop every N shots (classic rule)
- Color count 3–5 per level

**Data**: `levels.json` — `id`, `grid`, `colors`, `shots_limit`

---

## domino {#domino}

**Must**

- Standard pip tiles; chain from start tile
- Place only matching pip count on open ends
- Draw from boneyard when no play (solo puzzle: fixed draw order)
- Puzzle goal: empty hand or complete chain

**Should**

- Double spinner optional off in v1
- Drag tile to valid end only

**Data**: `puzzles.csv` — `id`, `hand`, `chain_start`, `boneyard_order`, `solution_plays`

---

## spider-solitaire {#spider-solitaire}

**Must**

- 10 columns; 1/2/4 suits variant selectable
- Build descending runs same suit; move run to empty column
- Deal row when no moves (stock)
- Win when all cards cleared to foundations (8 stacks × K→A)

**Should**

- Undo; highlight movable runs
- One-suit mode for easier onboarding

**Data**: optional seeded `deals.csv` — `id`, `seed`, `suits`; else client shuffle from seed

---

## n-queens {#n-queens}

**Must**

- N×N board; place N queens, no mutual attack
- Toggle queen on cell; attack lines shown on check
- Validate complete placement
- Modes: find one solution / count solutions / puzzle givens

**Should**

- N = 4–12 in UI
- Preplaced givens for puzzle mode

**Data**: `puzzles.csv` — `id`, `n`, `givens`, `solution` or `solution_count`

---

## crosswords {#crosswords}

**Must**

- Grid with blocked cells; across/down clues
- Type in cell; arrow keys move focus
- Check letter, word, or full puzzle
- Reveal letter/word with confirmation

**Should**

- Symmetric grid optional
- Import from .puz or JSON v1

**Data**: `puzzles.json` — `id`, `width`, `height`, `grid`, `clues`, `solution`
