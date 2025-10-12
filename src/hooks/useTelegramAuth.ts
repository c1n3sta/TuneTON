import { useState, useEffect } from 'react'
import { loginWithTelegram, logout as logoutUser, getCurrentUser, supabase } from '../utils/telegramAuth'

export function useTelegramAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for existing session on mount
  useEffect(() => {
    checkUser()
    
    // Set up auth state change listener
    const { data: { subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const currentUser = await getCurrentUser()
          setUser(currentUser)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    try {
      setLoading(true)
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error checking user:', err)
    } finally {
      setLoading(false)
    }
  }

  const login = async () => {
    try {
      setLoading(true)
      setError(null)
      const { user } = await loginWithTelegram()
      setUser(user)
      return user
    } catch (err) {
      setError(err.message)
      console.error('Login error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await logoutUser()
      setUser(null)
    } catch (err) {
      setError(err.message)
      console.error('Logout error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  }
}
