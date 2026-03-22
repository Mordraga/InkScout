import React, { useState, useEffect, useCallback } from 'react'
import { getProfiles, createProfile, updateProfile, deleteProfile } from '../api.js'

export default function ProfilesPanel({ onProfilesChanged, onOpenKeywords }) {
  const [profiles, setProfiles] = useState([])
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#6366f1')
  const [saving, setSaving] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const data = await getProfiles()
      setProfiles(data)
    } catch (e) {
      setError(`Load failed: ${e.message}`)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const activeCount = profiles.filter(p => p.active).length

  async function handleToggleActive(profile) {
    setError('')
    try {
      await updateProfile(profile.id, { active: !profile.active })
      await refresh()
      onProfilesChanged?.()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDelete(profile) {
    setError('')
    try {
      await deleteProfile(profile.id)
      await refresh()
      onProfilesChanged?.()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleCreate() {
    if (!newName.trim()) return
    setSaving(true)
    setError('')
    try {
      await createProfile(newName.trim(), newColor, activeCount < 5)
      setNewName('')
      setNewColor('#6366f1')
      setCreating(false)
      await refresh()
      onProfilesChanged?.()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="ink-panel flex flex-col h-full bg-panel rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Profiles</p>
          <span className="text-xs text-slate-400 font-semibold">{activeCount}/5 active</span>
        </div>

        {error && <p className="text-xs text-red-600 mt-1 font-semibold">{error}</p>}

        {/* Create form */}
        {creating ? (
          <div className="flex flex-col gap-1.5 mt-2">
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Profile name..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newColor}
                onChange={e => setNewColor(e.target.value)}
                className="w-9 h-9 rounded border border-slate-300 cursor-pointer p-0.5"
              />
              <button
                onClick={handleCreate}
                disabled={saving}
                className="flex-1 bg-cyan-700 hover:bg-cyan-800 text-white text-sm font-semibold px-3 py-2 rounded-lg disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => { setCreating(false); setNewName(''); setNewColor('#6366f1') }}
                className="text-sm text-slate-500 hover:text-slate-700 px-2 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="mt-2 w-full border border-dashed border-slate-300 hover:border-cyan-500 text-slate-400 hover:text-cyan-700 text-sm rounded-lg py-2 transition-colors"
          >
            + New Profile
          </button>
        )}
      </div>

      {/* Profile list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {profiles.map(profile => (
          <div
            key={profile.id}
            className={[
              'rounded-xl border p-3 transition-opacity',
              profile.active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-cyan-50 opacity-60',
            ].join(' ')}
          >
            {/* Profile name row */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: profile.color }}
              />
              <span className="font-semibold text-sm text-[#0b3a54] flex-1 truncate">{profile.name}</span>
              {profile.is_preset && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 shrink-0">
                  preset
                </span>
              )}
            </div>

            {/* Keyword count */}
            <p className="text-xs text-slate-400 mb-2">
              {profile.keyword_count} keyword{profile.keyword_count !== 1 ? 's' : ''}
            </p>

            {/* Actions */}
            <div className="flex gap-1.5">
              <button
                onClick={() => onOpenKeywords?.(profile)}
                className="flex-1 text-xs font-semibold bg-cyan-50 hover:bg-cyan-100 text-slate-700 rounded-lg px-2 py-1.5 transition-colors"
              >
                Keywords
              </button>
              <button
                onClick={() => handleToggleActive(profile)}
                className={[
                  'flex-1 text-xs font-semibold rounded-lg px-2 py-1.5 transition-colors',
                  profile.active
                    ? 'bg-cyan-800 hover:bg-cyan-900 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white',
                ].join(' ')}
              >
                {profile.active ? 'Deactivate' : 'Activate'}
              </button>
              {!profile.is_preset && (
                <button
                  onClick={() => handleDelete(profile)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 hover:bg-red-700 text-red-600 hover:text-white text-sm font-bold transition-colors shrink-0"
                  aria-label="Delete profile"
                >
                  X
                </button>
              )}
            </div>
          </div>
        ))}

        {profiles.length === 0 && (
          <p className="text-sm text-slate-400 text-center mt-8">No profiles yet</p>
        )}
      </div>
    </div>
  )
}



