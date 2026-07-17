import { useState, useEffect, useCallback } from 'react'

declare const __API_URL__: string | undefined
const API = __API_URL__ || "http://localhost:5014"
const STORAGE_KEY = 'crosswords-history'
interface SolvedEntry { id: string; difficulty: string; solvedAt: string }
function getHistory(): SolvedEntry[] { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] } }
function addToHistory(entry: SolvedEntry) { const h = getHistory(); h.unshift(entry); localStorage.setItem(STORAGE_KEY, JSON.stringify(h.slice(0, 50))) }

interface Clue { number: number; clue: string; answer: string }
interface Clues { across: Clue[]; down: Clue[] }

export default function Crosswords() {
  const [grid, setGrid] = useState<string[][]>([]); const [initial, setInitial] = useState<string[][]>([])
  const [puzzleId, setPuzzleId] = useState(''); const [difficulty, setDifficulty] = useState('medium')
  const [clues, setClues] = useState<Clues>({ across: [], down: [] })
  const [message, setMessage] = useState(''); const [solved, setSolved] = useState(false)
  const history = getHistory()

  const fetchPuzzle = useCallback(async (diff: string) => {
    setMessage(''); setSolved(false)
    const res = await fetch(`${API}/puzzle?difficulty=${diff}`); const data = await res.json()
    setPuzzleId(data.id); setDifficulty(data.difficulty); setGrid(data.grid); setClues(data.clues)
    setInitial(data.grid.map((row: string[]) => [...row]))
  }, [])

  useEffect(() => { fetchPuzzle('medium') }, [fetchPuzzle])

  const handleChange = (r: number, c: number, val: string) => {
    if (solved || initial[r]?.[c] === 'X') return
    const v = val.toUpperCase().replace(/[^A-Z]/g, '')
    if (v.length <= 1) { const next = grid.map(row => [...row]); next[r][c] = v; setGrid(next) }
  }

  const handleCheck = async () => {
    const res = await fetch(`${API}/check`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ puzzleId, grid }) })
    const data = await res.json()
    if (data.correct) { setMessage('✓ Solved!'); setSolved(true); addToHistory({ id: puzzleId, difficulty, solvedAt: new Date().toISOString() }) }
    else setMessage('Some letters are wrong')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-semibold text-gray-900">Crosswords</h2><p className="text-sm text-gray-400">Fill the grid with words from clues</p></div>
        <div className="flex items-center gap-3">
          <select value={difficulty} onChange={e => fetchPuzzle(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="easy">Easy</option><option value="medium">Medium</option>
          </select>
          <button onClick={() => fetchPuzzle(difficulty)} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">New Puzzle</button>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            {message && <div className={`mb-4 text-sm font-medium px-3 py-2 rounded-lg ${solved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{message}{solved && <button onClick={() => fetchPuzzle(difficulty)} className="ml-2 underline">Next puzzle →</button>}</div>}
            <div className="flex gap-6">
              <div className="inline-block border-2 border-gray-800 rounded">
                {grid.map((row, r) => (
                  <div key={r} className="flex">{row.map((cell, c) => (
                    <input key={c} type="text" maxLength={1} value={cell === 'X' ? '■' : cell}
                      onChange={e => handleChange(r, c, e.target.value)}
                      className={`w-7 h-7 text-center border border-gray-200 text-sm ${initial[r]?.[c] === 'X' ? 'bg-gray-800' : 'bg-white text-gray-900'} ${initial[r]?.[c] !== '' && initial[r]?.[c] !== 'X' ? 'bg-gray-50 font-semibold text-gray-700' : ''} focus:outline-none focus:bg-indigo-50`}
                      disabled={solved || initial[r]?.[c] === 'X'} />
                  ))}</div>
                ))}
              </div>
              <div className="text-sm">
                <div className="mb-4"><h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Across</h3><ul className="space-y-0.5 text-gray-600">{clues.across.map(c => <li key={c.number} className="text-xs">{c.number}. {c.clue}</li>)}</ul></div>
                <div><h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Down</h3><ul className="space-y-0.5 text-gray-600">{clues.down.map(c => <li key={c.number} className="text-xs">{c.number}. {c.clue}</li>)}</ul></div>
              </div>
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
