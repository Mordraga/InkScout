import React from 'react'
import MarketingLayout from '../components/MarketingLayout.jsx'

export default function LegalPrivacyPage() {
  return (
    <MarketingLayout>
      <section className="max-w-4xl mx-auto px-4 pt-14 pb-16">
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
        <div className="ink-panel rounded-xl p-6 mt-5 text-sm text-slate-700 space-y-3">
          <p>InkScout stores account identity, plan state, and app settings needed to deliver the service.</p>
          <p>We do not sell your personal data. Payment details are handled by Stripe.</p>
          <p>You may request account data removal by contacting support.</p>
        </div>
      </section>
    </MarketingLayout>
  )
}
