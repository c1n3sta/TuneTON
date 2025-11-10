import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Handle CORS preflight
function handleOptions(): Response {
  return new Response('ok', { headers: corsHeaders });
}

// Increment playback count
async function incrementPlayback(supabase: any, trackId: string): Promise<Response> {
  try {
    // First, get the current playback count
    const { data: existingPlayback, error: fetchError } = await supabase
      .from('playbacks')
      .select('count')
      .eq('track_id', trackId)
      .single();
    
    let newCount = 1;
    if (existingPlayback) {
      newCount = existingPlayback.count + 1;
      // Update existing playback count
      const { error: updateError } = await supabase
        .from('playbacks')
        .update({ count: newCount })
        .eq('track_id', trackId);
      
      if (updateError) throw updateError;
    } else {
      // Create new playback record
      const { error: insertError } = await supabase
        .from('playbacks')
        .insert({ track_id: trackId, count: newCount });
      
      if (insertError) throw insertError;
    }
    
    // Also update the track's play_count
    const { data: trackData, error: trackError } = await supabase
      .from('tracks')
      .select('play_count')
      .eq('id', trackId)
      .single();
    
    if (!trackError && trackData) {
      const updatedPlayCount = trackData.play_count + 1;
      await supabase
        .from('tracks')
        .update({ play_count: updatedPlayCount })
        .eq('id', trackId);
    }
    
    // Get total playbacks
    const { data: allPlaybacks, error: allError } = await supabase
      .from('playbacks')
      .select('count');
    
    let totalPlaybacks = 0;
    if (!allError && allPlaybacks) {
      totalPlaybacks = allPlaybacks.reduce((sum: number, item: any) => sum + item.count, 0);
    }
    
    return new Response(
      JSON.stringify({ 
        trackId, 
        playCount: newCount,
        totalPlaybacks
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error incrementing playback:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update playback count' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleOptions();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      }
    );
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    // Only include Authorization header if it exists
    const authHeader = req.headers.get('Authorization');
    const clientOptions: any = {
      global: {}
    };
    
    if (authHeader) {
      clientOptions.global.headers = { 
        Authorization: authHeader
      };
    }

    const supabase = createClient(supabaseUrl, supabaseKey, clientOptions);

    // Extract trackId from URL
    const url = new URL(req.url);
    const trackId = url.pathname.split('/').pop();
    
    if (!trackId) {
      return new Response(
        JSON.stringify({ error: 'Missing track ID' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    return await incrementPlayback(supabase, trackId);
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});