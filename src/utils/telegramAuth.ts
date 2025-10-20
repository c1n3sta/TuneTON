import { createClient } from '@supabase/supabase-js';
import apiClient from '../api/client';

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

// Fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Only create Supabase client if we have the required values
let supabaseInstance: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co' && supabaseAnonKey !== 'your-anon-key') {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
} else {
  console.warn('Supabase configuration not found. Authentication features will be disabled.');
  supabaseInstance = null;
}

export const supabase = supabaseInstance;

// Add logging function
function logEvent(event: string, details: any = {}) {
  console.log(`[TelegramAuth] ${event}:`, details);
}

// Implement proper Telegram data verification according to Telegram documentation
export async function verifyTelegramData(initData: string, botToken: string): Promise<boolean> {
  logEvent('verify_telegram_data_start');
  
  // If we don't have a Supabase instance, we can't verify Telegram data
  if (!supabase) {
    logEvent('supabase_not_configured', { warning: 'Skipping Telegram verification.' });
    return true; // Allow access in development
  }
  
  try {
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    const authDate = params.get('auth_date')
    
    // Check if required parameters exist
    if (!hash || !authDate) {
      logEvent('missing_required_parameters', { hash: !!hash, authDate: !!authDate });
      return false
    }
    
    // Check if auth_date is recent (within 1 hour)
    const authTimestamp = parseInt(authDate)
    const currentTimestamp = Math.floor(Date.now() / 1000)
    if (currentTimestamp - authTimestamp > 3600) { // 1 hour
      logEvent('auth_data_too_old', { authTimestamp, currentTimestamp });
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
      logEvent('hash_verification_failed', { 
        expected: hash, 
        actual: hexSignature, 
        dataString: dataString.substring(0, 100) + (dataString.length > 100 ? '...' : '') 
      });
    } else {
      logEvent('hash_verification_success');
    }
    
    return isValid
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logEvent('verify_telegram_data_error', { error: errorMessage });
    return false
  }
}

export async function loginWithTelegram() {
  logEvent('login_with_telegram_start');
  
  // If we don't have a Supabase instance, we can't login
  if (!supabase) {
    logEvent('supabase_not_configured', { error: 'Login functionality disabled.' });
    throw new Error('Authentication is not available in this environment.');
  }
  
  try {
    // Check if Telegram WebApp is available
    if (!window.Telegram?.WebApp) {
      logEvent('telegram_webapp_not_available');
      throw new Error('Telegram WebApp not available. Please open this app from Telegram.')
    }

    // Get Telegram WebApp init data
    const initData = window.Telegram.WebApp.initData
    
    if (!initData) {
      logEvent('init_data_not_available');
      throw new Error('Telegram WebApp initData not available. Please restart the app.')
    }

    // Verify Telegram data first
    const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
    if (!BOT_TOKEN) {
      logEvent('bot_token_not_configured');
      throw new Error('Telegram bot token not configured')
    }

    const isValid = await verifyTelegramData(initData, BOT_TOKEN)
    if (!isValid) {
      logEvent('telegram_data_invalid');
      throw new Error('Invalid Telegram authentication data. Please try again.')
    }

    // Call our API client method to authenticate
    logEvent('calling_api_client_telegram_auth');
    const response = await apiClient.telegramAuth(initData)

    const { access_token, refresh_token, user, error } = response

    if (error) {
      logEvent('api_response_error', { error });
      throw new Error(error)
    }
    
    if (!access_token || !refresh_token) {
      logEvent('missing_tokens_in_response');
      throw new Error('Authentication failed: No access or refresh token in the response')
    }

    // Set the session
    logEvent('setting_session');
    const { error: authError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    })

    if (authError) {
      logEvent('session_setup_failed', { error: authError.message });
      throw new Error(`Session setup failed: ${authError.message}`)
    }

    logEvent('login_success', { userId: user?.id });
    return { user, session: { access_token, refresh_token } }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logEvent('login_error', { error: errorMessage });
    
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

    // Call our API client method to authenticate
    const response = await apiClient.telegramAuth(JSON.stringify(widgetData))

    const { access_token, refresh_token, user, error } = response

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
  logEvent('logout_start');
  
  // If we don't have a Supabase instance, we can't logout
  if (!supabase) {
    logEvent('supabase_not_configured', { warning: 'Logout functionality disabled.' });
    return true; // Return success for development
  }
  
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      logEvent('logout_error', { error: error.message });
      throw error
    }
    
    logEvent('logout_success');
    return true
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logEvent('logout_exception', { error: errorMessage });
    throw error
  }
}

export async function getCurrentUser() {
  logEvent('get_current_user_start');
  
  // If we don't have a Supabase instance, return null
  if (!supabase) {
    logEvent('supabase_not_configured', { warning: 'Cannot get current user.' });
    return null;
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      logEvent('get_current_user_error', { error: error.message });
      throw error
    }
    
    logEvent('get_current_user_success', { userId: user?.id });
    return user
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logEvent('get_current_user_exception', { error: errorMessage });
    return null
  }
}