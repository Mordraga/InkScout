import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
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
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
