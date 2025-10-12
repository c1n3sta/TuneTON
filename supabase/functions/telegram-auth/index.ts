import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Add at the top of the file
interface RateLimitEntry {
  count: number;
  timestamp: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  
  if (!entry) {
    // First request from this IP
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  // Reset count if more than 15 minutes have passed
  if (now - entry.timestamp > 15 * 60 * 1000) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  // Check if limit exceeded (10 requests per 15 minutes)
  if (entry.count >= 10) {
    return false;
  }
  
  // Increment count
  rateLimitStore.set(ip, { count: entry.count + 1, timestamp: entry.timestamp });
  return true;
}

// Verify Telegram WebApp data
async function verifyTelegramData(initData: string): Promise<boolean> {
  const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not configured');
    return false;
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    const authDate = params.get('auth_date');
    
    // Check if required parameters exist
    if (!hash || !authDate) {
      console.warn('Missing required parameters in Telegram initData');
      return false;
    }
    
    // Check if auth_date is recent (within 1 hour)
    const authTimestamp = parseInt(authDate);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp - authTimestamp > 3600) { // 1 hour
      console.warn('Telegram auth data is too old');
      return false;
    }
    
    // Remove hash from parameters and sort
    params.delete('hash');
    const sortedParams = Array.from(params.entries()).sort(([a], [b]) => a.localeCompare(b));
    
    // Create data string according to Telegram documentation
    const dataString = sortedParams.map(([key, value]) => `${key}=${value}`).join('\n');
    
    // Create secret key using HMAC-SHA256 with key "WebAppData" and bot token
    const encoder = new TextEncoder();
    const keyData = encoder.encode('WebAppData');
    const secretKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const secret = await crypto.subtle.sign('HMAC', secretKey, encoder.encode(BOT_TOKEN));
    
    // Create HMAC-SHA256 hash of data string using the secret
    const key = await crypto.subtle.importKey(
      'raw',
      secret,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(dataString));
    
    // Convert signature to hex string
    const hexSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Compare hashes
    const isValid = hexSignature === hash;
    if (!isValid) {
      console.warn('Telegram hash verification failed');
      console.warn('Expected:', hash);
      console.warn('Actual:', hexSignature);
      console.warn('Data string:', dataString);
    }
    
    return isValid;
  } catch (error) {
    console.error('Error verifying Telegram data:', error);
    return false;
  }
}

// Add new function to verify Telegram Login Widget data
async function verifyTelegramWidgetData(widgetData: any): Promise<boolean> {
  const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not configured');
    return false;
  }

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
      encoder.encode(BOT_TOKEN),
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

// Extract user data from initData
function parseInitData(initData: string): any {
  const params = new URLSearchParams(initData)
  const userParam = params.get('user')
  return userParam ? JSON.parse(decodeURIComponent(userParam)) : null
}

// Update the main handler to support both methods
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Get client IP for rate limiting
  const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
  
  // Check rate limit
  if (!checkRateLimit(clientIP)) {
    console.warn('Rate limit exceeded for IP:', clientIP);
    return new Response(
      JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.'
      }), 
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 429
      }
    );
  }

  // Log authentication attempt
  console.log('Telegram authentication attempt started', {
    ip: clientIP,
    timestamp: new Date().toISOString()
  });

  try {
    // Get data from request (either initData for WebApp or widgetData for Login Widget)
    const { initData, widgetData } = await req.json()
    
    let telegramUser;
    let authMethod;
    
    if (initData) {
      // Telegram WebApp authentication
      authMethod = 'webapp';
      
      // Verify Telegram WebApp data
      const isValid = await verifyTelegramData(initData)
      if (!isValid) {
        throw new Error('Invalid Telegram WebApp data')
      }

      // Parse user data
      telegramUser = parseInitData(initData)
      if (!telegramUser?.id) {
        throw new Error('Invalid user data from WebApp')
      }
    } else if (widgetData) {
      // Telegram Login Widget authentication
      authMethod = 'widget';
      
      // Verify Telegram Login Widget data
      const isValid = await verifyTelegramWidgetData(widgetData)
      if (!isValid) {
        throw new Error('Invalid Telegram widget data')
      }
      
      // Use widget data directly
      telegramUser = widgetData;
      if (!telegramUser?.id) {
        throw new Error('Invalid user data from widget')
      }
    } else {
      throw new Error('Missing authentication data')
    }

    // Log successful validation
    console.log('Telegram data validated successfully', {
      userId: telegramUser.id,
      method: authMethod,
      timestamp: new Date().toISOString()
    });

    // Initialize Supabase Admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Check if user already exists in auth
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', telegramUser.id)
      .single()

    let user, session
    
    if (existingUser) {
      // Update existing user metadata
      console.log('Updating existing user metadata', { userId: telegramUser.id })
      
      const { data: updatedUser, error: updateError } = await supabase
        .auth
        .admin
        .updateUserById(existingUser.id, {
          user_metadata: {
            telegram_id: telegramUser.id,
            username: telegramUser.username,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            photo_url: telegramUser.photo_url
          }
        })

      if (updateError) throw updateError
      
      // Get session for existing user
      const { data: sessionData, error: sessionError } = await supabase.auth.admin.grantCustomAccessToken(
        existingUser.id
      )
      
      if (sessionError) throw sessionError
      
      user = updatedUser
      session = sessionData
    } else {
      // Create new user
      console.log('Creating new user', { userId: telegramUser.id })
      
      const { data: newUser, error: signUpError } = await supabase.auth.admin.createUser({
        email: `${telegramUser.id}@telegram.tuneton.space`,
        password: `tg-${telegramUser.id}-${crypto.randomUUID()}`,
        user_metadata: {
          telegram_id: telegramUser.id,
          username: telegramUser.username,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          photo_url: telegramUser.photo_url
        }
      })

      if (signUpError) {
        throw signUpError
      }

      // Create a session for the new user
      const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: `${telegramUser.id}@telegram.tuneton.space`,
      })

      if (sessionError) throw sessionError

      user = newUser
      session = {
        access_token: sessionData.properties?.access_token,
        refresh_token: sessionData.properties?.refresh_token
      }
    }

    // Log successful authentication
    console.log('Telegram authentication completed successfully', {
      userId: user.id,
      method: authMethod,
      timestamp: new Date().toISOString()
    });

    // Return the session to the client
    return new Response(
      JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata
        }
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in telegram-auth:', error)
    
    // Log authentication failure
    console.error('Telegram authentication failed', {
      error: error.message,
      timestamp: new Date().toISOString()
    })
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }), 
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400
      }
    )
  }
})