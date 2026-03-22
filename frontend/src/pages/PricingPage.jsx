import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import MarketingLayout from '../components/MarketingLayout.jsx'
import { PLAN_DEFS, yearlyPrice } from '../planCatalog.js'
import { createCheckoutSession, getEntitlements } from '../api.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { LEGAL_POLICY_META } from '../legal/policyMeta.js'

const BILLING_ENV_ENABLED = (import.meta.env.VITE_ENABLE_BILLING || '').toLowerCase() === 'true'

export default function PricingPage() {
  const meta = LEGAL_POLICY_META
  const [cadence, setCadence] = useState('monthly')
  const [workingPlan, setWorkingPlan] = useState('')
  const [error, setError] = useState('')
  const [billingReady, setBillingReady] = useState(BILLING_ENV_ENABLED)
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    let active = true
    if (!user || !BILLING_ENV_ENABLED) return () => {}
    getEntitlements()
      .then((data) => {
        if (!active) return
        setBillingReady(Boolean(data?.billing_ready))
      })
      .catch(() => {
        if (!active) return
        setBillingReady(false)
      })
    return () => { active = false }
  }, [user])

  const checkoutState = new URLSearchParams(location.search).get('checkout')
  const banner = useMemo(() => {
    if (checkoutState === 'success') return 'Checkout complete. Your plan will update shortly.'
    if (checkoutState === 'cancel') return 'Checkout canceled. No changes were made.'
    return ''
  }, [checkoutState])

  async function handleChoose(planId) {
    setError('')
    if (planId === 'free') {
      navigate(user ? '/app' : '/signup')
      return
    }

    if (!billingReady) {
      setError('Billing is not configured yet. Set billing env vars and Stripe prices to enable checkout.')
      return
    }

    if (!user) {
      navigate(`/signup?plan=${encodeURIComponent(planId)}&cadence=${encodeURIComponent(cadence)}`)
      return
    }

    try {
      setWorkingPlan(planId)
      const data = await createCheckoutSession({
        plan: planId,
        cadence,
        email: user.email || undefined,
      })
      if (!data?.url) {
        throw new Error('Checkout URL missing from server response.')
      }
      window.location.assign(data.url)
    } catch (e) {
      setError(e.message || 'Unable to start checkout.')
    } finally {
      setWorkingPlan('')
    }
  }

  return (
    <MarketingLayout>
      <section className="max-w-6xl mx-auto px-4 pt-14 pb-8">
        <p className="text-cyan-200 uppercase tracking-[0.18em] text-[11px] font-bold">Pricing</p>
        <h1 className="text-4xl font-extrabold text-white mt-2">Choose your scouting speed.</h1>
        <p className="text-cyan-100/90 mt-3 max-w-2xl">
          Start free, then move to paid tiers as your outreach pipeline grows. Paid plans auto-renew through Stripe
          until canceled. Annual billing saves 20%.
        </p>

        <div className="mt-6 inline-flex rounded-xl border border-cyan-200/25 overflow-hidden">
          <button
            className={`px-4 py-2 text-sm font-semibold ${cadence === 'monthly' ? 'bg-cyan-600 text-white' : 'bg-transparent text-cyan-100'}`}
            onClick={() => setCadence('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 text-sm font-semibold ${cadence === 'annual' ? 'bg-cyan-600 text-white' : 'bg-transparent text-cyan-100'}`}
            onClick={() => setCadence('annual')}
          >
            Annual (20% off)
          </button>
        </div>

        {banner && (
          <p className="mt-4 text-sm text-cyan-100 bg-cyan-900/45 border border-cyan-400/30 rounded-lg px-3 py-2 inline-block">
            {banner}
          </p>
        )}
        {!billingReady && (
          <p className="mt-4 text-sm text-amber-200 bg-amber-900/45 border border-amber-300/40 rounded-lg px-3 py-2 inline-block">
            Paid checkout is currently disabled until billing configuration is complete.
          </p>
        )}
        {error && (
          <p className="mt-3 text-sm text-rose-200 bg-rose-900/45 border border-rose-300/40 rounded-lg px-3 py-2 inline-block">
            {error}
          </p>
        )}
        <p className="mt-4 text-xs text-cyan-100/85 max-w-3xl">
          Charges are final once processed, except verified system error, duplicate charge, or where required by law.
          {' '}See <Link to="/legal/refund" className="text-cyan-200 hover:text-white underline underline-offset-2">Refund Policy</Link>
          {' '}and <Link to="/legal/terms" className="text-cyan-200 hover:text-white underline underline-offset-2">Terms</Link>.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {PLAN_DEFS.map((plan) => {
          const isWorking = workingPlan === plan.id
          const price = cadence === 'monthly' ? plan.monthly : yearlyPrice(plan.monthly)
          return (
            <div key={plan.id} className="ink-panel rounded-2xl p-5 flex flex-col">
              <p className="text-sm text-cyan-700 font-bold uppercase tracking-widest">{plan.name}</p>
              <p className="text-[#0c3348] text-3xl font-extrabold mt-2">
                ${price}
                <span className="text-sm font-semibold text-slate-500">/{cadence === 'monthly' ? 'mo' : 'yr'}</span>
              </p>
              <p className="text-sm text-slate-600 mt-2">{plan.blurb}</p>
              <ul className="mt-4 text-sm text-slate-700 space-y-1">
                {plan.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
              <button
                className="mt-5 px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-semibold disabled:opacity-60"
                onClick={() => handleChoose(plan.id)}
                disabled={isWorking || (!billingReady && plan.id !== 'free')}
              >
                {isWorking ? 'Redirecting...' : plan.cta}
              </button>
            </div>
          )
        })}
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="ink-panel rounded-2xl p-6">
          <h2 className="text-[#0c3348] text-xl font-bold">Need help selecting a plan?</h2>
          <p className="text-sm text-slate-600 mt-2">
            Start on Free, then upgrade once you are consistently sourcing leads every week. For policy questions,
            contact <a href={meta.supportEmailMailto} className="text-cyan-700 hover:text-cyan-800">{meta.supportEmail}</a>.
          </p>
          <div className="mt-4">
            <Link to="/faq" className="text-cyan-700 font-semibold hover:text-cyan-800">Read the FAQ</Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
