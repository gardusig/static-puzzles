/** Mirrors games.yaml — keep in sync when adding games. */
export default [
  { slug: 'sudoku', title: 'Sudoku', emoji: '🔢', status: 'planned', priority: 'high', route: '/play/sudoku', tags: ['grid', 'logic', 'newspaper'], blurb: '9×9 grids — notes and answer reveal.' },
  { slug: 'chess', title: 'Chess Puzzles', emoji: '♟️', status: 'planned', priority: 'high', route: '/play/chess', tags: ['board', 'logic'], blurb: 'Tactics and mate puzzles on a clear board.' },
  { slug: 'checkers', title: 'Checkers', emoji: '⚫', status: 'planned', priority: 'medium', route: '/play/checkers', tags: ['board', 'logic'], blurb: 'Jumps, kings, forced capture.' },
  { slug: 'go', title: 'Go Puzzles', emoji: '⚪', status: 'planned', priority: 'medium', route: '/play/go', tags: ['board', 'logic', 'placement'], blurb: 'Life-and-death on 9×9 or 19×19.' },
  { slug: 'logic-puzzles', title: 'Logic Puzzles', emoji: '🧩', status: 'planned', priority: 'medium', route: '/play/logic-puzzles', tags: ['grid', 'logic', 'newspaper'], blurb: 'Clues, categories, single solution.' },
  { slug: 'nonogram', title: 'Nonogram', emoji: '🖼️', status: 'planned', priority: 'medium', route: '/play/nonogram', tags: ['grid', 'logic', 'newspaper'], blurb: 'Picture logic from run-length clues.' },
  { slug: 'sorting-puzzle', title: 'Sorting Puzzle', emoji: '🧪', status: 'planned', priority: 'low', route: '/play/sorting-puzzle', tags: ['spatial', 'stack', 'sequence'], blurb: 'Pour tubes until colors stack.' },
  { slug: 'unscrew-puzzle', title: 'Unscrew Puzzle', emoji: '🔩', status: 'planned', priority: 'low', route: '/play/unscrew-puzzle', tags: ['spatial', 'sequence'], blurb: 'Remove bolts in valid order.' },
  { slug: 'bubble-shooter', title: 'Bubble Shooter', emoji: '🫧', status: 'planned', priority: 'low', route: '/play/bubble-shooter', tags: ['match', 'spatial'], blurb: 'Match clusters — step mode, no timer.' },
  { slug: 'domino', title: 'Domino', emoji: '🁢', status: 'planned', priority: 'medium', route: '/play/domino', tags: ['board', 'match'], blurb: 'Chain tiles by matching pips.' },
  { slug: 'spider-solitaire', title: 'Spider Solitaire', emoji: '🃏', status: 'planned', priority: 'medium', route: '/play/spider-solitaire', tags: ['stack', 'sequence'], blurb: 'Ten columns, suited runs, deal row.' },
  { slug: 'n-queens', title: 'N Queens', emoji: '♛', status: 'planned', priority: 'medium', route: '/play/n-queens', tags: ['grid', 'logic', 'placement'], blurb: 'N queens on N×N — no attacks.' },
  { slug: 'crosswords', title: 'Crosswords', emoji: '📝', status: 'planned', priority: 'low', route: '/play/crosswords', tags: ['word', 'grid', 'newspaper'], blurb: 'Clues and grid — check letter or word.' },
]

export const ISSUES_URL = 'https://github.com/gardusig/static-puzzles/issues?q=is%3Aissue+label%3Agame'
