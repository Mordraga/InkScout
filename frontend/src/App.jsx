import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { getAlphaStatus } from './api.js'
import { clearAlphaToken } from './alphaAccess.js'
import { getLaunchPhase } from './launchGate.js'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import AlphaLockedPage from './pages/AlphaLockedPage.jsx'
import AppPage from './pages/AppPage.jsx'
import FaqPage from './pages/FaqPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LegalPrivacyPage from './pages/LegalPrivacyPage.jsx'
import LegalRefundPage from './pages/LegalRefundPage.jsx'
import LegalTermsPage from './pages/LegalTermsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PricingPage from './pages/PricingPage.jsx'
import SignupPage from './pages/SignupPage.jsx'

export default function App() {
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [alphaAccessGranted, setAlphaAccessGranted] = useState(false)
  const [alphaChecking, setAlphaChecking] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const phase = getLaunchPhase(nowMs)

  useEffect(() => {
    let active = true

    async function syncAlphaAccess() {
      if (phase === 'public') {
        if (!active) return
        setAlphaAccessGranted(true)
        setAlphaChecking(false)
        return
      }

      if (phase === 'prealpha') {
        if (!active) return
        setAlphaAccessGranted(false)
        setAlphaChecking(false)
        return
      }

      setAlphaChecking(true)
      try {
        const data = await getAlphaStatus()
        if (!active) return
        setAlphaAccessGranted(Boolean(data?.access_granted))
      } catch {
        if (!active) return
        clearAlphaToken()
        setAlphaAccessGranted(false)
      } finally {
        if (!active) return
        setAlphaChecking(false)
      }
    }

    syncAlphaAccess()
    return () => { active = false }
  }, [phase])

  const gateOpen = phase === 'public' || (phase === 'alpha' && alphaAccessGranted)

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {gateOpen ? (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/legal/terms" element={<LegalTermsPage />} />
              <Route path="/legal/privacy" element={<LegalPrivacyPage />} />
              <Route path="/legal/refund" element={<LegalRefundPage />} />
              <Route
                path="/app"
                element={(
                  <ProtectedRoute>
                    <AppPage />
                  </ProtectedRoute>
                )}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <Route
              path="*"
              element={(
                <AlphaLockedPage
                  phase={phase}
                  nowMs={nowMs}
                  alphaChecking={alphaChecking}
                  onAlphaGranted={() => setAlphaAccessGranted(true)}
                />
              )}
            />
          )}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
