import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import puzzles from './gamesCatalog'

function Home() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Static Puzzles</h1>
      <p className="mt-2 text-stone-600">
        Newspaper-style logic for Chrome — solo, offline-friendly, no animation fluff.
      </p>
      <ul className="mt-8 space-y-4">
        {puzzles.map((p) => (
          <li key={p.slug} className="border border-stone-300 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{p.emoji}</span>
              <div>
                <h2 className="font-semibold">{p.title}</h2>
                <p className="text-sm text-stone-600">{p.blurb}</p>
              </div>
            </div>
            <span className="mt-3 inline-block text-sm text-stone-400">Coming soon</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
