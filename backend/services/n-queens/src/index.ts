import express from 'express'
import { ensureTables } from './db.js'
import routes from './routes.js'
const app = express()
const PORT = parseInt(process.env.PORT || '5016', 10)
app.use(express.json()); app.use('/', routes)
app.get('/health', (_req, res) => res.send('ok'))
await ensureTables()
app.listen(PORT, () => console.log(`n-queens-service listening on :${PORT}`))
