import express from 'express'
import { ensureTables } from './db.js'
import routes from './routes.js'

const app = express()
const PORT = parseInt(process.env.PORT || '5012', 10)
app.use(express.json())
app.use('/', routes)
app.get('/health', (_req, res) => res.send('ok'))
await ensureTables()
app.listen(PORT, () => console.log(`numerox-letters-service listening on :${PORT}`))
