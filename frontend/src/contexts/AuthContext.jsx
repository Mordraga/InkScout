import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, supabaseConfigured } from '../supabase.js'
import { setApiUserIdentity } from '../userIdentity.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const user = session?.user ?? null

  useEffect(() => {
    let mounted = true
    if (!supabaseConfigured || !supabase) {
      setLoading(false)
      return () => {}
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      const nextSession = data?.session ?? null
      setSession(nextSession)
      setApiUserIdentity(nextSession?.user?.id ?? null, nextSession?.access_token ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setApiUserIdentity(nextSession?.user?.id ?? null, nextSession?.access_token ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({
    supabaseConfigured,
    session,
    user,
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
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
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
  }), [loading, session, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider.')
  }
  return value
}
