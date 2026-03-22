import React from 'react'
import MarketingLayout from '../components/MarketingLayout.jsx'

export default function LegalRefundPage() {
  return (
    <MarketingLayout>
      <section className="max-w-4xl mx-auto px-4 pt-14 pb-16">
        <h1 className="text-3xl font-extrabold text-white">Refund Policy</h1>
        <div className="ink-panel rounded-xl p-6 mt-5 text-sm text-slate-700 space-y-3">
          <p>Monthly and annual subscriptions are billed in advance.</p>
          <p>Refund requests are reviewed case-by-case for accidental charges or technical service outages.</p>
          <p>To request support, contact the billing email listed in your account settings.</p>
        </div>
      </section>
    </MarketingLayout>
  )
}
