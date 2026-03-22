import React, { useState, useEffect, useRef } from 'react'
import { getLogs } from '../api.js'

const POLL_MS = 2000

function LogLine({ raw }) {
  let event = null
  try { event = JSON.parse(raw) } catch { /* plain text line */ }

  if (event?.event === 'twitter_zero_results') {
    return (
      <div className="text-xs font-mono leading-5 mb-1 text-yellow-400">
        <span className="text-yellow-300 font-bold">[zero results]</span>{' '}
        <span className="text-slate-300">query:</span> {event.query}
        {event.meta && (
          <span className="text-slate-500">
            {' '}· result_count: {event.meta.result_count ?? 0}
            {event.meta.newest_id ? ` · newest_id: ${event.meta.newest_id}` : ''}
          </span>
        )}
        {event.errors?.length > 0 && (
          <div className="text-red-400 ml-2">
            {event.errors.map((e, i) => (
              <div key={i}>{typeof e === 'string' ? e : JSON.stringify(e)}</div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <p className="text-xs font-mono text-console-fg whitespace-pre-wrap leading-5">{raw}</p>
  )
}

export default function ConsoleDrawer({ open, onToggle }) {
  const [lines, setLines] = useState([])
  const [localLines, setLocalLines] = useState([])
  const endRef = useRef(null)

  useEffect(() => {
    if (!open) return
    let active = true

    async function poll() {
      if (!active) return
      try {
        const data = await getLogs()
        setLines(data)
      } catch {
        // backend unreachable — keep showing last lines
      }
      if (active) setTimeout(poll, POLL_MS)
    }

    poll()
    return () => { active = false }
  }, [open])

  // Sync local display to polled lines (local clear doesn't affect backend)
  useEffect(() => { setLocalLines(lines) }, [lines])

  // Auto-scroll to bottom on new lines
  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [localLines, open])

  return (
    <div
      className={[
        'bg-console flex flex-col transition-all duration-200',
        open ? 'h-48' : 'h-9',
      ].join(' ')}
    >
      {/* Header bar */}
      <div className="flex items-center bg-[#042238] px-3 h-9 shrink-0 border-b border-cyan-900/50">
        <span className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-widest flex-1">
          Console
        </span>
        <button
          onClick={() => setLocalLines([])}
          className="text-xs text-cyan-300/70 hover:text-cyan-100 mr-3"
        >
          Clear
        </button>
        <button
          onClick={onToggle}
          className="text-xs text-cyan-300/70 hover:text-cyan-100"
        >
          {open ? '▼' : '▲'}
        </button>
      </div>

      {/* Log output */}
      {open && (
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {localLines.length === 0 ? (
            <p className="text-xs text-slate-600 font-mono">No log output yet…</p>
          ) : (
            localLines.map((line, i) => <LogLine key={i} raw={line} />)
          )}
          <div ref={endRef} />
        </div>
      )}
    </div>
  )
}
