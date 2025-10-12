import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || ''

// Verify Telegram WebApp data
async function verifyTelegramData(initData: string): Promise<boolean> {
  // In production, you should verify the Telegram WebApp data
  // For now, we'll skip verification for development
  return true
}

// Extract user data from initData
function parseInitData(initData: string): any {
  const params = new URLSearchParams(initData)
  const userParam = params.get('user')
  return userParam ? JSON.parse(decodeURIComponent(userParam)) : null
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get initData from request
    const { initData } = await req.json()
    if (!initData) {
      throw new Error('Missing initData')
    }

    // Verify Telegram WebApp data
    const isValid = await verifyTelegramData(initData)
    if (!isValid) {
      throw new Error('Invalid Telegram data')
    }

    // Parse user data
    const telegramUser = parseInitData(initData)
    if (!telegramUser?.id) {
      throw new Error('Invalid user data')
    }

    // Initialize Supabase Admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Generate a custom JWT for the user
    const { data: { user, session }, error } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: `${telegramUser.id}@telegram.tuneton.space`,
      password: `tg-${telegramUser.id}-${crypto.randomUUID()}`,
      options: {
        data: {
          telegram_id: telegramUser.id,
          username: telegramUser.username,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          photo_url: telegramUser.photo_url
        }
      }
    })

    if (error || !user || !session) {
      throw error || new Error('Failed to create user session')
    }

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
