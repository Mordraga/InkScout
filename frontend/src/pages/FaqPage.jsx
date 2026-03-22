import React from 'react'
import MarketingLayout from '../components/MarketingLayout.jsx'

const FAQS = [
  {
    q: 'What does the Free plan include?',
    a: 'Free includes Bluesky search and manual runs inside the app. Automatic search and Twitter unlock on paid plans.',
  },
  {
    q: 'How do paid plans work?',
    a: 'Paid plans are monthly or annual subscriptions. Your selected tier controls search cadence and feature availability.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your billing provider at any time. Your account remains active through the current billing period.',
  },
  {
    q: 'How is this different from keyword alerts?',
    a: 'InkScout scores intent and organizes leads in a triage workspace, instead of dumping raw alerts into a feed.',
  },
]

export default function FaqPage() {
  return (
    <MarketingLayout>
      <section className="max-w-4xl mx-auto px-4 pt-14 pb-16">
        <p className="text-cyan-200 uppercase tracking-[0.18em] text-[11px] font-bold">FAQ</p>
        <h1 className="text-4xl font-extrabold text-white mt-2">Answers before you subscribe.</h1>
        <div className="mt-8 space-y-3">
          {FAQS.map((item) => (
            <div key={item.q} className="ink-panel rounded-xl p-5">
              <h3 className="font-bold text-[#0c3348]">{item.q}</h3>
              <p className="text-sm text-slate-600 mt-2">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  )
}
