export interface SudokuPuzzle {
  grid: number[][]
  solution: number[][]
  difficulty: string
}

function isValid(grid: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) return false
    if (grid[i][col] === num) return false
  }
  const br = Math.floor(row / 3) * 3
  const bc = Math.floor(col / 3) * 3
  for (let r = br; r < br + 3; r++)
    for (let c = bc; c < bc + 3; c++)
      if (grid[r][c] === num) return false
  return true
}

function solve(grid: number[][]): boolean {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (grid[r][c] === 0)
        for (let n = 1; n <= 9; n++)
          if (isValid(grid, r, c, n)) { grid[r][c] = n; if (solve(grid)) return true; grid[r][c] = 0 }
  return true
}

function shuffle(arr: number[]): number[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateSolution(): number[][] {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0))
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
  for (let i = 0; i < 9; i++) grid[0][i] = nums[i]
  solve(grid)
  return grid
}

function removeNumbers(solution: number[][], difficulty: string): number[][] {
  const puzzle = solution.map(row => [...row])
  const cells = 81
  const toRemove = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 55
  const indices = shuffle(Array.from({ length: cells }, (_, i) => i))
  for (let k = 0; k < toRemove; k++) {
    const r = Math.floor(indices[k] / 9)
    const c = indices[k] % 9
    puzzle[r][c] = 0
  }
  return puzzle
}

export function generateSudoku(difficulty: string = 'medium'): SudokuPuzzle {
  const solution = generateSolution()
  const grid = removeNumbers(solution, difficulty)
  return { grid, solution, difficulty }
}
