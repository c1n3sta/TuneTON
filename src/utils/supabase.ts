import { createClient } from '@supabase/supabase-js'
import { Telegram } from '@twa-dev/types'

declare global {
  interface Window {
    Telegram: Telegram
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable for Telegram Web App
  },
})

// Function to handle Telegram authentication
export async function signInWithTelegram() {
  try {
    const tg = window.Telegram?.WebApp
    if (!tg) {
      throw new Error('Telegram Web App not available')
    }

    // Get Telegram user data
    const userData = tg.initDataUnsafe?.user || {}
    const initData = tg.initData
    
    // Sign in with Telegram
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'telegram',
      token: initData,
      access_token: tg.initDataUnsafe?.query_id,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error signing in with Telegram:', error)
    throw error
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}
