import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

// Verify Telegram WebApp data
async function verifyTelegramData(initData: string): Promise<boolean> {
  const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
  console.log('DEBUG: BOT_TOKEN present:', !!BOT_TOKEN);
  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not configured');
    return false;
  }

  try {
    console.log('DEBUG: Received initData:', initData);
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    const authDate = params.get('auth_date');
    
    console.log('DEBUG: Hash:', hash);
    console.log('DEBUG: AuthDate:', authDate);
    
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
    
    console.log('DEBUG: Sorted params:', sortedParams);
    
    // Create data string according to Telegram documentation
    const dataString = sortedParams.map(([key, value]) => `${key}=${value}`).join('\n');
    
    console.log('DEBUG: Data string:', dataString);
    
    // Create secret key using HMAC-SHA256 with "WebAppData" as key and bot token as message
    const encoder = new TextEncoder();
    const webAppDataKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode('WebAppData'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const secret = await crypto.subtle.sign('HMAC', webAppDataKey, encoder.encode(BOT_TOKEN));
    
    // Create HMAC-SHA256 hash of data string using the secret
    // Convert the secret ArrayBuffer to a CryptoKey
    const secretKey = await crypto.subtle.importKey(
      'raw',
      secret,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', secretKey, encoder.encode(dataString));
    
    // Convert signature to hex string
    const hexSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    console.log('DEBUG: Calculated hash:', hexSignature);
    console.log('DEBUG: Expected hash:', hash);
    console.log('DEBUG: Hashes match:', hexSignature === hash);
    
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

// Extract user data from initData
function parseInitData(initData: string): any {
  const params = new URLSearchParams(initData)
  const userParam = params.get('user')
  if (!userParam) return null
  
  try {
    // The user parameter is a URL-encoded JSON string
    // We need to decode it and then parse as JSON
    return JSON.parse(decodeURIComponent(userParam))
  } catch (error) {
    console.error('Error parsing user data:', error)
    return null
  }
}

// Create or update user in database
async function syncUserWithDatabase(supabase: any, telegramUser: any) {
  try {
    console.log('DEBUG: Syncing user with database:', telegramUser);
    
    const { data, error } = await supabase
      .from('users')
      .upsert({
        telegram_id: telegramUser.id,
        username: telegramUser.username,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        photo_url: telegramUser.photo_url,
        is_premium: telegramUser.is_premium || false,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'telegram_id'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error syncing user with database:', error);
      return null;
    }
    
    console.log('DEBUG: User synced successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in syncUserWithDatabase:', error);
    return null;
  }
}

// Check and update rate limits
async function checkRateLimit(supabase: any, ipAddress: string): Promise<boolean> {
  try {
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
    
    // Try to update existing record or insert new one
    const { data, error } = await supabase
      .from('rate_limit')
      .upsert({
        ip_address: ipAddress,
        request_count: 1,
        last_request: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'ip_address'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error upserting rate limit record:', error);
      // If we can't track rate limiting, allow the request to proceed
      return true;
    }
    
    // Check if this is a new record (first request) or an existing one
    if (data.last_request > oneMinuteAgo) {
      // Recent request, check count
      if (data.request_count >= 5) { // Limit to 5 requests per minute
        console.warn('Rate limit exceeded for IP:', ipAddress);
        return false;
      }
      
      // Increment count for existing record
      const { error: updateError } = await supabase
        .from('rate_limit')
        .update({
          request_count: data.request_count + 1,
          last_request: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('ip_address', ipAddress);
      
      if (updateError) {
        console.error('Error updating rate limit count:', updateError);
        // If we can't update, allow the request to proceed
        return true;
      }
    } else {
      // Old record, reset count
      const { error: updateError } = await supabase
        .from('rate_limit')
        .update({
          request_count: 1,
          last_request: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('ip_address', ipAddress);
      
      if (updateError) {
        console.error('Error resetting rate limit count:', updateError);
        // If we can't update, allow the request to proceed
        return true;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in checkRateLimit:', error);
    // If we can't check rate limiting, allow the request to proceed
    return true;
  }
}

// Update the main handler to support both methods
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    console.log('DEBUG: Client IP:', clientIP);
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    console.log('DEBUG: Supabase URL:', supabaseUrl ? 'PRESENT' : 'MISSING');
    console.log('DEBUG: Service Key:', supabaseServiceKey ? 'PRESENT' : 'MISSING');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check rate limit
    const rateLimitOk = await checkRateLimit(supabase, clientIP);
    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.'
        }), 
        { 
          headers: corsHeaders,
          status: 429
        }
      );
    }
    
    // Get data from request (either initData for WebApp or widgetData for Login Widget)
    const { initData, widgetData } = await req.json()
    
    // Debug: Check if BOT_TOKEN is available
    const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    console.log('DEBUG: BOT_TOKEN from main handler:', BOT_TOKEN ? 'PRESENT' : 'MISSING');
    
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
      throw new Error('Telegram Login Widget not implemented yet')
    } else {
      throw new Error('Missing authentication data')
    }
    
    // Sync user with database
    const dbUser = await syncUserWithDatabase(supabase, telegramUser);
    if (!dbUser) {
      console.warn('Failed to sync user with database');
    }
    
    // Create a fake email for the user based on their Telegram ID
    const fakeEmail = `telegram_${telegramUser.id}@tuneton.app`;
    const userPassword = crypto.randomUUID(); // Generate a random password
    
    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase.auth.admin.getUserByEmail(fakeEmail);
    
    let authData;
    if (fetchError || !existingUser) {
      // Create user if they don't exist
      const { data, error: createError } = await supabase.auth.admin.createUser({
        email: fakeEmail,
        password: userPassword,
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          telegram_id: telegramUser.id,
          username: telegramUser.username,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          photo_url: telegramUser.photo_url,
          is_premium: telegramUser.is_premium,
          auth_method: authMethod
        }
      });
      
      if (createError) {
        console.error('Error creating user in auth:', createError);
        throw new Error('Failed to create user authentication');
      }
      
      authData = data;
    } else {
      // User exists, update their metadata
      const { data, error: updateError } = await supabase.auth.admin.updateUserById(existingUser.user.id, {
        user_metadata: {
          telegram_id: telegramUser.id,
          username: telegramUser.username,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          photo_url: telegramUser.photo_url,
          is_premium: telegramUser.is_premium,
          auth_method: authMethod
        }
      });
      
      if (updateError) {
        console.error('Error updating user in auth:', updateError);
        throw new Error('Failed to update user authentication');
      }
      
      authData = data;
      
      // Update password
      await supabase.auth.admin.updateUserById(existingUser.user.id, {
        password: userPassword
      });
    }
    
    console.log('DEBUG: Auth user handled:', authData.user);
    
    // Sign in the user to create a session and get tokens
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password: userPassword
    });
    
    if (sessionError) {
      console.error('Error signing in user:', sessionError);
      throw new Error('Failed to sign in user');
    }
    
    console.log('DEBUG: Session created:', sessionData);
    
    // Return success response with tokens
    return new Response(
      JSON.stringify({
        message: 'Authentication successful',
        user: telegramUser,
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token
      }),
      {
        headers: corsHeaders,
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in telegram-auth:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }), 
      { 
        headers: corsHeaders,
        status: 400
      }
    )
  }
})