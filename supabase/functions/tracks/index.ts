import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

// In-memory cache with pre-allocation
let tracksCache: any[] = [];
let playbacksCache: Record<string, number> = {};
let lastCacheUpdate = 0;
const CACHE_TTL = 30000; // 30 seconds

// Pre-allocate array for better performance
const MAX_TRACKS = 100;
for (let i = 0; i < MAX_TRACKS; i++) {
  tracksCache.push({
    id: '',
    title: '',
    artist: '',
    duration: 0,
    playCount: 0,
    audioUrl: ''
  });
}
tracksCache = []; // Clear but keep pre-allocated memory

// Function to scan audio directory and generate tracks
function scanAudioDirectory(): any[] {
  // In a serverless function, we can't scan the file system directly
  // We'll need to store track data in the database instead
  // For now, we'll return an empty array and fetch from database
  return [];
}

// Helper functions for database operations
async function readTracksFromDB(supabase: any): Promise<any[]> {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .order('id');
    
  if (error) {
    console.error('Error reading tracks from DB:', error);
    return [];
  }
  
  return data || [];
}

async function readPlaybacksFromDB(supabase: any): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('playbacks')
    .select('*');
    
  if (error) {
    console.error('Error reading playbacks from DB:', error);
    return {};
  }
  
  const playbacks: Record<string, number> = {};
  if (data) {
    data.forEach((item: any) => {
      playbacks[item.track_id] = item.count;
    });
  }
  
  return playbacks;
}

// Handle CORS preflight
function handleOptions(): Response {
  return new Response('ok', { headers: corsHeaders });
}

// Get tracks endpoint
async function getTracks(supabase: any): Promise<Response> {
  try {
    // Fetch tracks and playbacks from database
    const tracks = await readTracksFromDB(supabase);
    const playbacks = await readPlaybacksFromDB(supabase);
    
    // Update playCount in tracks
    const tracksWithPlayCount = tracks.map((track: any) => ({
      ...track,
      playCount: playbacks[track.id] || 0
    }));
    
    const responseHeaders = {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=30, s-maxage=60',
      'ETag': `"${Date.now()}"`,
      'X-Cache': 'MISS' // In serverless, caching is handled by CDN
    };
    
    return new Response(
      JSON.stringify(tracksWithPlayCount),
      { 
        headers: responseHeaders,
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in getTracks:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
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
  
  // Only allow GET requests
  if (req.method !== 'GET') {
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
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { 
          Authorization: req.headers.get('Authorization') || '' 
        },
      },
    });

    // Route based on the request
    const url = new URL(req.url);
    if (url.pathname.endsWith('/tracks')) {
      return await getTracks(supabase);
    } else {
      return new Response(
        JSON.stringify({ error: 'Endpoint not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      );
    }
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