import React, { useState } from 'react'
import { patchLeadStatus } from '../api.js'

const MOOTSKEEPER_URL = 'https://mootskeeper.com/?handle={handle}'

const STATUS_LABELS = {
  uninteracted: 'Uninteracted',
  active: 'Active Talks',
  uninterested: 'Uninterested',
}
const LABEL_TO_STATUS = Object.fromEntries(
  Object.entries(STATUS_LABELS).map(([k, v]) => [v, k])
)

export default function WorkspacePanel({ lead, onStatusChanged, onClose, profiles = [], entitlements = null }) {
  const [current, setCurrent] = useState(lead)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Sync when parent passes a new lead
  if (lead && current?.id !== lead.id) {
    setCurrent(lead)
  }

  if (!current) {
    return (
      <div className="ink-panel h-full flex items-center justify-center bg-panel rounded-2xl">
        <p className="text-slate-400 text-sm">Click a lead to open it here</p>
      </div>
    )
  }

  const isTwitter = current.platform === 'twitter'
  const isActive = current.status === 'active'
  const profileObj = profiles.find(p => p.id === current.profile_id)
  const canUseMootskeeper = Boolean(entitlements?.features?.mootskeeper_integration)

  async function handleStatusChange(label) {
    const newStatus = LABEL_TO_STATUS[label]
    if (!newStatus || newStatus === current.status) return
    setError('')
    setSaving(true)
    try {
      const updated = await patchLeadStatus(current.id, newStatus)
      setCurrent(updated)
      onStatusChanged?.()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="ink-panel flex flex-col h-full bg-panel rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <span
          className={[
            'text-white text-xs font-bold rounded px-2 py-1',
            isTwitter ? 'bg-twitter' : 'bg-bluesky',
          ].join(' ')}
        >
          {current.platform.charAt(0).toUpperCase() + current.platform.slice(1)}
        </span>
        <span className="font-bold text-[#0b3a54] text-lg flex-1">@{current.username}</span>
        {profileObj && (
          <span
            className="text-white text-xs font-semibold rounded px-2 py-1"
            style={{ backgroundColor: profileObj.color }}
          >
            {profileObj.name}
          </span>
        )}
        {isActive && (
          <span className="bg-active-green text-white text-xs font-semibold rounded px-2 py-1">
            Active Talks
          </span>
        )}
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-cyan-700/70 hover:text-cyan-800 text-xl leading-none"
          >
            {'<'}
          </button>
        )}
      </div>

      {/* Post text */}
      <div className="mx-4 mb-3 bg-cyan-50/70 rounded-lg p-3 text-sm text-[#214d66] leading-relaxed border border-cyan-100">
        {current.text}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 px-4 mb-3 flex-wrap">
        <a
          href={current.post_url}
          target="_blank"
          rel="noreferrer"
          className="text-sm bg-cyan-800 hover:bg-cyan-900 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Open Post
        </a>
        {isActive && canUseMootskeeper && (
          <a
            href={MOOTSKEEPER_URL.replace('{handle}', current.username)}
            target="_blank"
            rel="noreferrer"
            className="text-sm bg-active-green hover:bg-[#245e4c] text-white px-4 py-2 rounded-lg font-semibold"
          >
            Add to MootsKeeper
          </a>
        )}
      </div>
      {isActive && !canUseMootskeeper && (
        <p className="px-4 mb-3 text-xs text-cyan-700">
          MootsKeeper integration is available on Standard and Pro.
        </p>
      )}

      {/* Status selector */}
      <div className="mx-4 mb-4 bg-cyan-50/70 rounded-xl p-3 border border-cyan-100">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Status</p>
        <div className="flex gap-2 flex-wrap">
          {Object.values(STATUS_LABELS).map(label => (
            <button
              key={label}
              disabled={saving}
              onClick={() => handleStatusChange(label)}
              className={[
                'text-sm px-3 py-1.5 rounded-lg border font-semibold transition-colors disabled:opacity-60',
                STATUS_LABELS[current.status] === label
                  ? 'bg-cyan-800 text-white border-cyan-800'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-slate-500',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
        {error && <p className="text-xs text-red-600 mt-2 font-semibold">{error}</p>}
      </div>

      {/* Metadata */}
      <div className="mx-4 mb-4 text-xs text-slate-400 space-y-0.5">
        {current.captured_at && (
          <p>Captured: {new Date(current.captured_at).toLocaleString()}</p>
        )}
        {current.expires_at && (
          <p>Expires: {new Date(current.expires_at).toLocaleString()}</p>
        )}
        {current.matched_keywords?.length > 0 && (
          <p>Matched: {current.matched_keywords.join(', ')}</p>
        )}
      </div>
    </div>
  )
}


