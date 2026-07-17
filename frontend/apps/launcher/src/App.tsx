import { lazy, Suspense } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import type { ComponentType } from 'react'
import Header from './components/Header'
import GameCard from './components/GameCard'
import catalog, { type GameEntry } from './catalog'

interface GameModule {
  default: ComponentType<Record<string, unknown>>
}

const remoteApps: Record<string, () => Promise<GameModule>> = {
  gameSudoku: () => import('gameSudoku/App'),
  gameNumerox: () => import('gameNumerox/App'),
  gameNumeroxLetters: () => import('gameNumeroxLetters/App'),
  gameLogicPuzzles: () => import('gameLogicPuzzles/App'),
  gameCrosswords: () => import('gameCrosswords/App'),
  gameTango: () => import('gameTango/App'),
  gameNQueens: () => import('gameNQueens/App'),
}

function Home() {
  const navigate = useNavigate()

  const handlePlay = (game: GameEntry) => {
    navigate(game.route)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Puzzles</h1>
          <p className="text-gray-500 mt-1 text-sm">Choose a puzzle to play — solo, logic-focused, minimal.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalog.map((game) => (
            <GameCard key={game.slug} game={game} onPlay={handlePlay} />
          ))}
        </div>
      </main>
    </div>
  )
}

function GameLoader({ remoteName }: { remoteName: string }) {
  const loader = remoteApps[remoteName]
  if (!loader) return <div className="p-8 text-center text-gray-500">Game not found</div>

  const GameComponent = lazy(loader)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-400">Loading puzzle…</span>
            </div>
          </div>
        }>
          <GameComponent />
        </Suspense>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/play/sudoku" element={<GameLoader remoteName="gameSudoku" />} />
      <Route path="/play/numerox" element={<GameLoader remoteName="gameNumerox" />} />
      <Route path="/play/numerox-letters" element={<GameLoader remoteName="gameNumeroxLetters" />} />
      <Route path="/play/logic-puzzles" element={<GameLoader remoteName="gameLogicPuzzles" />} />
      <Route path="/play/crosswords" element={<GameLoader remoteName="gameCrosswords" />} />
      <Route path="/play/tango" element={<GameLoader remoteName="gameTango" />} />
      <Route path="/play/n-queens" element={<GameLoader remoteName="gameNQueens" />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
