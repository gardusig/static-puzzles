export interface CrosswordPuzzle {
  grid: string[][]
  clues: { across: { number: number; clue: string; answer: string }[]; down: { number: number; clue: string; answer: string }[] }
  solution: string[][]
  difficulty: string
}

const WORD_POOL: Record<string, { clue: string; answer: string }[]> = {
  easy: [
    { clue: 'Opposite of hot', answer: 'COLD' },
    { clue: 'Feline pet', answer: 'CAT' },
    { clue: 'Celestial body', answer: 'STAR' },
    { clue: 'Body of water', answer: 'LAKE' },
    { clue: 'Large primate', answer: 'APE' },
    { clue: 'Frozen water', answer: 'ICE' },
    { clue: 'Canine pet', answer: 'DOG' },
    { clue: 'Ocean', answer: 'SEA' },
  ],
  medium: [
    { clue: 'Capital of France', answer: 'PARIS' },
    { clue: 'Largest planet', answer: 'JUPITER' },
    { clue: 'Author of Hamlet', answer: 'SHAKESPEARE' },
    { clue: 'Chemical symbol for gold', answer: 'AU' },
    { clue: 'Painting technique', answer: 'FRESCO' },
  ],
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }; return a
}

export function generateCrossword(difficulty: string = 'medium'): CrosswordPuzzle {
  const pool = WORD_POOL[difficulty] || WORD_POOL.medium
  const selected = shuffle(pool).slice(0, 4)
  const maxLen = Math.max(...selected.map(w => w.answer.length))
  const size = maxLen + 2

  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''))
  const solution: string[][] = Array.from({ length: size }, () => Array(size).fill(''))

  const across: { number: number; clue: string; answer: string }[] = []
  const down: { number: number; clue: string; answer: string }[] = []

  let num = 1
  let row = 1
  for (const word of selected.slice(0, 2)) {
    const col = 1
    for (let c = 0; c < word.answer.length; c++) {
      solution[row][col + c] = word.answer[c]
      grid[row][col + c] = ''
    }
    across.push({ number: num, clue: word.clue, answer: word.answer })
    num++; row += 2
  }

  row = 1
  for (const word of selected.slice(2, 4)) {
    const startCol = 1
    for (let r = 0; r < word.answer.length; r++) {
      solution[row + r][startCol] = word.answer[r]
      grid[row + r][startCol] = ''
    }
    down.push({ number: num, clue: word.clue, answer: word.answer })
    num++; row += 2
  }

  return { grid, clues: { across, down }, solution, difficulty }
}
