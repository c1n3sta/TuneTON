// make-server-82f19583/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Content-Type': 'application/json'
};

// Helper function to handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}

// Main handler function
async function handler(req: Request) {
  try {
    // Handle CORS
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Get the URL and method
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    console.log(`Request: ${method} ${path}`);

    // Route handling
    if (path === '/health') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    let user = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user) {
        user = data.user;
      }
    }

    // Handle different endpoints
    if (path.startsWith('/playlists')) {
      return handlePlaylists(req, user);
    } else if (path.startsWith('/liked-tracks')) {
      return handleLikedTracks(req, user);
    } else if (path.startsWith('/library/stats')) {
      return handleLibraryStats(req, user);
    } else if (path.startsWith('/tracks/')) {
      return handleTracks(req, user);
    } else if (path.startsWith('/comments')) {
      return handleComments(req, user);
    } else if (path.startsWith('/achievements')) {
      return handleAchievements(req, user);
    } else if (path.startsWith('/subscriptions')) {
      return handleSubscriptions(req, user);
    } else if (path.startsWith('/user/balance')) {
      return handleUserBalance(req, user);
    } else if (path.startsWith('/user/level')) {
      return handleUserLevel(req, user);
    }

    // Default response for unknown endpoints
    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404
    });
  } catch (error) {
    console.error('Error in make-server function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

// Handle playlists endpoints
async function handlePlaylists(req: Request, user: any) {
  try {
    const url = new URL(req.url);
    const method = req.method;
    const pathParts = url.pathname.split('/').filter(Boolean);

    if (method === 'GET') {
      // Get all user playlists
      if (pathParts.length === 1) {
        if (!user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401
          });
        }

        const { data: playlists, error } = await supabase
          .from('playlists')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        return new Response(JSON.stringify({ playlists }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      }
      // Get specific playlist
      else if (pathParts.length === 2) {
        const playlistId = pathParts[1];
        
        const { data: playlist, error } = await supabase
          .from('playlists')
          .select('*')
          .eq('id', playlistId)
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ playlist }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      }
    } else if (method === 'POST') {
      // Create new playlist
      if (pathParts.length === 1) {
        if (!user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401
          });
        }

        const body = await req.json();
        
        const { data: playlist, error } = await supabase
          .from('playlists')
          .insert({
            user_id: user.id,
            name: body.name,
            description: body.description,
            is_private: body.isPrivate || false,
            cover: body.cover
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ playlist }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405
    });
  } catch (error) {
    console.error('Error in handlePlaylists:', error);
    return new Response(JSON.stringify({ error: 'Failed to handle playlists', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

// Handle liked tracks endpoints
async function handleLikedTracks(req: Request, user: any) {
  try {
    const method = req.method;

    if (method === 'GET') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        });
      }

      const { data: likedTracks, error } = await supabase
        .from('liked_tracks')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      return new Response(JSON.stringify({ likedTracks }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405
    });
  } catch (error) {
    console.error('Error in handleLikedTracks:', error);
    return new Response(JSON.stringify({ error: 'Failed to handle liked tracks', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

// Handle library stats endpoints
async function handleLibraryStats(req: Request, user: any) {
  try {
    const method = req.method;

    if (method === 'GET') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        });
      }

      // Get playlist count
      const { count: playlistCount, error: playlistError } = await supabase
        .from('playlists')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (playlistError) throw playlistError;

      // Get liked tracks count
      const { count: likedTracksCount, error: likedTracksError } = await supabase
        .from('liked_tracks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (likedTracksError) throw likedTracksError;

      // Calculate total tracks (this would need to be more complex in reality)
      const totalTracks = (playlistCount || 0) * 10 + (likedTracksCount || 0);

      const stats = {
        playlistCount: playlistCount || 0,
        likedTracksCount: likedTracksCount || 0,
        totalTracks
      };

      return new Response(JSON.stringify(stats), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405
    });
  } catch (error) {
    console.error('Error in handleLibraryStats:', error);
    return new Response(JSON.stringify({ error: 'Failed to get library stats', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

// Handle tracks endpoints
async function handleTracks(req: Request, user: any) {
  try {
    const url = new URL(req.url);
    const method = req.method;
    const pathParts = url.pathname.split('/').filter(Boolean);

    if (method === 'POST' && pathParts.length === 3 && pathParts[2] === 'like') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        });
      }

      const trackId = pathParts[1];
      const body = await req.json();
      const { jamendoTrack, isLiked } = body;

      if (isLiked) {
        // Add to liked tracks
        const { data, error } = await supabase
          .from('liked_tracks')
          .upsert({
            user_id: user.id,
            track_id: trackId,
            track_data: jamendoTrack
          }, {
            onConflict: 'user_id,track_id'
          });

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, isLiked: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      } else {
        // Remove from liked tracks
        const { error } = await supabase
          .from('liked_tracks')
          .delete()
          .eq('user_id', user.id)
          .eq('track_id', trackId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, isLiked: false }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405
    });
  } catch (error) {
    console.error('Error in handleTracks:', error);
    return new Response(JSON.stringify({ error: 'Failed to handle tracks', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

// Handle comments endpoints
async function handleComments(req: Request, user: any) {
  try {
    const url = new URL(req.url);
    const method = req.method;
    const pathParts = url.pathname.split('/').filter(Boolean);

    if (method === 'POST') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        });
      }

      const body = await req.json();
      
      const { data: comment, error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          entity_type: body.entity_type,
          entity_id: body.entity_id,
          content: body.content,
          parent_comment_id: body.parent_comment_id
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ comment }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201
      });
    } else if (method === 'GET' && pathParts.length === 3) {
      const entityType = pathParts[1];
      const entityId = pathParts[2];
      
      const { data: comments, error } = await supabase
        .from('comments')
        .select(`
          *,
          users(first_name, username, photo_url)
        `)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return new Response(JSON.stringify({ comments }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405
    });
  } catch (error) {
    console.error('Error in handleComments:', error);
    return new Response(JSON.stringify({ error: 'Failed to handle comments', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

// Handle achievements endpoints
async function handleAchievements(req: Request, user: any) {
  try {
    const method = req.method;

    if (method === 'GET') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        });
      }

      const { data: achievements, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ achievements }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405
    });
  } catch (error) {
    console.error('Error in handleAchievements:', error);
    return new Response(JSON.stringify({ error: 'Failed to handle achievements', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

// Handle subscriptions endpoints
async function handleSubscriptions(req: Request, user: any) {
  try {
    const method = req.method;
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);

    if (method === 'POST') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        });
      }

      const body = await req.json();
      
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          target_user_id: body.target_user_id
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ subscription }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201
      });
    } else if (method === 'DELETE') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        });
      }

      const targetUserId = pathParts[1];
      
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id)
        .eq('target_user_id', targetUserId);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    } else if (method === 'GET') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        });
      }

      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      return new Response(JSON.stringify({ subscriptions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405
    });
  } catch (error) {
    console.error('Error in handleSubscriptions:', error);
    return new Response(JSON.stringify({ error: 'Failed to handle subscriptions', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

// Handle user balance endpoints
async function handleUserBalance(req: Request, user: any) {
  try {
    const method = req.method;

    if (method === 'GET') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        });
      }

      const { data: balance, error } = await supabase
        .from('user_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ balance }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    } else if (method === 'POST') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        });
      }

      const body = await req.json();
      const { stars, toncoin, ethereum } = body;

      const { data: balance, error } = await supabase
        .from('user_balances')
        .upsert({
          user_id: user.id,
          stars: stars || 0,
          toncoin: toncoin || 0,
          ethereum: ethereum || 0
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ balance }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405
    });
  } catch (error) {
    console.error('Error in handleUserBalance:', error);
    return new Response(JSON.stringify({ error: 'Failed to handle user balance', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

// Handle user level endpoints
async function handleUserLevel(req: Request, user: any) {
  try {
    const method = req.method;

    if (method === 'GET') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        });
      }

      const { data: level, error } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ level }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    } else if (method === 'POST') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        });
      }

      const body = await req.json();
      const { experience_points } = body;

      // Calculate level based on experience points
      const level = Math.floor(Math.sqrt(experience_points / 100)) + 1;

      const { data: userLevel, error } = await supabase
        .from('user_levels')
        .upsert({
          user_id: user.id,
          level: level,
          experience_points: experience_points
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ level: userLevel }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405
    });
  } catch (error) {
    console.error('Error in handleUserLevel:', error);
    return new Response(JSON.stringify({ error: 'Failed to handle user level', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

// Serve the function
serve(handler);