import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

const app = express()
const PORT = parseInt(process.env.PORT || '8080', 10)

const services: Record<string, string> = {
  '/api/sudoku': process.env.SUDOKU_SERVICE_URL || 'http://localhost:5010',
  '/api/numerox': process.env.NUMEROX_SERVICE_URL || 'http://localhost:5011',
  '/api/numerox-letters': process.env.NUMEROX_LETTERS_SERVICE_URL || 'http://localhost:5012',
  '/api/logic-puzzles': process.env.LOGIC_PUZZLES_SERVICE_URL || 'http://localhost:5013',
  '/api/crosswords': process.env.CROSSWORDS_SERVICE_URL || 'http://localhost:5014',
  '/api/tango': process.env.TANGO_SERVICE_URL || 'http://localhost:5015',
  '/api/n-queens': process.env.N_QUEENS_SERVICE_URL || 'http://localhost:5016',
}

app.get('/health', (_req, res) => {
  res.send('ok')
})

app.get('/api/services', (_req, res) => {
  res.json({ services: Object.keys(services) })
})

for (const [prefix, target] of Object.entries(services)) {
  app.use(prefix, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^${prefix}`]: '' },
  }))
}

app.listen(PORT, () => {
  console.log(`gateway listening on :${PORT}`)
  for (const [prefix, target] of Object.entries(services)) {
    console.log(`  ${prefix} -> ${target}`)
  }
})
