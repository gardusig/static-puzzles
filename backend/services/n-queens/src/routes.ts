import { Router, type Request, type Response } from 'express'
import { generateNQueens } from './generator.js'
import { getPuzzle, putPuzzle, getRandomPuzzle, saveProgress, getProgress } from './db.js'

const router = Router()

router.get('/puzzle', async (req: Request, res: Response) => {
  const difficulty = (req.query.difficulty as string) || 'medium'
  let puzzle = await getRandomPuzzle(difficulty)
  if (!puzzle) {
    const g = generateNQueens(difficulty)
    const id = `puzzle_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    await putPuzzle({ id, data: g.clues, solution: g.solution, difficulty })
    puzzle = { id, data: g.clues, solution: g.solution, difficulty }
  }
  res.json({ id: puzzle.id, clues: puzzle.data, boardSize: 8, difficulty: puzzle.difficulty })
})

router.get('/puzzle/:id', async (req: Request, res: Response) => {
  const puzzle = await getPuzzle(req.params.id)
  if (!puzzle) { res.status(404).json({ error: 'not found' }); return }
  res.json({ id: puzzle.id, clues: puzzle.data, boardSize: 8, difficulty: puzzle.difficulty })
})

router.post('/check', async (req: Request, res: Response) => {
  const { puzzleId, board } = req.body
  const puzzle = await getPuzzle(puzzleId)
  if (!puzzle) { res.status(404).json({ error: 'not found' }); return }
  const solution = puzzle.solution as number[][]
  const correct = JSON.stringify(board) === JSON.stringify(solution)
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
