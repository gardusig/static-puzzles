import { Router, type Request, type Response } from 'express'
import { generateLogicPuzzle } from './generator.js'
import { getPuzzle, putPuzzle, getRandomPuzzle, saveProgress, getProgress } from './db.js'

const router = Router()

router.get('/puzzle', async (req: Request, res: Response) => {
  const difficulty = (req.query.difficulty as string) || 'medium'
  let puzzle = await getRandomPuzzle(difficulty)
  if (!puzzle) {
    const g = generateLogicPuzzle(difficulty)
    const id = `puzzle_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    await putPuzzle({ id, data: { clues: g.clues, categories: g.categories }, solution: g.solution, difficulty })
    puzzle = { id, data: { clues: g.clues, categories: g.categories }, solution: g.solution, difficulty }
  }
  res.json({ id: puzzle.id, clues: (puzzle.data as Record<string, unknown>).clues, categories: (puzzle.data as Record<string, unknown>).categories, difficulty: puzzle.difficulty })
})

router.get('/puzzle/:id', async (req: Request, res: Response) => {
  const puzzle = await getPuzzle(req.params.id)
  if (!puzzle) { res.status(404).json({ error: 'not found' }); return }
  res.json({ id: puzzle.id, clues: (puzzle.data as Record<string, unknown>).clues, categories: (puzzle.data as Record<string, unknown>).categories, difficulty: puzzle.difficulty })
})

router.post('/check', async (req: Request, res: Response) => {
  const { puzzleId, answers } = req.body
  const puzzle = await getPuzzle(puzzleId)
  if (!puzzle) { res.status(404).json({ error: 'not found' }); return }
  const solution = puzzle.solution as Record<string, string>
  const correct = JSON.stringify(answers) === JSON.stringify(solution)
  res.json({ correct })
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
