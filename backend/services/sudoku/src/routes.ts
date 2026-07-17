import { Router, type Request, type Response } from 'express'
import { generateSudoku } from './generator.js'
import { getPuzzle, putPuzzle, getRandomPuzzle, saveProgress, getProgress } from './db.js'

const router = Router()

router.get('/puzzle', async (req: Request, res: Response) => {
  const difficulty = (req.query.difficulty as string) || 'medium'

  let puzzle = await getRandomPuzzle(difficulty)
  if (!puzzle) {
    const generated = generateSudoku(difficulty)
    const id = `puzzle_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    puzzle = { id, data: generated.grid, solution: generated.solution, difficulty }
    await putPuzzle({ id, data: generated.grid, solution: generated.solution, difficulty })
  }

  res.json({
    id: puzzle.id,
    grid: puzzle.data,
    difficulty: puzzle.difficulty,
  })
})

router.get('/puzzle/:id', async (req: Request, res: Response) => {
  const puzzle = await getPuzzle(req.params.id)
  if (!puzzle) { res.status(404).json({ error: 'not found' }); return }
  res.json({ id: puzzle.id, grid: puzzle.data, difficulty: puzzle.difficulty })
})

router.post('/check', async (req: Request, res: Response) => {
  const { puzzleId, grid } = req.body
  const puzzle = await getPuzzle(puzzleId)
  if (!puzzle) { res.status(404).json({ error: 'not found' }); return }

  const solution = puzzle.solution as number[][]
  const correct = JSON.stringify(grid) === JSON.stringify(solution)
  const errors: [number, number][] = []
  if (!correct) {
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (grid[r]?.[c] !== solution[r]?.[c]) errors.push([r, c])
  }

  res.json({ correct, errors: errors.slice(0, 10) })
})

router.post('/progress', async (req: Request, res: Response) => {
  const { userId, puzzleId, state, solved } = req.body
  await saveProgress(userId, puzzleId, state, solved)
  res.json({ saved: true })
})

router.get('/progress/:userId/:puzzleId', async (req: Request, res: Response) => {
  const progress = await getProgress(req.params.userId, req.params.puzzleId)
  if (!progress) { res.status(404).json({ error: 'not found' }); return }
  res.json(progress)
})

export default router
