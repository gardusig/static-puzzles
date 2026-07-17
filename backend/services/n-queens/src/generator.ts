export interface NQueensPuzzle {
  boardSize: number
  clues: [number, number][]
  solution: number[][]
  difficulty: string
}

function isSafe(board: number[][], row: number, col: number): boolean {
  for (let i = 0; i < row; i++) if (board[i][col]) return false
  for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j]) return false
  for (let i = row, j = col; i >= 0 && j < board.length; i--, j++) if (board[i][j]) return false
  return true
}

function solve(board: number[][], row: number): boolean {
  if (row >= board.length) return true
  for (let col = 0; col < board.length; col++) {
    if (isSafe(board, row, col)) { board[row][col] = 1; if (solve(board, row + 1)) return true; board[row][col] = 0 }
  }
  return false
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }; return a
}

export function generateNQueens(difficulty: string = 'medium'): NQueensPuzzle {
  const boardSize = 8
  const solution: number[][] = Array.from({ length: boardSize }, () => Array(boardSize).fill(0))
  solve(solution, 0)

  const clueCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 3 : 2
  const indices: [number, number][] = []
  for (let r = 0; r < boardSize; r++) for (let c = 0; c < boardSize; c++) if (solution[r][c]) indices.push([r, c])

  const clues = shuffle(indices).slice(0, clueCount)
  return { boardSize, clues, solution, difficulty }
}
