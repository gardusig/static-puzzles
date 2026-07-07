import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import puzzles, { ISSUES_URL } from './gamesCatalog'

function Tag({ children }) {
  return (
    <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
      {children}
    </span>
  )
}

function Home() {
  const planned = puzzles.filter((p) => p.status === 'planned').length

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Static Puzzles</h1>
      <p className="mt-2 text-stone-600">
        Newspaper-style logic for Chrome — solo, offline-friendly, minimal animation.
      </p>
      <p className="mt-3 text-sm">
        <a href={ISSUES_URL} className="text-amber-800 underline" target="_blank" rel="noreferrer">
          {planned} games tracked as GitHub issues
        </a>
        {' · '}
        <a
          href="https://github.com/gardusig/static-puzzles/blob/feat/consolidate/docs/REQUIREMENTS.md"
          className="text-amber-800 underline"
          target="_blank"
          rel="noreferrer"
        >
          Requirements
        </a>
      </p>
      <ul className="mt-8 space-y-4">
        {puzzles.map((p) => (
          <li key={p.slug} className="border border-stone-300 rounded-lg p-4 bg-white">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{p.title}</h2>
                  <span className="text-xs text-stone-400">{p.slug}</span>
                </div>
                <p className="text-sm text-stone-600 mt-1">{p.blurb}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            </div>
            <span className="mt-3 inline-block text-sm text-stone-400">
              {p.status} · priority {p.priority}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-xs text-stone-400">
        Specs in repo <code className="bg-stone-100 px-1">docs/REQUIREMENTS.md</code> · catalog{' '}
        <code className="bg-stone-100 px-1">games.yaml</code>
      </p>
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
