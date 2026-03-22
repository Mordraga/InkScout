import React, { useState, useEffect, useCallback } from 'react'
import { getSynonyms, addSynonym, updateSynonym, deleteSynonym } from '../api.js'

export default function SynonymsModal({ onClose }) {
  const [synonyms, setSynonyms] = useState([])
  const [error, setError] = useState('')

  // New trigger form
  const [newTrigger, setNewTrigger] = useState('')
  const [newTerms, setNewTerms] = useState('')
  const [adding, setAdding] = useState(false)

  // Per-row term input
  const [termInputs, setTermInputs] = useState({})

  const refresh = useCallback(async () => {
    try {
      const data = await getSynonyms()
      setSynonyms(data)
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

  async function handleAddTrigger() {
    const trigger = newTrigger.trim()
    if (!trigger) return
    const terms = newTerms.split(',').map(t => t.trim()).filter(Boolean)
    setAdding(true)
    setError('')
    try {
      await addSynonym(trigger, terms)
      setNewTrigger('')
      setNewTerms('')
      await refresh()
    } catch (e) {
      setError(e.message)
    } finally {
      setAdding(false)
    }
  }

  async function handleRemoveTerm(syn, term) {
    setError('')
    try {
      const next = syn.terms.filter(t => t !== term)
      await updateSynonym(syn.id, { terms: next })
      await refresh()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleAddTerm(syn) {
    const raw = (termInputs[syn.id] ?? '').trim()
    if (!raw) return
    setError('')
    try {
      const newTermsList = raw.split(',').map(t => t.trim()).filter(Boolean)
      const next = [...new Set([...syn.terms, ...newTermsList])]
      await updateSynonym(syn.id, { terms: next })
      setTermInputs(prev => ({ ...prev, [syn.id]: '' }))
      await refresh()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDelete(syn) {
    setError('')
    try {
      await deleteSynonym(syn.id)
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
      <div className="ink-modal rounded-2xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 pt-5 pb-3 shrink-0">
          <span className="font-bold text-[#0b3a54] text-base flex-1">Synonyms</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
            aria-label="Close"
          >
            X
          </button>
        </div>

        {error && <p className="text-xs text-red-600 px-5 pb-2 font-semibold shrink-0">{error}</p>}

        {/* Synonym list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
          {synonyms.map(syn => (
            <div
              key={syn.id}
              className="rounded-xl border border-slate-200 bg-cyan-50 p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono font-bold text-sm text-[#0b3a54]">{syn.trigger}</span>
                {syn.is_preset && (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">
                    preset
                  </span>
                )}
                <button
                  onClick={() => handleDelete(syn)}
                  className="ml-auto w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-700 text-red-600 hover:text-white text-xs font-bold transition-colors"
                  aria-label="Delete synonym group"
                >
                  X
                </button>
              </div>

              {/* Term pills */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {syn.terms.map(term => (
                  <button
                    key={term}
                    onClick={() => handleRemoveTerm(syn, term)}
                    className="inline-flex items-center gap-1 text-xs font-mono bg-white border border-slate-300 text-slate-700 rounded-full px-2.5 py-1 hover:border-red-400 hover:text-red-600 transition-colors"
                    title="Click to remove"
                  >
                    {term}
                    <span className="text-[10px] leading-none opacity-50">X</span>
                  </button>
                ))}
                {syn.terms.length === 0 && (
                  <span className="text-xs text-slate-400 italic">No terms</span>
                )}
              </div>

              {/* Add term input */}
              <div className="flex gap-1.5">
                <input
                  className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Add term... or term1, term2"
                  value={termInputs[syn.id] ?? ''}
                  onChange={e => setTermInputs(prev => ({ ...prev, [syn.id]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleAddTerm(syn)}
                />
                <button
                  onClick={() => handleAddTerm(syn)}
                  className="bg-cyan-800 hover:bg-cyan-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {synonyms.length === 0 && (
            <p className="text-sm text-slate-400 text-center mt-6">No synonyms yet</p>
          )}

          {/* Add trigger form */}
          <div className="rounded-xl border border-dashed border-slate-300 p-3 space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Synonym Group</p>
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Trigger word"
              value={newTrigger}
              onChange={e => setNewTrigger(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddTrigger()}
            />
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Terms (comma-separated)"
              value={newTerms}
              onChange={e => setNewTerms(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddTrigger()}
            />
            <button
              onClick={handleAddTrigger}
              disabled={adding || !newTrigger.trim()}
              className="w-full bg-cyan-700 hover:bg-cyan-800 text-white text-sm font-semibold px-3 py-2 rounded-lg disabled:opacity-50"
            >
              {adding ? 'Adding...' : 'Add Synonym Group'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



