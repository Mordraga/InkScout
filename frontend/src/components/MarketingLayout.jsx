import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function MarketingLayout({ children }) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen text-slate-100">
      <header className="ink-header sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="font-extrabold tracking-tight text-white text-lg">
            {'\uD83E\uDD91'} InkScout
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-cyan-100/90">
            <Link to="/pricing" className="hover:text-white">Pricing</Link>
            <Link to="/faq" className="hover:text-white">FAQ</Link>
            <Link to="/legal/privacy" className="hover:text-white">Privacy</Link>
          </nav>
          <div className="flex-1" />
          {user ? (
            <Link to="/app" className="text-xs px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold">
              Open App
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-xs px-3 py-2 rounded-lg border border-cyan-200/30 text-cyan-100 hover:text-white">
                Log in
              </Link>
              <Link to="/signup" className="text-xs px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold">
                Start Free
              </Link>
            </div>
          )}
        </div>
      </header>

      <main>{children}</main>

      <footer className="max-w-6xl mx-auto px-4 py-8 text-xs text-cyan-100/75 flex flex-wrap gap-3">
        <Link to="/legal/terms" className="hover:text-white">Terms</Link>
        <Link to="/legal/privacy" className="hover:text-white">Privacy</Link>
        <Link to="/legal/refund" className="hover:text-white">Refunds</Link>
      </footer>
    </div>
  )
}
