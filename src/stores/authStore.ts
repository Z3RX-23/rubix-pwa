import { create } from 'zustand'
import { supabase } from '../services/supabase'

interface AuthState {
  user: { id: string; email: string } | null
  session: unknown
  loading: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
  loadSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  loadSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      set({ user: { id: session.user.id, email: session.user.email || '' }, session, loading: false })
    } else {
      set({ user: null, session: null, loading: false })
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return error.message
    set({ user: { id: data.user.id, email: data.user.email || '' }, session: data.session })
    return null
  },

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return error.message
    set({ user: data.user ? { id: data.user.id, email: data.user.email || '' } : null })
    return null
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null })
  }
}))
