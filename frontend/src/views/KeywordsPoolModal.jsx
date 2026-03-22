import React, { useState, useEffect, useCallback } from 'react'
import { getKeywords, addKeyword, addKeywordsBulk, deleteKeyword } from '../api.js'

export default function KeywordsPoolModal({ onClose }) {
  const [keywords, setKeywords] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      const data = await getKeywords()
      setKeywords(data)
    } catch (e) {
      setError(`Load failed: ${e.message}`)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleAdd() {
    const raw = input.trim()
    if (!raw) return
    setInput('')
    setError('')
    setLoading(true)
    try {
      const terms = raw.split(',').map(t => t.trim()).filter(Boolean)
      if (terms.length === 1) {
        await addKeyword(terms[0])
      } else {
        await addKeywordsBulk(terms)
      }
      await refresh()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(kw) {
    setError('')
    try {
      await deleteKeyword(kw.id)
      await refresh()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="ink-modal rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 pt-5 pb-3 shrink-0">
          <span className="font-bold text-[#0b3a54] text-base flex-1">Keyword Pool</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
            aria-label="Close"
          >
            X
          </button>
        </div>

        {/* Input */}
        <div className="px-5 pb-3 shrink-0">
          <div className="flex flex-col gap-1.5">
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Add keyword... or word1, word2"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button
              onClick={handleAdd}
              disabled={loading}
              className="w-full bg-cyan-700 hover:bg-cyan-800 text-white text-sm font-semibold px-3 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add to Pool'}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1">Separate multiple with commas - assign to profiles via each profile's Keywords button</p>
          {error && <p className="text-xs text-red-600 mt-1 font-semibold">{error}</p>}
        </div>

        {/* Keyword list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1.5">
          {keywords.map(kw => (
            <div key={kw.id} className="flex items-center gap-2">
              <span className="flex-1 text-sm font-mono px-3 py-1.5 rounded-full border border-slate-200 bg-cyan-50 text-slate-700">
                {kw.text}
              </span>
              <button
                onClick={() => handleDelete(kw)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-700 text-red-600 hover:text-white text-xs font-bold shrink-0 transition-colors"
                aria-label="Delete keyword"
              >
                X
              </button>
            </div>
          ))}
          {keywords.length === 0 && (
            <p className="text-sm text-slate-400 text-center mt-6">No keywords in pool yet</p>
          )}
        </div>
      </div>
    </div>
  )
}



