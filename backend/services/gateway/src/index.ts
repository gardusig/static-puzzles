import express, { type Request, type Response } from 'express'
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware'

const app = express()
const PORT = parseInt(process.env.PORT || '8080', 10)

app.use(cors())

const SERVICES: Record<string, string> = {
  '/api/sudoku': process.env.SUDOKU_SERVICE_URL || 'http://localhost:5010',
  '/api/numerox': process.env.NUMEROX_SERVICE_URL || 'http://localhost:5011',
  '/api/numerox-letters': process.env.NUMEROX_LETTERS_SERVICE_URL || 'http://localhost:5012',
  '/api/logic-puzzles': process.env.LOGIC_PUZZLES_SERVICE_URL || 'http://localhost:5013',
  '/api/crosswords': process.env.CROSSWORDS_SERVICE_URL || 'http://localhost:5014',
  '/api/tango': process.env.TANGO_SERVICE_URL || 'http://localhost:5015',
  '/api/n-queens': process.env.N_QUEENS_SERVICE_URL || 'http://localhost:5016',
}

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'gateway', timestamp: new Date().toISOString() })
})

app.get('/api/services', (_req: Request, res: Response) => {
  res.json({ services: Object.keys(SERVICES) })
})

for (const [prefix, target] of Object.entries(SERVICES)) {
  app.use(prefix, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^${prefix}`]: '' },
  }))
}

const server = app.listen(PORT, () => {
  console.log(`[gateway] listening on :${PORT}`)
  for (const [prefix, target] of Object.entries(SERVICES)) {
    console.log(`  ${prefix} -> ${target}`)
  }
})

process.on('SIGTERM', () => { server.close(() => process.exit(0)) })
process.on('SIGINT', () => { server.close(() => process.exit(0)) })
