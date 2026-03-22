import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { redeemAlphaKey } from '../api.js'
import { LEGAL_POLICY_META } from '../legal/policyMeta.js'
import {
  ALPHA_START_AT_LABEL,
  PUBLIC_START_AT_LABEL,
  getAlphaStartMs,
  getCountdownTo,
  getPublicStartMs,
} from '../launchGate.js'

function CountCard({ label, value }) {
  return (
    <div className="ink-panel rounded-xl px-4 py-3 min-w-[86px] text-center">
      <p className="text-3xl font-extrabold text-[#0c3348] tabular-nums">{String(value).padStart(2, '0')}</p>
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mt-1">{label}</p>
    </div>
  )
}

export default function AlphaLockedPage({
  phase,
  nowMs,
  alphaChecking = false,
  isAuthenticated = false,
  preregistered = false,
  onAlphaGranted,
}) {
  const isPrealpha = phase === 'prealpha'
  const isAlpha = phase === 'alpha'
  const [alphaKey, setAlphaKey] = useState('')
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const countdown = isPrealpha
    ? getCountdownTo(getAlphaStartMs(), nowMs)
    : getCountdownTo(getPublicStartMs(), nowMs)

  async function handleRedeem(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    const key = alphaKey.trim()
    if (!key) {
      setError('Enter your alpha key.')
      return
    }

    setWorking(true)
    try {
      const data = await redeemAlphaKey(key)
      if (isPrealpha) {
        if (data?.preregistered) {
          setNotice(`Key registered. Your access unlocks on ${ALPHA_START_AT_LABEL}.`)
          setAlphaKey('')
          if (typeof onAlphaGranted === 'function') onAlphaGranted()
          return
        }
        throw new Error('Key was processed, but preregistration could not be confirmed.')
      }
      if (isAlpha && data?.access_granted) {
        setNotice('Access granted. Redirecting...')
        setAlphaKey('')
        if (typeof onAlphaGranted === 'function') onAlphaGranted()
        return
      }
      throw new Error('Key was processed but access was not granted.')
    } catch (err) {
      setError(err.message || 'Unable to redeem alpha key.')
    } finally {
      setWorking(false)
    }
  }

  return (
    <div className="min-h-screen text-slate-100 px-4">
      <section className="max-w-3xl mx-auto pt-16 pb-14">
        <p className="text-cyan-200 uppercase tracking-[0.2em] text-[11px] font-bold">InkScout Alpha Lock</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-white leading-tight">
          {isPrealpha ? 'Reserve your alpha access.' : 'Alpha access is live.'}
        </h1>
        <p className="mt-4 text-cyan-100/90 text-sm md:text-base max-w-2xl">
          {isPrealpha ? (
            <>
              InkScout is locked while alpha prep finishes. You can register your key now, and access opens on
              {' '}<span className="font-bold text-white">{ALPHA_START_AT_LABEL}</span>.
            </>
          ) : (
            <>
              Alpha key access is active now. Public rollout is targeted for
              {' '}<span className="font-bold text-white">{PUBLIC_START_AT_LABEL}</span>.
            </>
          )}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <CountCard label="Days" value={countdown.days} />
          <CountCard label="Hours" value={countdown.hours} />
          <CountCard label="Minutes" value={countdown.minutes} />
          <CountCard label="Seconds" value={countdown.seconds} />
        </div>

        {!isAuthenticated && (
          <div className="ink-panel rounded-2xl p-5 mt-8 text-slate-700">
            <p className="font-bold text-[#0c3348]">Sign in to manage alpha access</p>
            <p className="text-sm mt-2">
              Use your Supabase account first, then redeem your alpha key from this page.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/login" className="px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-semibold">
                Log in
              </Link>
              <Link to="/signup" className="px-4 py-2 rounded-lg border border-cyan-300 text-cyan-800 hover:bg-cyan-50 font-semibold">
                Create account
              </Link>
            </div>
          </div>
        )}

        {isAuthenticated && (isPrealpha || isAlpha) && (
          <div className="ink-panel rounded-2xl p-5 mt-8 text-slate-700">
            <p className="font-bold text-[#0c3348]">Enter your alpha key</p>
            <p className="text-sm mt-2">
              {isPrealpha
                ? 'Register your invite key now so access is ready at launch.'
                : 'Redeem access using your invite key.'}
            </p>
            {preregistered && (
              <p className="text-xs mt-3 bg-emerald-100 border border-emerald-200 rounded-lg px-3 py-2 text-emerald-800">
                This account is preregistered for alpha access.
              </p>
            )}
            {isAlpha && alphaChecking && (
              <p className="text-xs mt-3 bg-cyan-50 border border-cyan-200 rounded-lg px-3 py-2 text-cyan-800">
                Checking existing alpha access...
              </p>
            )}
            {error && (
              <p className="text-xs mt-3 bg-rose-100 border border-rose-200 rounded-lg px-3 py-2 text-rose-700">
                {error}
              </p>
            )}
            {notice && (
              <p className="text-xs mt-3 bg-emerald-100 border border-emerald-200 rounded-lg px-3 py-2 text-emerald-800">
                {notice}
              </p>
            )}
            <form className="mt-3 flex flex-col gap-2" onSubmit={handleRedeem}>
              <input
                type="text"
                value={alphaKey}
                onChange={(e) => setAlphaKey(e.target.value)}
                placeholder="Enter alpha key"
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                autoComplete="off"
              />
              <button
                type="submit"
                className="sm:self-start px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-semibold disabled:opacity-60"
                disabled={working}
              >
                {working ? 'Checking...' : 'Unlock'}
              </button>
            </form>
          </div>
        )}

        <div className="ink-panel rounded-2xl p-5 mt-8 text-slate-700">
          <p className="font-bold text-[#0c3348]">Need help?</p>
          <p className="text-sm mt-2">
            Contact
            {' '}<a href={LEGAL_POLICY_META.supportEmailMailto} className="text-cyan-700 hover:text-cyan-800 font-semibold">{LEGAL_POLICY_META.supportEmail}</a>
            {' '}for alpha access coordination.
          </p>
        </div>
      </section>
    </div>
  )
}
