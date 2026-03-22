import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ToolApp from '../ToolApp.jsx'
import { createCheckoutSession, getEntitlements } from '../api.js'
import { useAuth } from '../contexts/AuthContext.jsx'

const DEFAULT_ENTITLEMENTS = {
  plan: 'free',
  cadence: 'monthly',
  features: {
    manual_search_enabled: true,
    auto_search_enabled: false,
    twitter_search_enabled: false,
    bluesky_search_enabled: true,
    mootskeeper_integration: false,
    priority_support: false,
    max_results_per_run: 5,
    min_auto_interval_mins: 30,
  },
  billing_ready: false,
}

export default function AppPage() {
  const [entitlements, setEntitlements] = useState(DEFAULT_ENTITLEMENTS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()
  const handledCheckoutIntent = useRef(false)

  async function refreshEntitlements() {
    try {
      const next = await getEntitlements()
      setEntitlements(next)
      setError('')
    } catch (e) {
      setError(e.message || 'Unable to load entitlements.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshEntitlements()
  }, [])

  useEffect(() => {
    if (!user || handledCheckoutIntent.current) return
    const params = new URLSearchParams(location.search)
    const plan = (params.get('plan') || '').toLowerCase()
    const cadence = (params.get('cadence') || 'monthly').toLowerCase()
    if (!plan || plan === 'free') return
    const intentKey = `checkout-intent:${user.id}:${plan}:${cadence}`
    if (sessionStorage.getItem(intentKey)) {
      navigate('/app', { replace: true })
      return
    }
    sessionStorage.setItem(intentKey, '1')
    handledCheckoutIntent.current = true
    createCheckoutSession({ plan, cadence, email: user.email || undefined })
      .then((res) => {
        if (res?.url) {
          window.location.assign(res.url)
          return
        }
        navigate('/pricing', { replace: true })
      })
      .catch(() => {
        navigate('/pricing', { replace: true })
      })
  }, [location.search, navigate, user])

  const blockingState = useMemo(() => {
    if (loading) return 'Loading workspace...'
    if (error) return error
    return ''
  }, [loading, error])

  if (blockingState) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="ink-panel rounded-xl p-5 text-[#0c3348] text-sm">{blockingState}</div>
      </div>
    )
  }

  return (
    <ToolApp
      entitlements={entitlements}
      onOpenPricing={() => navigate('/pricing')}
      onSignOut={async () => {
        await signOut()
        navigate('/', { replace: true })
      }}
      userEmail={user?.email || ''}
    />
  )
}
