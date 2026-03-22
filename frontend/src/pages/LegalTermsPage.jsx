import React from 'react'
import MarketingLayout from '../components/MarketingLayout.jsx'
import { LEGAL_POLICY_META } from '../legal/policyMeta.js'

export default function LegalTermsPage() {
  const meta = LEGAL_POLICY_META

  return (
    <MarketingLayout>
      <section className="max-w-4xl mx-auto px-4 pt-14 pb-16">
        <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-cyan-100/90 mt-2 text-sm">
          Effective date: {meta.effectiveDateLabel}
        </p>

        <div className="ink-panel rounded-xl p-6 mt-5 text-sm text-slate-700 space-y-6">
          <section>
            <h2 className="text-base font-bold text-[#0c3348]">1. Agreement and Operator</h2>
            <p className="mt-2">
              These Terms govern your access to and use of InkScout. InkScout is operated by {meta.operatorName}
              {' '}from {meta.businessAddress}. By creating an account or using InkScout, you agree to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">2. Eligibility</h2>
            <p className="mt-2">
              You must be at least 18 years old to use InkScout. You are responsible for ensuring your use of
              InkScout complies with the terms and platform requirements of connected third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">3. Billing and Subscriptions</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Paid plans are billed through Stripe on a monthly or annual basis.</li>
              <li>Subscriptions renew automatically until canceled through Stripe before the next billing cycle.</li>
              <li>Feature limits and search cadence depend on your active plan.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">4. Acceptable and Prohibited Use</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Commercial use by smaller creators is allowed.</li>
              <li>
                Enterprise or internal corporate prospecting, sales-intelligence, or market-surveillance use is
                prohibited.
              </li>
              <li>Use that violates law, platform rules, or third-party API terms is prohibited.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">5. AI-Generated Visual Art Restriction</h2>
            <p className="mt-2">
              You may not use InkScout to promote or distribute primarily AI-generated visual art where more than 90%
              of the work is AI-generated and lacks meaningful human creative input.
            </p>
            <p className="mt-2">
              InkScout does not use user-submitted content to train product models. Suspected violations may be
              reviewed solely for moderation, enforcement, or appeals handling.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">6. Enforcement and Termination</h2>
            <p className="mt-2">
              We may suspend or terminate accounts that violate these Terms, misuse integrations, or create legal,
              operational, or security risk.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">7. Disclaimer of Warranties</h2>
            <p className="mt-2">
              InkScout is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of
              any kind, express or implied, to the fullest extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">8. Limitation of Liability</h2>
            <p className="mt-2">
              To the fullest extent permitted by law, {meta.operatorName}&apos;s total liability for any claim related
              to InkScout is limited to the fees you paid for InkScout in the 12 months before the event giving rise
              to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">9. Dispute Resolution and Governing Law</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>These Terms are governed by the laws of {meta.jurisdiction}.</li>
              <li>
                Disputes are resolved by binding arbitration administered by the American Arbitration Association
                (AAA) under applicable Consumer or Commercial Arbitration Rules.
              </li>
              <li>Either party may bring eligible claims in small claims court.</li>
              <li>
                You and InkScout waive any right to participate in class actions or class-wide arbitration.
              </li>
              <li>
                You may opt out of arbitration within {meta.arbitrationOptOutDays} days of account creation by
                emailing {meta.supportEmail} from the account email address and including your account identifier.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">10. Policy Changes and Notice</h2>
            <p className="mt-2">
              We may update these Terms from time to time. Material updates are provided at least
              {' '}{meta.policyChangeNoticeDays} days in advance by email to the address on file.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">11. Contact</h2>
            <p className="mt-2">
              Questions about these Terms: <a className="text-cyan-700 hover:text-cyan-800" href={meta.supportEmailMailto}>{meta.supportEmail}</a>
            </p>
          </section>
        </div>
      </section>
    </MarketingLayout>
  )
}
