import { useState, useEffect, useCallback } from 'react'

declare const __API_URL__: string | undefined
const API = __API_URL__ || "http://localhost:5015"
const STORAGE_KEY = 'tango-history'
const SIZE = 6

interface SolvedEntry { id: string; difficulty: string; solvedAt: string }
function getHistory(): SolvedEntry[] { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] } }
function addToHistory(entry: SolvedEntry) { const h = getHistory(); h.unshift(entry); localStorage.setItem(STORAGE_KEY, JSON.stringify(h.slice(0, 50))) }

export default function Tango() {
  const [grid, setGrid] = useState<string[][]>([]); const [initial, setInitial] = useState<string[][]>([])
  const [puzzleId, setPuzzleId] = useState(''); const [difficulty, setDifficulty] = useState('medium')
  const [message, setMessage] = useState(''); const [solved, setSolved] = useState(false)
  const [violations, setViolations] = useState<Set<string>>(new Set())
  const history = getHistory()

  const fetchPuzzle = useCallback(async (diff: string) => {
    setMessage(''); setSolved(false); setViolations(new Set())
    const res = await fetch(`${API}/puzzle?difficulty=${diff}`); const data = await res.json()
    setPuzzleId(data.id); setDifficulty(data.difficulty); setGrid(data.grid)
    setInitial(data.grid.map((row: string[]) => [...row]))
  }, [])

  useEffect(() => { fetchPuzzle('medium') }, [fetchPuzzle])

  const toggleCell = (r: number, c: number) => {
    if (solved || initial[r]?.[c] !== '') return
    const next = grid.map(row => [...row])
    const cur = next[r][c]
    next[r][c] = cur === '0' ? '1' : cur === '1' ? '' : '0'
    setGrid(next)
  }

  const checkLocal = useCallback((g: string[][]) => {
    const v = new Set<string>()
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE - 2; c++) if (g[r][c] && g[r][c] === g[r][c + 1] && g[r][c] === g[r][c + 2]) { v.add(`${r},${c}`); v.add(`${r},${c + 1}`); v.add(`${r},${c + 2}`) }
    for (let c = 0; c < SIZE; c++) for (let r = 0; r < SIZE - 2; r++) if (g[r][c] && g[r][c] === g[r + 1][c] && g[r][c] === g[r + 2][c]) { v.add(`${r},${c}`); v.add(`${r + 1},${c}`); v.add(`${r + 2},${c}`) }
    return v
  }, [])

  useEffect(() => { setViolations(checkLocal(grid)) }, [grid, checkLocal])

  const handleCheck = async () => {
    const res = await fetch(`${API}/check`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ puzzleId, grid }) })
    const data = await res.json()
    if (data.correct && violations.size === 0) { setMessage('✓ Solved!'); setSolved(true); addToHistory({ id: puzzleId, difficulty, solvedAt: new Date().toISOString() }) }
    else { const r: string[] = []; if (violations.size > 0) r.push(`${violations.size / 3} group(s) of 3`); if (!data.correct) r.push('count mismatch'); setMessage(r.join('; ')) }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-semibold text-gray-900">Tango</h2><p className="text-sm text-gray-400">0-1 grid — no 3 equal, equal count per row/col</p></div>
        <div className="flex items-center gap-3">
          <select value={difficulty} onChange={e => fetchPuzzle(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
          </select>
          <button onClick={() => fetchPuzzle(difficulty)} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">New Puzzle</button>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            {message && <div className={`mb-4 text-sm font-medium px-3 py-2 rounded-lg ${solved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{message}{solved && <button onClick={() => fetchPuzzle(difficulty)} className="ml-2 underline">Next puzzle →</button>}</div>}
            <div className="inline-block border-2 border-gray-800 rounded">
              {grid.map((row, r) => (
                <div key={r} className="flex">{row.map((cell, c) => (
                  <div key={c} onClick={() => toggleCell(r, c)}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-200 text-sm cursor-pointer select-none transition-colors
                      ${initial[r]?.[c] !== '' ? 'bg-gray-50 font-bold text-gray-700' : 'bg-white hover:bg-indigo-50 text-gray-900'}
                      ${violations.has(`${r},${c}`) ? 'bg-red-50 text-red-600' : ''}`}>
                    {cell || ''}
                  </div>
                ))}</div>
              ))}
            </div>
            {!solved && <button onClick={handleCheck} className="mt-4 bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">Check Solution</button>}
          </div>
        </div>
        <div className="w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Stats</h3>
            <div className="space-y-3">
              <div><div className="text-2xl font-bold text-gray-900">{history.length}</div><div className="text-xs text-gray-400">Solved</div></div>
              <div><div className="text-sm font-medium text-gray-900 capitalize">{difficulty}</div><div className="text-xs text-gray-400">Difficulty</div></div>
            </div>
            {history.length > 0 && <><h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-5 mb-2">Recent</h3><div className="space-y-1.5">{history.slice(0, 5).map((h, i) => <div key={i} className="text-xs text-gray-500 truncate">{h.difficulty} — {new Date(h.solvedAt).toLocaleDateString()}</div>)}</div></>}
          </div>
        </div>
      </div>
    </div>
  )
}
