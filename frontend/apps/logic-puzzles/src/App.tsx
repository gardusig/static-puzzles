import { useState, useEffect, useCallback } from 'react'

const API = 'http://localhost:5013'
const STORAGE_KEY = 'logic-puzzles-history'
interface SolvedEntry { id: string; difficulty: string; solvedAt: string }
function getHistory(): SolvedEntry[] { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] } }
function addToHistory(entry: SolvedEntry) { const h = getHistory(); h.unshift(entry); localStorage.setItem(STORAGE_KEY, JSON.stringify(h.slice(0, 50))) }

interface Clue { description: string; category: string; value: string }
interface Category { name: string; items: string[] }

export default function LogicPuzzles() {
  const [clues, setClues] = useState<Clue[]>([]); const [categories, setCategories] = useState<Category[]>([])
  const [puzzleId, setPuzzleId] = useState(''); const [difficulty, setDifficulty] = useState('medium')
  const [answers, setAnswers] = useState<Record<string, string>>({}); const [message, setMessage] = useState(''); const [solved, setSolved] = useState(false)
  const history = getHistory()

  const fetchPuzzle = useCallback(async (diff: string) => {
    setMessage(''); setSolved(false); setAnswers({})
    const res = await fetch(`${API}/puzzle?difficulty=${diff}`); const data = await res.json()
    setPuzzleId(data.id); setDifficulty(data.difficulty); setClues(data.clues); setCategories(data.categories)
  }, [])

  useEffect(() => { fetchPuzzle('medium') }, [fetchPuzzle])

  const handleAnswer = (key: string, value: string) => setAnswers(prev => ({ ...prev, [key]: value }))

  const handleCheck = async () => {
    const res = await fetch(`${API}/check`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ puzzleId, answers }) })
    const data = await res.json()
    if (data.correct) { setMessage('✓ Solved!'); setSolved(true); addToHistory({ id: puzzleId, difficulty, solvedAt: new Date().toISOString() }) }
    else setMessage('Some assignments are incorrect')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-semibold text-gray-900">Logic Puzzles</h2><p className="text-sm text-gray-400">Deduce the correct pairings</p></div>
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
            <div className="mb-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Clues</h3>
              <ul className="space-y-1.5">{clues.map((c, i) => <li key={i} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">{c.description}</li>)}</ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Assignments</h3>
              {categories.map((cat, ci) => (
                <div key={ci} className="mb-3">
                  <p className="text-xs font-medium text-gray-500 mb-1.5">{cat.name}</p>
                  <div className="flex gap-2 flex-wrap">{cat.items.map(item => (
                    <select key={`${cat.name}:${item}`} value={answers[`${cat.name}:${item}`] || ''} onChange={e => handleAnswer(`${cat.name}:${item}`, e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={solved}>
                      <option value="">—</option>
                      {categories[0]?.items.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  ))}</div>
                </div>
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
