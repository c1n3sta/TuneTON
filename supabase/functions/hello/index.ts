import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      } 
    })
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { 
          Authorization: req.headers.get('Authorization') || '' 
        },
      },
    })

    // Try to get user, but don't require authentication
    let userInfo = null
    try {
      const { data: { user }, error } = await supabaseClient.auth.getUser()
      if (user && !error) {
        userInfo = {
          id: user.id,
          email: user.email,
          telegram: user.user_metadata?.telegram
        }
      }
    } catch (error) {
      console.log('User not authenticated:', error.message)
    }

    // Return response
    return new Response(
      JSON.stringify({ 
        message: 'Hello from TuneTON Edge Function!',
        timestamp: new Date().toISOString(),
        user: userInfo,
        authenticated: !!userInfo
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }), 
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    )
  }
})
