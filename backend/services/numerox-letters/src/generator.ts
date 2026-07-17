export interface NumeroxLettersPuzzle {
  grid: string[][]
  solution: string[][]
  words: string[]
  difficulty: string
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }; return a
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function generateNumeroxLetters(difficulty: string = 'medium'): NumeroxLettersPuzzle {
  const size = 5
  const words: string[] = []
  const solution: string[][] = Array.from({ length: size }, () => Array(size).fill(''))

  const chosen = shuffle(LETTERS.split('')).slice(0, size)
  for (let i = 0; i < size; i++) solution[0][i] = chosen[i]
  for (let r = 1; r < size; r++)
    for (let c = 0; c < size; c++) {
      const idx = (chosen.indexOf(solution[0][c]) + r) % size
      solution[r][c] = chosen[idx]
    }
  for (let r = 0; r < size; r++) words.push(solution[r].join(''))
  for (let c = 0; c < size; c++) words.push(solution.map(r => r[c]).join(''))

  const clues = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : 6
  const grid = solution.map(row => [...row])
  const indices = shuffle(Array.from({ length: size * size }, (_, i) => i))
  for (let k = 0; k < size * size - clues; k++) {
    grid[Math.floor(indices[k] / size)][indices[k] % size] = ''
  }

  return { grid, solution, words, difficulty }
}
