export interface TangoPuzzle {
  grid: string[][]
  solution: string[][]
  clues: [number, number][]
  difficulty: string
}

const SIZE = 6

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }; return a
}

function isValid(grid: string[][], row: number, col: number): boolean {
  if (grid[row][col] === '') return true
  const val = grid[row][col]
  const rowCount = grid[row].filter(c => c === val).length
  const colCount = grid.filter(r => r[col] === val).length

  if (rowCount > 3 || colCount > 3) return false

  if (col >= 2 && grid[row][col - 1] === val && grid[row][col - 2] === val) return false
  if (row >= 2 && grid[row - 1][col] === val && grid[row - 2][col] === val) return false

  return true
}

function generateSolution(): string[][] {
  for (let attempt = 0; attempt < 1000; attempt++) {
    const grid: string[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(''))

    for (let r = 0; r < SIZE; r++) {
      let zeros = 0, ones = 0
      for (let c = 0; c < SIZE; c++) {
        const candidates = shuffle(zeros < 3 && ones < 3 ? ['0', '1'] : zeros >= 3 ? ['1'] : ['0'])
        for (const v of candidates) {
          grid[r][c] = v
          if (isValid(grid, r, c)) { if (v === '0') zeros++; else ones++; break }
          grid[r][c] = ''
        }
        if (grid[r][c] === '') { grid.length = 0; break }
      }
      if (grid.length === 0) break
    }

    if (grid.length === SIZE && grid.every(row => row.every(c => c !== ''))) {
      for (let c = 0; c < SIZE; c++) {
        const col = grid.map(r => r[c])
        if (col.filter(v => v === '0').length !== 3 || col.filter(v => v === '1').length !== 3) {
          grid.length = 0; break
        }
      }
      if (grid.length === SIZE) return grid
    }
  }
  return Array.from({ length: SIZE }, () => ['0', '1', '0', '1', '0', '1'])
}

function removeCells(solution: string[][], difficulty: string): [number, number][] {
  const total = SIZE * SIZE
  const toKeep = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 14 : 8
  const indices = shuffle(Array.from({ length: total }, (_, i) => i))
  return indices.slice(0, toKeep).map(i => [Math.floor(i / SIZE), i % SIZE]) as [number, number][]
}

export function generateTango(difficulty: string = 'medium'): TangoPuzzle {
  const solution = generateSolution()
  const clues = removeCells(solution, difficulty)
  const grid = solution.map(row => [...row])
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (!clues.some(([cr, cc]) => cr === r && cc === c)) grid[r][c] = ''
  return { grid, solution, clues, difficulty }
}
