import React from 'react'

function timeAgo(isoString) {
  if (!isoString) return ''
  const then = new Date(isoString)
  const seconds = Math.floor((Date.now() - then.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export default function LeadCard({ lead, onSelect, isSelected }) {
  const isActive = lead.status === 'active'
  const isTwitter = lead.platform === 'twitter'

  return (
    <button
      onClick={() => onSelect(lead)}
      className={[
        'w-full text-left rounded-xl border-2 bg-white p-3 transition-colors',
        isSelected
          ? 'border-blue-400 shadow-md'
          : isActive
          ? 'border-active-green'
          : 'border-card-border hover:border-slate-400',
      ].join(' ')}
    >
      {/* Top row: platform badge + username + time */}
      <div className="flex items-center gap-2 mb-1">
        <span
          className={[
            'text-white text-xs font-bold rounded px-1.5 py-0.5',
            isTwitter ? 'bg-twitter' : 'bg-bluesky',
          ].join(' ')}
        >
          {isTwitter ? 'T' : 'B'}
        </span>
        <span className="font-bold text-[#0b3a54] text-sm flex-1 truncate">@{lead.username}</span>
        <span className="text-xs text-slate-400 shrink-0">{timeAgo(lead.posted_at)}</span>
        {lead.score_pct != null && (
          <span className={[
            'text-xs font-bold px-1.5 py-0.5 rounded',
            lead.score_pct >= 70 ? 'bg-green-100 text-green-700' :
            lead.score_pct >= 40 ? 'bg-yellow-100 text-yellow-700' :
                                   'bg-cyan-50 text-slate-500',
          ].join(' ')}>
            {lead.score_pct}%
          </span>
        )}
      </div>

      {/* Snippet */}
      <p className="text-sm text-[#3e6780] line-clamp-2 mb-2">
        {lead.text.slice(0, 140)}{lead.text.length > 140 ? '...' : ''}
      </p>

      {/* Keyword pills */}
      {lead.matched_keywords?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {lead.matched_keywords.slice(0, 5).map((kw) => (
            <span
              key={kw}
              className="text-xs font-mono bg-pill-active-bg text-pill-active-fg border border-pill-active-border rounded px-1.5 py-0.5"
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}

