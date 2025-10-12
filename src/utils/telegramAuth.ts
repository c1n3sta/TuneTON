import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export async function loginWithTelegram() {
  try {
    // @ts-ignore - Telegram WebApp types
    if (!window.Telegram?.WebApp) {
      throw new Error('Telegram WebApp not available')
    }

    // Get Telegram WebApp init data
    // @ts-ignore
    const initData = window.Telegram.WebApp.initData
    
    if (!initData) {
      throw new Error('Telegram WebApp initData not available')
    }

    // Call our Edge Function to authenticate
    const response = await fetch(`${import.meta.env.VITE_API_URL}/telegram-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData }),
    })

    const { access_token, refresh_token, user, error } = await response.json()

    if (error) throw error
    if (!access_token || !refresh_token) {
      throw new Error('No access or refresh token in the response')
    }

    // Set the session
    const { error: authError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    })

    if (authError) throw authError

    return { user, session: { access_token, refresh_token } }
  } catch (error) {
    console.error('Error logging in with Telegram:', error)
    throw error
  }
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error logging out:', error)
    throw error
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}
