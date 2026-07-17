import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SP</span>
          </div>
          <span className="font-semibold text-gray-900">Static Puzzles</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-900 transition-colors">All Puzzles</Link>
          <a href="https://github.com/gardusig/static-puzzles" className="hover:text-gray-900 transition-colors" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </div>
    </header>
  )
}
