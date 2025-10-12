import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for the entire application
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type guard for Telegram WebApp
const isTelegramWebApp = (): boolean => {
  return typeof window !== 'undefined' && 
         (window as any).Telegram && 
         (window as any).Telegram.WebApp;
};

// Function to get Telegram user data
export const getTelegramUser = () => {
  if (isTelegramWebApp()) {
    const tg = (window as any).Telegram.WebApp
    return tg.initDataUnsafe?.user || null
  }
  return null
}

// Function to initialize Telegram WebApp
export const initTelegramWebApp = () => {
  if (isTelegramWebApp()) {
    try {
      const tg = (window as any).Telegram.WebApp
      tg.ready()
      tg.expand()
      return tg
    } catch (error) {
      console.error('Error initializing Telegram WebApp:', error)
      return null
    }
  }
  return null
}