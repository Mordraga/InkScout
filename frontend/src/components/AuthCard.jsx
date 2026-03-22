import React from 'react'
import { Link } from 'react-router-dom'

export default function AuthCard({ title, subtitle, children, footerText, footerLinkTo, footerLinkText }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="ink-modal rounded-2xl w-full max-w-md p-6">
        <Link to="/" className="text-xs text-cyan-700 font-semibold hover:text-cyan-800">
          {'<'} Back to site
        </Link>
        <h1 className="text-2xl font-extrabold text-[#0c3348] mt-3">{title}</h1>
        {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
        <div className="mt-5">{children}</div>
        {footerText && footerLinkTo && footerLinkText && (
          <p className="text-xs text-slate-500 mt-5">
            {footerText}{' '}
            <Link to={footerLinkTo} className="text-cyan-700 font-semibold hover:text-cyan-800">
              {footerLinkText}
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
