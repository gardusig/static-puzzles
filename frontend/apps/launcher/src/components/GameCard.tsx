import type { GameEntry } from '../catalog'

interface GameCardProps {
  game: GameEntry
  onPlay: (game: GameEntry) => void
}

export default function GameCard({ game, onPlay }: GameCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-xl">
              {game.emoji}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{game.title}</h3>
              <span className="text-xs text-gray-400">{game.slug}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{game.blurb}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {game.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-100">
                {t}
              </span>
            ))}
          </div>
          <button
            onClick={() => onPlay(game)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            Play →
          </button>
        </div>
      </div>
    </div>
  )
}
