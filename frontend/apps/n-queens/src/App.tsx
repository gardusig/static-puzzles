import { useState } from 'react'

const N = 8
const STORAGE_KEY = 'nqueens-history'
interface SolvedEntry { id: string; difficulty: string; solvedAt: string }
function getHistory(): SolvedEntry[] { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] } }
function addToHistory(entry: SolvedEntry) { const h = getHistory(); h.unshift(entry); localStorage.setItem(STORAGE_KEY, JSON.stringify(h.slice(0, 50))) }

function isSafe(board: number[][], row: number, col: number): boolean {
  for (let i = 0; i < row; i++) if (board[i][col]) return false
  for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j]) return false
  for (let i = row, j = col; i >= 0 && j < N; i--, j++) if (board[i][j]) return false
  return true
}

function solve(board: number[][], row: number): boolean {
  if (row >= N) return true
  for (let col = 0; col < N; col++) {
    if (isSafe(board, row, col)) { board[row][col] = 1; if (solve(board, row + 1)) return true; board[row][col] = 0 }
  }
  return false
}

function generateSolution(): number[][] {
  const board = Array.from({ length: N }, () => Array(N).fill(0)); solve(board, 0); return board
}

function generateClues(): number[][] {
  const sol = generateSolution()
  const b = Array.from({ length: N }, () => Array(N).fill(0))
  const clues = Math.floor(N * 1.5); let placed = 0
  while (placed < clues) { const r = Math.floor(Math.random() * N); const c = Math.floor(Math.random() * N); if (sol[r][c] && b[r][c] === 0) { b[r][c] = 1; placed++ } }
  return b
}

export default function NQueens() {
  const [solution] = useState(() => generateSolution())
  const [board, setBoard] = useState(() => generateClues())
  const [message, setMessage] = useState(''); const [solved, setSolved] = useState(false)
  const history = getHistory()

  const toggleCell = (r: number, c: number) => {
    if (solved) return
    if (board[r][c] === 1) { const next = board.map(row => [...row]); next[r][c] = 0; setBoard(next); return }
    if (board[r].reduce((a, v) => a + v, 0) >= 1) { setMessage('Only one queen per row'); return }
    if (board.reduce((a, row) => a + row[c], 0) >= 1) { setMessage('Only one queen per column'); return }
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (board[i][j] && Math.abs(i - r) === Math.abs(j - c)) { setMessage('Queens cannot attack diagonally'); return }
    setMessage(''); const next = board.map(row => [...row]); next[r][c] = 1; setBoard(next)
  }

  const checkWin = () => {
    const total = board.reduce((a, row) => a + row.reduce((b, v) => b + v, 0), 0)
    if (total !== N) { setMessage(`Place all ${N} queens`); return }
    const correct = JSON.stringify(board) === JSON.stringify(solution)
    if (correct) { setMessage('✓ Solved!'); setSolved(true); addToHistory({ id: `nqueens-${Date.now()}`, difficulty: `${N}×${N}`, solvedAt: new Date().toISOString() }) }
    else setMessage('Queens are attacking each other')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-semibold text-gray-900">N Queens</h2><p className="text-sm text-gray-400">Place {N} queens on a {N}×{N} board</p></div>
        <button onClick={() => { setBoard(generateClues()); setMessage(''); setSolved(false) }} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">New Puzzle</button>
      </div>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            {message && <div className={`mb-4 text-sm font-medium px-3 py-2 rounded-lg ${solved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{message}{solved && <button onClick={() => { setBoard(generateClues()); setMessage(''); setSolved(false) }} className="ml-2 underline">Next puzzle →</button>}</div>}
            <div className="inline-block border border-gray-200 rounded-lg overflow-hidden">
              {board.map((row, r) => (
                <div key={r} className="flex">{row.map((cell, c) => {
                  const isClue = solution[r][c] && cell === 1
                  return <div key={c} onClick={() => toggleCell(r, c)}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-100 text-sm cursor-pointer select-none transition-colors
                      ${(r + c) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      ${isClue ? 'bg-green-50' : ''}
                      ${cell === 1 ? 'text-lg' : ''}
                      hover:bg-indigo-50`}>{cell === 1 ? '♛' : ''}</div>
                })}</div>
              ))}
            </div>
            {!solved && <button onClick={checkWin} className="mt-4 bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">Check Solution</button>}
          </div>
        </div>
        <div className="w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Stats</h3>
            <div className="space-y-3">
              <div><div className="text-2xl font-bold text-gray-900">{history.length}</div><div className="text-xs text-gray-400">Solved</div></div>
              <div><div className="text-sm font-medium text-gray-900">{N}×{N}</div><div className="text-xs text-gray-400">Board</div></div>
            </div>
            {history.length > 0 && <><h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-5 mb-2">Recent</h3><div className="space-y-1.5">{history.slice(0, 5).map((h, i) => <div key={i} className="text-xs text-gray-500 truncate">{h.difficulty} — {new Date(h.solvedAt).toLocaleDateString()}</div>)}</div></>}
          </div>
        </div>
      </div>
    </div>
  )
}
