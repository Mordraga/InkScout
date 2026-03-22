import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { createCheckoutSession } from '../api.js'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { signInWithPassword, signInWithGoogle, supabaseConfigured } = useAuth()

  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const nextPath = params.get('next') || '/app'
  const pendingPlan = (params.get('plan') || '').toLowerCase()
  const pendingCadence = (params.get('cadence') || 'monthly').toLowerCase()

  async function maybeStartCheckout(userEmail) {
    if (!pendingPlan || pendingPlan === 'free') return false
    const data = await createCheckoutSession({
      plan: pendingPlan,
      cadence: pendingCadence,
      email: userEmail || undefined,
    })
    if (data?.url) {
      window.location.assign(data.url)
      return true
    }
    return false
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setWorking(true)
    try {
      const data = await signInWithPassword(email, password)
      const redirected = await maybeStartCheckout(data?.session?.user?.email)
      if (!redirected) navigate(nextPath, { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to log in.')
    } finally {
      setWorking(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setWorking(true)
    try {
      const redirectPath = pendingPlan && pendingPlan !== 'free'
        ? `/app?plan=${encodeURIComponent(pendingPlan)}&cadence=${encodeURIComponent(pendingCadence)}`
        : nextPath
      await signInWithGoogle(redirectPath)
    } catch (err) {
      setError(err.message || 'Unable to start Google login.')
      setWorking(false)
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to keep scouting your lead pipeline."
      footerText="Need an account?"
      footerLinkTo={location.search ? `/signup${location.search}` : '/signup'}
      footerLinkText="Create one"
    >
      {!supabaseConfigured && (
        <p className="text-xs bg-amber-100 text-amber-800 rounded-lg px-3 py-2 mb-3">
          Supabase is not configured. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
        </p>
      )}
      {error && (
        <p className="text-xs bg-rose-100 text-rose-700 rounded-lg px-3 py-2 mb-3">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={working || !supabaseConfigured}
          className="w-full bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-60"
        >
          {working ? 'Working...' : 'Log in'}
        </button>
      </form>
      <button
        onClick={handleGoogle}
        disabled={working || !supabaseConfigured}
        className="w-full mt-3 border border-slate-300 rounded-lg py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
      >
        Continue with Google
      </button>
    </AuthCard>
  )
}
