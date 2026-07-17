export interface GameEntry {
  slug: string
  title: string
  emoji: string
  route: string
  remote: string
  port: number
  tags: string[]
  blurb: string
}

const catalog: GameEntry[] = [
  { slug: 'sudoku', title: 'Sudoku', emoji: '🔢', route: '/play/sudoku', remote: 'gameSudoku', port: 5001, tags: ['grid', 'logic', 'newspaper'], blurb: '9×9 grid with notes and answer reveal.' },
  { slug: 'numerox', title: 'Numerox', emoji: '🔢', route: '/play/numerox', remote: 'gameNumerox', port: 5002, tags: ['numbers', 'logic'], blurb: 'Number placement puzzle.' },
  { slug: 'numerox-letters', title: 'Numerox Letters', emoji: '🔤', route: '/play/numerox-letters', remote: 'gameNumeroxLetters', port: 5003, tags: ['letters', 'logic', 'word'], blurb: 'Letter-based numerox variant.' },
  { slug: 'logic-puzzles', title: 'Logic Puzzles', emoji: '🧩', route: '/play/logic-puzzles', remote: 'gameLogicPuzzles', port: 5004, tags: ['grid', 'logic', 'newspaper'], blurb: 'Clues, categories, single solution.' },
  { slug: 'crosswords', title: 'Crosswords', emoji: '📝', route: '/play/crosswords', remote: 'gameCrosswords', port: 5005, tags: ['word', 'grid', 'newspaper'], blurb: 'Clues and grid — check letter or word.' },
  { slug: 'tango', title: 'Tango', emoji: '💃', route: '/play/tango', remote: 'gameTango', port: 5006, tags: ['grid', 'logic', 'binary'], blurb: '0-1 grid — no 3 equal consecutively, equal count per row/col.' },
  { slug: 'n-queens', title: 'N Queens', emoji: '♛', route: '/play/n-queens', remote: 'gameNQueens', port: 5007, tags: ['grid', 'logic', 'placement'], blurb: 'Place N queens on N×N so none attack each other.' },
]

export default catalog
