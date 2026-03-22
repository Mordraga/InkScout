import React, { useState, useEffect } from 'react'
import { getSettings, updateSettings } from '../api.js'

export default function SettingsModal({ onClose, entitlements = null }) {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const twitterAllowed = Boolean(entitlements?.features?.twitter_search_enabled)

  useEffect(() => {
    getSettings()
      .then(s => setForm({ ...s }))
      .catch(e => setError(e.message))
  }, [])

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      await updateSettings({
        expiry_hours: Number(form.expiry_hours),
        search_interval_mins: Number(form.search_interval_mins),
        max_results_per_run: Number(form.max_results_per_run),
        keyword_mode: form.keyword_mode,
        min_replies: Number(form.min_replies),
        max_post_age_hours: Number(form.max_post_age_hours),
        exclude_replies: Boolean(form.exclude_replies),
        twitter_enabled: Boolean(form.twitter_enabled),
        bluesky_enabled: Boolean(form.bluesky_enabled),
        show_uninterested: Boolean(form.show_uninterested),
      })
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="ink-modal rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-200">
          <h2 className="font-bold text-slate-800">Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">X</button>
        </div>

        {!form ? (
          <div className="p-6 text-sm text-slate-400">{error || 'Loading...'}</div>
        ) : (
          <div className="p-5 space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Field label="Expiry window (hours)">
              <NumberInput value={form.expiry_hours} onChange={v => set('expiry_hours', v)} />
            </Field>

            <Field label="Search interval (min, >=5)">
              <NumberInput value={form.search_interval_mins} onChange={v => set('search_interval_mins', v)} />
            </Field>

            <Field label="Results per search (1-100)">
              <NumberInput value={form.max_results_per_run} onChange={v => set('max_results_per_run', v)} />
            </Field>

            <Field label="Keyword mode">
              <div className="flex gap-2">
                {['OR', 'AND'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => set('keyword_mode', mode)}
                    className={[
                      'px-4 py-1.5 rounded-lg text-sm font-semibold border',
                      form.keyword_mode === mode
                        ? 'bg-cyan-800 text-white border-cyan-800'
                        : 'bg-white text-slate-600 border-slate-300',
                    ].join(' ')}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Min replies (0 = any)">
              <NumberInput value={form.min_replies} onChange={v => set('min_replies', v)} />
            </Field>

            <Field label="Max post age (hours, 0 = any)">
              <NumberInput value={form.max_post_age_hours} onChange={v => set('max_post_age_hours', v)} />
            </Field>

            <Field label="Exclude replies">
              <Toggle checked={form.exclude_replies} onChange={v => set('exclude_replies', v)} />
            </Field>

            <Field label="Twitter">
              <Toggle
                checked={form.twitter_enabled}
                onChange={v => set('twitter_enabled', v)}
                disabled={!twitterAllowed}
              />
            </Field>
            {!twitterAllowed && (
              <p className="text-xs text-cyan-700 -mt-2">
                Twitter search is available on Basic and above.
              </p>
            )}

            <Field label="Bluesky">
              <Toggle checked={form.bluesky_enabled} onChange={v => set('bluesky_enabled', v)} />
            </Field>

            <Field label="Show uninterested leads">
              <Toggle checked={form.show_uninterested} onChange={v => set('show_uninterested', v)} />
            </Field>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-cyan-800 hover:bg-cyan-900 text-white py-2 rounded-lg font-semibold text-sm disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-cyan-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-700">{label}</span>
      {children}
    </div>
  )
}

function NumberInput({ value, onChange }) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-20 border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-cyan-500"
    />
  )
}

function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={[
        'w-11 h-6 rounded-full transition-colors relative overflow-hidden disabled:opacity-50',
        checked ? 'bg-active-green' : 'bg-slate-300',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1',
        ].join(' ')}
      />
    </button>
  )
}


