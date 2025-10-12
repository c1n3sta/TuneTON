import { useState, useEffect } from 'react'
import { loginWithTelegram, logout as logoutUser, getCurrentUser, supabase } from '../utils/telegramAuth'
import type { User } from '@supabase/supabase-js'

// Type guard for Telegram WebApp
const isTelegramWebAppAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
         window.Telegram !== undefined && 
         window.Telegram.WebApp !== undefined;
};

export function useTelegramAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    let isMounted = true;
    
    const checkUser = async () => {
      try {
        if (!isMounted) return;
        
        setLoading(true)
        const currentUser = await getCurrentUser()
        if (!isMounted) return;
        
        if (currentUser) {
          setUser(currentUser)
          setIsAuthenticated(true)
          console.log('User authenticated on load:', currentUser)
        } else {
          console.log('No authenticated user found on load')
          // Check if we're in a Telegram WebApp but not authenticated
          if (isTelegramWebAppAvailable()) {
            console.log('In Telegram WebApp but not authenticated')
            // Try to authenticate automatically
            try {
              const result = await loginWithTelegram()
              if (result && result.user && isMounted) {
                setUser(result.user)
                setIsAuthenticated(true)
                console.log('Auto-login successful:', result.user)
              }
            } catch (err) {
              console.log('Auto-login failed:', err)
            }
          }
        }
      } catch (err: any) {
        if (!isMounted) return;
        setError(err.message)
        console.error('Error checking user:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    checkUser()
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, _session) => {
        console.log('Auth state changed:', event)
        if (!isMounted) return;
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const currentUser = await getCurrentUser()
          if (!isMounted) return;
          setUser(currentUser)
          setIsAuthenticated(true)
        } else if (event === 'SIGNED_OUT') {
          if (!isMounted) return;
          setUser(null)
          setIsAuthenticated(false)
        }
        if (!isMounted) return;
        setLoading(false)
      }
    )

    return () => {
      isMounted = false;
      subscription?.unsubscribe()
    }
  }, [])

  const login = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Attempting Telegram login...')
      
      // Check if we're in Telegram WebApp
      if (!isTelegramWebAppAvailable()) {
        throw new Error('This app must be opened from Telegram')
      }
      
      const result = await loginWithTelegram()
      if (result && result.user) {
        setUser(result.user)
        setIsAuthenticated(true)
        console.log('Telegram login successful:', result.user)
      }
      return result
    } catch (err: any) {
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
      console.log('Attempting logout...')
      await logoutUser()
      setUser(null)
      setIsAuthenticated(false)
      console.log('Logout successful')
    } catch (err: any) {
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
    isAuthenticated,
  }
}