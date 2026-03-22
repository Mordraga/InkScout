import React from 'react'
import { Link } from 'react-router-dom'
import MarketingLayout from '../components/MarketingLayout.jsx'
import { LEGAL_POLICY_META } from '../legal/policyMeta.js'

export default function LegalRefundPage() {
  const meta = LEGAL_POLICY_META

  return (
    <MarketingLayout>
      <section className="max-w-4xl mx-auto px-4 pt-14 pb-16">
        <h1 className="text-3xl font-extrabold text-white">Refund Policy</h1>
        <p className="text-cyan-100/90 mt-2 text-sm">
          Effective date: {meta.effectiveDateLabel}
        </p>

        <div className="ink-panel rounded-xl p-6 mt-5 text-sm text-slate-700 space-y-6">
          <section>
            <h2 className="text-base font-bold text-[#0c3348]">1. General Rule</h2>
            <p className="mt-2">
              All subscription charges are final once payment is processed by Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">2. Limited Exceptions</h2>
            <p className="mt-2">
              Refunds are only considered for verified system error, duplicate charge, or where required by applicable
              law.
            </p>
            <p className="mt-2">
              Cancellation stops future renewals but does not create prorated refunds for the current paid period.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">3. How to Request Review</h2>
            <p className="mt-2">
              Send requests to <a className="text-cyan-700 hover:text-cyan-800" href={meta.supportEmailMailto}>{meta.supportEmail}</a>
              {' '}and include your account email, Stripe receipt ID, charge date, amount, and a short description
              of the issue.
            </p>
            <p className="mt-2">
              You may also review related billing terms in the <Link className="text-cyan-700 hover:text-cyan-800" to="/legal/terms">Terms of Service</Link>.
            </p>
          </section>
        </div>
      </section>
    </MarketingLayout>
  )
}
