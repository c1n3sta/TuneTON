import { createClient } from '@supabase/supabase-js'

// Declare Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        initData: string;
        initDataUnsafe: any;
      }
    };
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Implement proper Telegram data verification according to Telegram documentation
export async function verifyTelegramData(initData: string, botToken: string): Promise<boolean> {
  try {
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    const authDate = params.get('auth_date')
    
    // Check if required parameters exist
    if (!hash || !authDate) {
      console.warn('Missing required parameters in Telegram initData')
      return false
    }
    
    // Check if auth_date is recent (within 1 hour)
    const authTimestamp = parseInt(authDate)
    const currentTimestamp = Math.floor(Date.now() / 1000)
    if (currentTimestamp - authTimestamp > 3600) { // 1 hour
      console.warn('Telegram auth data is too old')
      return false
    }
    
    // Remove hash from parameters and sort
    params.delete('hash')
    const sortedParams = Array.from(params.entries()).sort(([a], [b]) => a.localeCompare(b))
    
    // Create data string according to Telegram documentation
    const dataString = sortedParams.map(([key, value]) => `${key}=${value}`).join('\n')
    
    // Create secret key using HMAC-SHA256 with key "WebAppData" and bot token
    const encoder = new TextEncoder()
    const keyData = encoder.encode('WebAppData')
    const secretKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const secret = await crypto.subtle.sign('HMAC', secretKey, encoder.encode(botToken))
    
    // Create HMAC-SHA256 hash of data string using the secret
    const key = await crypto.subtle.importKey(
      'raw',
      secret,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(dataString))
    
    // Convert signature to hex string
    const hexSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    // Compare hashes
    const isValid = hexSignature === hash
    if (!isValid) {
      console.warn('Telegram hash verification failed')
      console.warn('Expected:', hash)
      console.warn('Actual:', hexSignature)
      console.warn('Data string:', dataString)
    }
    
    return isValid
  } catch (error) {
    console.error('Error verifying Telegram data:', error)
    return false
  }
}

export async function loginWithTelegram() {
  try {
    // Check if Telegram WebApp is available
    if (!window.Telegram?.WebApp) {
      throw new Error('Telegram WebApp not available. Please open this app from Telegram.')
    }

    // Get Telegram WebApp init data
    const initData = window.Telegram.WebApp.initData
    
    if (!initData) {
      throw new Error('Telegram WebApp initData not available. Please restart the app.')
    }

    // Verify Telegram data first
    const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
    if (!BOT_TOKEN) {
      throw new Error('Telegram bot token not configured')
    }

    const isValid = await verifyTelegramData(initData, BOT_TOKEN)
    if (!isValid) {
      throw new Error('Invalid Telegram authentication data. Please try again.')
    }

    // Call our Edge Function to authenticate
    const response = await fetch(`${import.meta.env.VITE_API_URL}/telegram-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Authentication failed: ${response.status}`)
    }

    const { access_token, refresh_token, user, error } = await response.json()

    if (error) throw new Error(error)
    if (!access_token || !refresh_token) {
      throw new Error('Authentication failed: No access or refresh token in the response')
    }

    // Set the session
    const { error: authError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    })

    if (authError) throw new Error(`Session setup failed: ${authError.message}`)

    return { user, session: { access_token, refresh_token } }
  } catch (error) {
    console.error('Error logging in with Telegram:', error)
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('Telegram WebApp not available')) {
        throw new Error('Please open this app from Telegram to continue.')
      }
      if (error.message.includes('invalid hash')) {
        throw new Error('Authentication data is invalid. Please restart the app.')
      }
      throw error
    }
    
    throw new Error('An unexpected error occurred during authentication. Please try again.')
  }
}

// Add new function to verify Telegram Login Widget data
export async function verifyTelegramWidgetData(widgetData: any, botToken: string): Promise<boolean> {
  try {
    const { hash, ...data } = widgetData;
    
    // Check if required parameters exist
    if (!hash) {
      console.warn('Missing hash in Telegram widget data');
      return false;
    }
    
    // Check if auth_date is recent (within 1 hour)
    const authTimestamp = parseInt(data.auth_date);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp - authTimestamp > 3600) { // 1 hour
      console.warn('Telegram widget auth data is too old');
      return false;
    }
    
    // Create data string according to Telegram documentation
    // Sort keys alphabetically
    const keys = Object.keys(data).sort();
    const dataString = keys.map(key => `${key}=${data[key]}`).join('\n');
    
    // Create HMAC-SHA256 hash using bot token directly (no "WebAppData" key)
    const encoder = new TextEncoder();
    const secretKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(botToken),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', secretKey, encoder.encode(dataString));
    
    // Convert signature to hex string
    const hexSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Compare hashes
    const isValid = hexSignature === hash;
    if (!isValid) {
      console.warn('Telegram widget hash verification failed');
      console.warn('Expected:', hash);
      console.warn('Actual:', hexSignature);
      console.warn('Data string:', dataString);
    }
    
    return isValid;
  } catch (error) {
    console.error('Error verifying Telegram widget data:', error);
    return false;
  }
}

// Add new login function for widget
export async function loginWithTelegramWidget(widgetData: any) {
  try {
    const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) {
      throw new Error('Telegram bot token not configured');
    }

    const isValid = await verifyTelegramWidgetData(widgetData, BOT_TOKEN);
    if (!isValid) {
      throw new Error('Invalid Telegram widget authentication data. Please try again.');
    }

    // Call our Edge Function to authenticate
    const response = await fetch(`${import.meta.env.VITE_API_URL}/telegram-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ widgetData }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Authentication failed: ${response.status}`)
    }

    const { access_token, refresh_token, user, error } = await response.json()

    if (error) throw new Error(error)
    if (!access_token || !refresh_token) {
      throw new Error('Authentication failed: No access or refresh token in the response')
    }

    // Set the session
    const { error: authError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    })

    if (authError) throw new Error(`Session setup failed: ${authError.message}`)

    return { user, session: { access_token, refresh_token } }
  } catch (error) {
    console.error('Error logging in with Telegram widget:', error)
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