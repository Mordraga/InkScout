import React from 'react'
import MarketingLayout from '../components/MarketingLayout.jsx'
import { LEGAL_POLICY_META } from '../legal/policyMeta.js'

export default function LegalPrivacyPage() {
  const meta = LEGAL_POLICY_META

  return (
    <MarketingLayout>
      <section className="max-w-4xl mx-auto px-4 pt-14 pb-16">
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-cyan-100/90 mt-2 text-sm">
          Effective date: {meta.effectiveDateLabel}
        </p>

        <div className="ink-panel rounded-xl p-6 mt-5 text-sm text-slate-700 space-y-6">
          <section>
            <h2 className="text-base font-bold text-[#0c3348]">1. Scope</h2>
            <p className="mt-2">
              This Privacy Policy describes how {meta.operatorName} collects, uses, stores, and shares information
              when you use InkScout.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">2. Data We Collect</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Account and authentication data, such as email address, user ID, and session/auth records.</li>
              <li>Workspace and app data, including profiles, keywords, leads, settings, blacklist, and synonyms.</li>
              <li>Billing metadata, including plan, cadence, subscription status, and Stripe checkout references.</li>
              <li>Support communications and records required to investigate account or billing issues.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">3. How We Use Data</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Operate and secure the service.</li>
              <li>Manage subscriptions, plan entitlements, and billing-related events.</li>
              <li>Provide support, investigate abuse, and enforce Terms of Service.</li>
              <li>Communicate service and policy updates.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">4. Service Providers</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Supabase is used for authentication and application data infrastructure.</li>
              <li>Stripe is used for payment processing and subscription billing.</li>
            </ul>
            <p className="mt-2">
              We do not sell personal data.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">5. AI and Model Training</h2>
            <p className="mt-2">
              InkScout does not use user-submitted content to train product models.
            </p>
            <p className="mt-2">
              Content involved in policy violations may be reviewed only for moderation, enforcement, and appeals.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">6. Retention and Deletion</h2>
            <p className="mt-2">
              You may request account and data deletion by contacting
              {' '}<a className="text-cyan-700 hover:text-cyan-800" href={meta.supportEmailMailto}>{meta.supportEmail}</a>
              . We process verified deletion requests within {meta.deletionRequestWindowDays} days.
            </p>
            <p className="mt-2">
              Certain billing and tax records may be retained for up to {meta.billingRetentionYears} years where
              required by law or financial compliance obligations.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">7. Security and Eligibility</h2>
            <p className="mt-2">
              We use reasonable administrative and technical safeguards. InkScout is intended for users age 18 or older.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0c3348]">8. Policy Changes and Contact</h2>
            <p className="mt-2">
              Material updates are provided at least {meta.policyChangeNoticeDays} days in advance by email to the
              address on file.
            </p>
            <p className="mt-2">
              Privacy requests and questions: <a className="text-cyan-700 hover:text-cyan-800" href={meta.supportEmailMailto}>{meta.supportEmail}</a>
            </p>
          </section>
        </div>
      </section>
    </MarketingLayout>
  )
}
