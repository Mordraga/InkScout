import React from 'react'
import MarketingLayout from '../components/MarketingLayout.jsx'

export default function LegalTermsPage() {
  return (
    <MarketingLayout>
      <section className="max-w-4xl mx-auto px-4 pt-14 pb-16">
        <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
        <div className="ink-panel rounded-xl p-6 mt-5 text-sm text-slate-700 space-y-3">
          <p>By using InkScout, you agree to use the service lawfully and not abuse platform APIs or third-party services.</p>
          <p>Subscriptions renew automatically unless canceled before the next billing cycle.</p>
          <p>Service limits and features depend on your active plan.</p>
        </div>
      </section>
    </MarketingLayout>
  )
}
