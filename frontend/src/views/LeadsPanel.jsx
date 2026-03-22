import React, { useState, useEffect, useCallback, useRef } from 'react'
import LeadCard from '../components/LeadCard.jsx'
import { getLeads, runSearch, clearAllLeads } from '../api.js'

const STATUS_MAP = { New: 'default', Active: 'active', All: 'all' }
const AGE_MAP = { 'Any age': 0, 'Last 1h': 1, 'Last 6h': 6, 'Last 24h': 24 }

export default function LeadsPanel({ onSelect, selectedLead, refreshSignal }) {
  const [leads, setLeads] = useState([])
  const [statusFilter, setStatusFilter] = useState('New')
  const [ageFilter, setAgeFilter] = useState('Any age')
  const [kwFilter, setKwFilter] = useState('')
  const [headline, setHeadline] = useState('Incoming Leads')
  const [searching, setSearching] = useState(false)
  const kwTimer = useRef(null)

  const refresh = useCallback(async (headlineOverride) => {
    try {
      const status = STATUS_MAP[statusFilter]
      const maxAge = AGE_MAP[ageFilter]
      const data = await getLeads({
        status: status === 'default' ? undefined : status === 'all' ? undefined : status,
        maxAgeHours: maxAge,
        keyword: kwFilter || undefined,
      })
      setLeads(data)
      setHeadline(headlineOverride ?? `Incoming Leads  (${data.length})`)
    } catch (e) {
      console.error('[Leads] refresh error:', e)
    }
  }, [statusFilter, ageFilter, kwFilter])

  // Refresh when filters change or external signal fires (e.g. status change in workspace)
  useEffect(() => { refresh() }, [refresh, refreshSignal])

  // Auto-poll every 30s
  useEffect(() => {
    const id = setInterval(() => refresh(), 30000)
    return () => clearInterval(id)
  }, [refresh])

  function handleKwChange(e) {
    const val = e.target.value
    setKwFilter(val)
    clearTimeout(kwTimer.current)
    kwTimer.current = setTimeout(() => refresh(), 300)
  }

  async function handleSearch() {
    setHeadline('Incoming Leads  (searching...)')
    setSearching(true)
    try {
      const result = await runSearch()
      await refresh(`Incoming Leads  (+${result.leads_stored} new)`)
    } catch (e) {
      setHeadline(`Search error: ${e.message}`)
    } finally {
      setSearching(false)
    }
  }

  async function handleClear() {
    try {
      const n = await clearAllLeads()
      await refresh(`Incoming Leads  (cleared ${n})`)
    } catch (e) {
      setHeadline(`Clear error: ${e.message}`)
    }
  }

  return (
    <div className="ink-panel flex flex-col h-full bg-panel rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="ink-panel-head rounded-t-2xl px-3 py-3 space-y-2">
        <p className="font-bold text-[#1f546f] text-sm">{headline}</p>

        {/* Status filter + action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {['New', 'Active', 'All'].map(opt => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={[
                'text-xs px-3 py-1 rounded-full border font-semibold transition-colors',
                statusFilter === opt
                  ? 'bg-cyan-800 text-white border-cyan-800'
                  : 'bg-white text-slate-600 border-slate-300',
              ].join(' ')}
            >
              {opt}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="text-xs px-3 py-1 rounded-full bg-cyan-700 hover:bg-cyan-800 text-white font-semibold disabled:opacity-60"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
          <button
            onClick={handleClear}
            className="text-xs px-3 py-1 rounded-full bg-rose-700 hover:bg-rose-800 text-white font-semibold"
          >
            Clear
          </button>
        </div>

        {/* Age filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Age:</span>
          <select
            value={ageFilter}
            onChange={e => setAgeFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded px-2 py-1 focus:outline-none"
          >
            {Object.keys(AGE_MAP).map(k => <option key={k}>{k}</option>)}
          </select>
        </div>

        {/* Keyword filter */}
        <input
          className="w-full border border-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
          placeholder="Filter by keyword..."
          value={kwFilter}
          onChange={handleKwChange}
        />
      </div>

      {/* Card list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {leads.map(lead => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onSelect={onSelect}
            isSelected={selectedLead?.id === lead.id}
          />
        ))}
        {leads.length === 0 && (
          <p className="text-sm text-slate-400 text-center mt-10">No leads found</p>
        )}
      </div>
    </div>
  )
}



