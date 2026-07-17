import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import { ensureTables } from './db.js'
import routes from './routes.js'

const app = express()
const PORT = parseInt(process.env.PORT || '5015', 10)

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'tango', timestamp: new Date().toISOString() })
})

app.use('/', routes)

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[tango] ${err.message}`)
  res.status(500).json({ error: 'Internal server error' })
})

const server = app.listen(PORT, () => {
  console.log(`[tango] listening on :${PORT}`)
})

process.on('SIGTERM', () => { server.close(() => process.exit(0)) })
process.on('SIGINT', () => { server.close(() => process.exit(0)) })

await ensureTables()
