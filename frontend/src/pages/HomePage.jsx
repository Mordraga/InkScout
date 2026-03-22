import React from 'react'
import { Link } from 'react-router-dom'
import MarketingLayout from '../components/MarketingLayout.jsx'

export default function HomePage() {
  return (
    <MarketingLayout>
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-14">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-cyan-200 uppercase tracking-[0.2em] text-[11px] font-bold">Lead Discovery For Artists</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Catch commission-ready posts before everyone else.
            </h1>
            <p className="mt-4 text-cyan-100/90 max-w-xl">
              InkScout scans social channels, scores leads, and keeps your pipeline organized so you can spend time closing work instead of doom-scrolling.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/signup" className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold">
                Start Free
              </Link>
              <Link to="/pricing" className="px-5 py-3 rounded-xl border border-cyan-200/30 text-cyan-100 hover:text-white font-semibold">
                View Plans
              </Link>
            </div>
          </div>

          <div className="ink-panel rounded-2xl p-4 text-slate-700">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-700 font-bold">Product Preview</p>
            <div className="mt-3 grid gap-3">
              <div className="rounded-xl bg-cyan-50 border border-cyan-100 p-3">
                <p className="text-xs font-bold text-cyan-800">Incoming Leads</p>
                <p className="text-sm text-slate-600 mt-1">@artistfinder Looking for VTuber model artist, budget flexible</p>
              </div>
              <div className="rounded-xl bg-cyan-50 border border-cyan-100 p-3">
                <p className="text-xs font-bold text-cyan-800">Profile Workflows</p>
                <p className="text-sm text-slate-600 mt-1">General Commissions, Vtuber and Live2D, Stream Assets</p>
              </div>
              <div className="rounded-xl bg-cyan-50 border border-cyan-100 p-3">
                <p className="text-xs font-bold text-cyan-800">Workspace Actions</p>
                <p className="text-sm text-slate-600 mt-1">Open post, mark active, push hot leads into MootsKeeper.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="ink-panel rounded-2xl p-5">
            <h3 className="text-[#0c3348] font-bold">Signal Over Noise</h3>
            <p className="text-sm text-slate-600 mt-2">Keyword + synonym scoring surfaces posts with clear commission intent.</p>
          </div>
          <div className="ink-panel rounded-2xl p-5">
            <h3 className="text-[#0c3348] font-bold">Automated Cadence</h3>
            <p className="text-sm text-slate-600 mt-2">Paid plans run autonomous searches while you focus on outreach and delivery.</p>
          </div>
          <div className="ink-panel rounded-2xl p-5">
            <h3 className="text-[#0c3348] font-bold">Built For Conversion</h3>
            <p className="text-sm text-slate-600 mt-2">Fast triage and status tracking help you prioritize leads that actually close.</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="ink-panel rounded-2xl p-8 text-center">
          <p className="text-cyan-700 uppercase tracking-[0.18em] text-[11px] font-bold">Ready To Scout</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0c3348] mt-2">Start free and upgrade when your pipeline grows.</h2>
          <div className="mt-5 flex justify-center gap-3 flex-wrap">
            <Link to="/signup" className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold">
              Create Free Account
            </Link>
            <Link to="/pricing" className="px-5 py-2.5 rounded-xl border border-cyan-200 text-cyan-700 hover:bg-cyan-50 font-semibold">
              Compare Plans
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
