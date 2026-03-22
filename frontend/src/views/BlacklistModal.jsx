import React, { useState, useEffect, useCallback } from 'react'
import { getBlacklist, addBlacklist, deleteBlacklist } from '../api.js'

const PLATFORMS = ['twitter', 'bluesky']

const PLATFORM_COLORS = {
  twitter: 'bg-sky-100 text-sky-700 border-sky-200',
  bluesky: 'bg-blue-100 text-blue-700 border-blue-200',
}

export default function BlacklistModal({ onClose }) {
  const [entries, setEntries] = useState([])
  const [platform, setPlatform] = useState('twitter')
  const [handle, setHandle] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      const data = await getBlacklist()
      setEntries(data)
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
    const h = handle.trim().replace(/^@/, '')
    if (!h) return
    setLoading(true)
    setError('')
    try {
      await addBlacklist(platform, h, reason.trim() || null)
      setHandle('')
      setReason('')
      await refresh()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(entry) {
    setError('')
    try {
      await deleteBlacklist(entry.id)
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
          <span className="font-bold text-[#0b3a54] text-base flex-1">Blacklist</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
            aria-label="Close"
          >
            X
          </button>
        </div>

        {/* Add form */}
        <div className="px-5 pb-3 shrink-0">
          <div className="flex gap-1.5 mb-1.5">
            {PLATFORMS.map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={[
                  'flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-colors capitalize',
                  platform === p
                    ? 'bg-cyan-800 text-white border-cyan-800'
                    : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400',
                ].join(' ')}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="@handle"
              value={handle}
              onChange={e => setHandle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Reason (optional)"
              value={reason}
              onChange={e => setReason(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button
              onClick={handleAdd}
              disabled={loading || !handle.trim()}
              className="w-full bg-cyan-700 hover:bg-cyan-800 text-white text-sm font-semibold px-3 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Block'}
            </button>
          </div>
          {error && <p className="text-xs text-red-600 mt-1.5 font-semibold">{error}</p>}
        </div>

        {/* Entries list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1.5">
          {entries.map(entry => (
            <div key={entry.id} className="flex items-center gap-2">
              <span className={[
                'text-[10px] font-bold uppercase tracking-wide border rounded px-1.5 py-0.5 shrink-0',
                PLATFORM_COLORS[entry.platform] ?? 'bg-cyan-50 text-slate-600 border-slate-200',
              ].join(' ')}>
                {entry.platform}
              </span>
              <span className="flex-1 text-sm font-mono text-[#0b3a54] truncate">
                @{entry.blocked_handle}
                {entry.reason && <span className="text-slate-400 font-sans font-normal ml-1.5"> - {entry.reason}</span>}
              </span>
              <button
                onClick={() => handleDelete(entry)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-700 text-red-600 hover:text-white text-xs font-bold shrink-0 transition-colors"
                aria-label="Remove from blacklist"
              >
                X
              </button>
            </div>
          ))}
          {entries.length === 0 && (
            <p className="text-sm text-slate-400 text-center mt-6">No blocked handles</p>
          )}
        </div>
      </div>
    </div>
  )
}



