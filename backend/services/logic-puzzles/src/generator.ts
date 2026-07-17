export interface LogicPuzzle {
  clues: { description: string; category: string; value: string }[]
  categories: { name: string; items: string[] }[]
  solution: Record<string, string>
  difficulty: string
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }; return a
}

const THEMES = [
  { categories: [
    { name: 'Person', items: ['Alice', 'Bob', 'Carol', 'Dave'] },
    { name: 'Pet', items: ['Cat', 'Dog', 'Fish', 'Bird'] },
    { name: 'Color', items: ['Red', 'Blue', 'Green', 'Yellow'] },
  ]},
]

export function generateLogicPuzzle(difficulty: string = 'medium'): LogicPuzzle {
  const theme = THEMES[0]
  const shuffled = theme.categories.map(c => ({ ...c, items: shuffle(c.items) }))

  const solution: Record<string, string> = {}
  for (let i = 0; i < shuffled[0].items.length; i++)
    for (const cat of shuffled)
      solution[`${cat.name}:${cat.items[i]}`] = shuffled[0].items[i]

  const clues: { description: string; category: string; value: string }[] = []
  const numClues = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 4 : 3
  const pairs: [number, number][] = []
  for (let i = 0; i < shuffled[0].items.length; i++)
    for (let j = i + 1; j < shuffled[0].items.length; j++)
      pairs.push([i, j])

  const selected = shuffle(pairs).slice(0, numClues)
  for (const [i, j] of selected) {
    const cat1 = shuffled[1]; const cat2 = shuffled[2]
    clues.push({
      description: `${cat1.items[i]} is paired with ${cat2.items[j]}`,
      category: cat1.name,
      value: cat1.items[i],
    })
  }

  return { clues, categories: shuffled, solution, difficulty }
}
