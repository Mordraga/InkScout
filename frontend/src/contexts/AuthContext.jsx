import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { supabase, supabaseConfigured } from '../supabase.js'
import { setApiUserIdentity } from '../userIdentity.js'

const AuthContext = createContext(null)

function listAuthProviders(user) {
  const providerSet = new Set()

  const appProviders = user?.app_metadata?.providers
  if (Array.isArray(appProviders)) {
    for (const provider of appProviders) {
      const normalized = String(provider || '').trim().toLowerCase()
      if (normalized) providerSet.add(normalized)
    }
  }

  const primaryProvider = String(user?.app_metadata?.provider || '').trim().toLowerCase()
  if (primaryProvider) providerSet.add(primaryProvider)

  const identities = user?.identities
  if (Array.isArray(identities)) {
    for (const identity of identities) {
      const normalized = String(identity?.provider || '').trim().toLowerCase()
      if (normalized) providerSet.add(normalized)
    }
  }

  return [...providerSet]
}

function hasNonEmailProvider(user) {
  return listAuthProviders(user).some((provider) => provider !== 'email')
}

function hasEmailProvider(user) {
  return listAuthProviders(user).includes('email')
}

function isExistingUserSignupResponse(data) {
  const user = data?.user
  if (!user || data?.session) return false
  if (!Array.isArray(user.identities)) return false
  return user.identities.length === 0
}

function isVerifiedUser(user) {
  return Boolean(
    user?.email_confirmed_at
    || user?.confirmed_at
    || (user?.email && hasNonEmailProvider(user))
  )
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)
  const user = session?.user ?? null

  async function refreshAuthState(forceRefresh = true) {
    if (!supabaseConfigured || !supabase) {
      if (mountedRef.current) {
        setSession(null)
        setLoading(false)
      }
      setApiUserIdentity(null, null)
      return { session: null, user: null, emailVerified: false }
    }

    let nextSession = null
    let nextUser = null

    const sessionResult = await supabase.auth.getSession()
    nextSession = sessionResult?.data?.session ?? null

    if (forceRefresh && nextSession) {
      const refreshed = await supabase.auth.refreshSession()
      nextSession = refreshed?.data?.session ?? nextSession
    }

    if (nextSession) {
      const userResult = await supabase.auth.getUser()
      nextUser = userResult?.data?.user ?? nextSession.user ?? null
      nextSession = { ...nextSession, user: nextUser }
    }

    if (mountedRef.current) {
      setSession(nextSession)
      setLoading(false)
    }
    setApiUserIdentity(nextSession?.user?.id ?? null, nextSession?.access_token ?? null)
    return {
      session: nextSession,
      user: nextSession?.user ?? null,
      emailVerified: isVerifiedUser(nextUser ?? nextSession?.user ?? null),
    }
  }

  useEffect(() => {
    let mounted = true
    if (!supabaseConfigured || !supabase) {
      setLoading(false)
      return () => {}
    }

    refreshAuthState(false).catch(() => {
      if (!mounted) return
      setSession(null)
      setApiUserIdentity(null, null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return
      setSession(nextSession)
      setApiUserIdentity(nextSession?.user?.id ?? null, nextSession?.access_token ?? null)
      setLoading(false)
    })

    function handleWindowFocus() {
      refreshAuthState(true).catch(() => {})
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        refreshAuthState(true).catch(() => {})
      }
    }

    window.addEventListener('focus', handleWindowFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      mounted = false
      mountedRef.current = false
      listener?.subscription?.unsubscribe()
      window.removeEventListener('focus', handleWindowFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const emailVerified = isVerifiedUser(user)

  const value = useMemo(() => ({
    supabaseConfigured,
    session,
    user,
    emailVerified,
    loading,
    async signInWithPassword(email, password) {
      if (!supabase) throw new Error('Supabase is not configured.')
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setApiUserIdentity(data?.session?.user?.id ?? null, data?.session?.access_token ?? null)
      return data
    },
    async signUpWithPassword(email, password) {
      if (!supabase) throw new Error('Supabase is not configured.')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })
      if (error) throw error
      if (isExistingUserSignupResponse(data)) {
        throw new Error('An account already exists for this email. Log in or continue with Google.')
      }
      setApiUserIdentity(data?.session?.user?.id ?? null, data?.session?.access_token ?? null)
      return data
    },
    async signInWithGoogle(redirectPath = '/app') {
      if (!supabase) throw new Error('Supabase is not configured.')
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectPath}`,
        },
      })
      if (error) throw error
    },
    async signOut() {
      if (!supabase) return
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setApiUserIdentity(null, null)
    },
    async resendVerificationEmail(email) {
      if (!supabase) throw new Error('Supabase is not configured.')
      if (user && hasNonEmailProvider(user) && !hasEmailProvider(user)) {
        throw new Error('This account signs in with Google. Continue with Google instead of email verification.')
      }
      const targetEmail = (email || user?.email || '').trim()
      if (!targetEmail) throw new Error('No email address found for this account.')
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: targetEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })
      if (error) throw error
      return true
    },
    refreshAuthState,
  }), [emailVerified, loading, session, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider.')
  }
  return value
}
