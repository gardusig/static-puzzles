export interface NumeroxPuzzle {
  grid: number[][]
  solution: number[][]
  difficulty: string
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }; return a
}

export function generateNumerox(difficulty: string = 'medium'): NumeroxPuzzle {
  const size = 6
  const solution: number[][] = Array.from({ length: size }, () => Array(size).fill(0))
  const nums = shuffle([1, 2, 3, 4, 5, 6])
  for (let i = 0; i < size; i++) solution[0][i] = nums[i]
  for (let r = 1; r < size; r++)
    for (let c = 0; c < size; c++)
      solution[r][c] = ((solution[0][c] + r - 1) % size) + 1

  const clues = difficulty === 'easy' ? 18 : difficulty === 'medium' ? 12 : 8
  const grid = solution.map(row => [...row])
  const indices = shuffle(Array.from({ length: size * size }, (_, i) => i))
  for (let k = 0; k < size * size - clues; k++) {
    grid[Math.floor(indices[k] / size)][indices[k] % size] = 0
  }

  return { grid, solution, difficulty }
}
