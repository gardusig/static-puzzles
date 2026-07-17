import { useState, useEffect, useCallback } from 'react'

const API = 'http://localhost:5010'
const STORAGE_KEY = 'sudoku-history'

interface SolvedEntry {
  id: string
  difficulty: string
  solvedAt: string
}

function getHistory(): SolvedEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

function addToHistory(entry: SolvedEntry) {
  const h = getHistory()
  h.unshift(entry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(h.slice(0, 50)))
}

export default function Sudoku() {
  const [grid, setGrid] = useState<number[][]>([])
  const [initial, setInitial] = useState<number[][]>([])
  const [puzzleId, setPuzzleId] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [message, setMessage] = useState('')
  const [solved, setSolved] = useState(false)
  const history = getHistory()

  const fetchPuzzle = useCallback(async (diff: string) => {
    setMessage('')
    setSolved(false)
    const res = await fetch(`${API}/puzzle?difficulty=${diff}`)
    const data = await res.json()
    setPuzzleId(data.id)
    setDifficulty(data.difficulty)
    setGrid(data.grid)
    setInitial(data.grid.map((row: number[]) => [...row]))
  }, [])

  useEffect(() => { fetchPuzzle('medium') }, [fetchPuzzle])

  const handleChange = (r: number, c: number, val: string) => {
    if (solved || initial[r]?.[c] !== 0) return
    const v = val === '' ? 0 : parseInt(val, 10)
    if (!isNaN(v) && v >= 0 && v <= 9) {
      const next = grid.map(row => [...row])
      next[r][c] = v
      setGrid(next)
    }
  }

  const handleCheck = async () => {
    const res = await fetch(`${API}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ puzzleId, grid }),
    })
    const data = await res.json()
    if (data.correct) {
      setMessage('✓ Solved!')
      setSolved(true)
      addToHistory({ id: puzzleId, difficulty, solvedAt: new Date().toISOString() })
      await fetch(`${API}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'local', puzzleId, state: grid, solved: true }),
      })
    } else {
      setMessage(`${data.errors.length} cell(s) incorrect`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Sudoku</h2>
          <p className="text-sm text-gray-400">Classic 9×9 logic puzzle</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={difficulty} onChange={e => fetchPuzzle(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
          </select>
          <button onClick={() => fetchPuzzle(difficulty)} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            New Puzzle
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            {message && (
              <div className={`mb-4 text-sm font-medium px-3 py-2 rounded-lg ${solved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                {message}
                {solved && <button onClick={() => fetchPuzzle(difficulty)} className="ml-2 underline">Next puzzle →</button>}
              </div>
            )}
            <div className="inline-block border-2 border-gray-800 rounded">
              {grid.map((row, r) => (
                <div key={r} className="flex">
                  {row.map((cell, c) => (
                    <input
                      key={c} type="text" maxLength={1}
                      value={cell === 0 ? '' : cell}
                      onChange={e => handleChange(r, c, e.target.value)}
                      className={`w-9 h-9 text-center border border-gray-200 text-sm
                        ${initial[r]?.[c] !== 0 ? 'bg-gray-50 font-semibold text-gray-700' : 'bg-white text-gray-900'}
                        ${(r + 1) % 3 === 0 && r < 8 ? 'border-b-2 border-gray-800' : ''}
                        ${(c + 1) % 3 === 0 && c < 8 ? 'border-r-2 border-gray-800' : ''}
                        focus:outline-none focus:bg-indigo-50`}
                      disabled={solved}
                    />
                  ))}
                </div>
              ))}
            </div>
            {!solved && (
              <button onClick={handleCheck} className="mt-4 bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Check Solution
              </button>
            )}
          </div>
        </div>

        <div className="w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Stats</h3>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-gray-900">{history.length}</div>
                <div className="text-xs text-gray-400">Solved</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 capitalize">{difficulty}</div>
                <div className="text-xs text-gray-400">Current difficulty</div>
              </div>
            </div>
            {history.length > 0 && (
              <>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-5 mb-2">Recent</h3>
                <div className="space-y-1.5">
                  {history.slice(0, 5).map((h, i) => (
                    <div key={i} className="text-xs text-gray-500 truncate">
                      {h.difficulty} — {new Date(h.solvedAt).toLocaleDateString()}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
