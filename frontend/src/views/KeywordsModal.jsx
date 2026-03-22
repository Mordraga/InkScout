import React, { useState, useEffect, useCallback } from 'react'
import {
  getKeywords, getProfileKeywords,
  associateKeyword, associateKeywordsBulk, associateKeywordById,
  disassociateKeyword, toggleProfileKeyword,
} from '../api.js'

export default function KeywordsModal({ profile, onClose }) {
  const [associated, setAssociated] = useState([])
  const [pool, setPool] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      const [profileKws, allKws] = await Promise.all([
        getProfileKeywords(profile.id),
        getKeywords(),
      ])
      setAssociated(profileKws)
      const assocIds = new Set(profileKws.map(k => k.id))
      setPool(allKws.filter(k => !assocIds.has(k.id)))
    } catch (e) {
      setError(`Load failed: ${e.message}`)
    }
  }, [profile.id])

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
        await associateKeyword(profile.id, terms[0])
      } else {
        await associateKeywordsBulk(profile.id, terms)
      }
      await refresh()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggle(kw) {
    setError('')
    try {
      await toggleProfileKeyword(profile.id, kw.id, !kw.active)
      await refresh()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDisassociate(kw) {
    setError('')
    try {
      await disassociateKeyword(profile.id, kw.id)
      await refresh()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleAssociate(kw) {
    setError('')
    try {
      await associateKeywordById(profile.id, kw.id)
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
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: profile.color }}
          />
          <span className="font-bold text-[#0b3a54] text-base flex-1">{profile.name} - Keywords</span>
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
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1">Separate multiple with commas</p>
          {error && <p className="text-xs text-red-600 mt-1 font-semibold">{error}</p>}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
          {/* Associated keywords */}
          <div className="space-y-1.5">
            {associated.map(kw => (
              <div key={kw.id} className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(kw)}
                  className={[
                    'flex-1 text-left text-sm font-mono px-3 py-1.5 rounded-full border transition-colors',
                    kw.active
                      ? 'bg-pill-active-bg text-pill-active-fg border-pill-active-border'
                      : 'bg-pill-inactive-bg text-pill-inactive-fg border-pill-inactive-border',
                  ].join(' ')}
                >
                  {kw.text}
                </button>
                <button
                  onClick={() => handleDisassociate(kw)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0"
                  aria-label="Remove from profile"
                >
                  X
                </button>
              </div>
            ))}
            {associated.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-2">No keywords assigned yet</p>
            )}
          </div>

          {/* Keyword pool - unassociated keywords */}
          {pool.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Keyword Pool</p>
              <div className="space-y-1.5">
                {pool.map(kw => (
                  <div key={kw.id} className="flex items-center gap-2">
                    <span className="flex-1 text-sm font-mono px-3 py-1.5 rounded-full border border-slate-200 bg-cyan-50 text-slate-500">
                      {kw.text}
                    </span>
                    <button
                      onClick={() => handleAssociate(kw)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0"
                      aria-label="Add to profile"
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



