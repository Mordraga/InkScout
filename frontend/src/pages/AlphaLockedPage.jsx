import React from 'react'
import { ALPHA_UNLOCK_AT_LABEL, getCountdown } from '../launchGate.js'
import { LEGAL_POLICY_META } from '../legal/policyMeta.js'

function CountCard({ label, value }) {
  return (
    <div className="ink-panel rounded-xl px-4 py-3 min-w-[86px] text-center">
      <p className="text-3xl font-extrabold text-[#0c3348] tabular-nums">{String(value).padStart(2, '0')}</p>
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mt-1">{label}</p>
    </div>
  )
}

export default function AlphaLockedPage({ nowMs }) {
  const countdown = getCountdown(nowMs)

  return (
    <div className="min-h-screen text-slate-100 px-4">
      <section className="max-w-3xl mx-auto pt-16 pb-14">
        <p className="text-cyan-200 uppercase tracking-[0.2em] text-[11px] font-bold">InkScout Alpha Lock</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-white leading-tight">
          Hatch opens soon.
        </h1>
        <p className="mt-4 text-cyan-100/90 text-sm md:text-base max-w-2xl">
          InkScout is temporarily locked while alpha prep finishes. Public access opens on
          {' '}<span className="font-bold text-white">{ALPHA_UNLOCK_AT_LABEL}</span>.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <CountCard label="Days" value={countdown.days} />
          <CountCard label="Hours" value={countdown.hours} />
          <CountCard label="Minutes" value={countdown.minutes} />
          <CountCard label="Seconds" value={countdown.seconds} />
        </div>

        <div className="ink-panel rounded-2xl p-5 mt-8 text-slate-700">
          <p className="font-bold text-[#0c3348]">Need access before launch?</p>
          <p className="text-sm mt-2">
            Contact
            {' '}<a href={LEGAL_POLICY_META.supportEmailMailto} className="text-cyan-700 hover:text-cyan-800 font-semibold">{LEGAL_POLICY_META.supportEmail}</a>
            {' '}for alpha coordination.
          </p>
        </div>
      </section>
    </div>
  )
}
