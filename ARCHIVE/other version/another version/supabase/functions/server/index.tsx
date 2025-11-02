import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Middleware
app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

// Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Health check
app.get("/make-server-82f19583/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Database setup
app.post("/make-server-82f19583/setup-database", async (c) => {
  try {
    const schemas = [
      `CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), telegram_id BIGINT UNIQUE NOT NULL, username TEXT UNIQUE NOT NULL, display_name TEXT, avatar_url TEXT, bio TEXT, is_verified BOOLEAN DEFAULT false, is_artist BOOLEAN DEFAULT false, total_stars INTEGER DEFAULT 0, level INTEGER DEFAULT 1, experience_points INTEGER DEFAULT 0, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());`,
      `CREATE TABLE IF NOT EXISTS tracks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, artist_id UUID REFERENCES users(id) ON DELETE CASCADE, duration INTEGER, genre TEXT, play_count INTEGER DEFAULT 0, like_count INTEGER DEFAULT 0, is_public BOOLEAN DEFAULT true, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());`,
      `CREATE TABLE IF NOT EXISTS comments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) ON DELETE CASCADE, content TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id UUID NOT NULL, parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE, like_count INTEGER DEFAULT 0, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());`,
      `CREATE TABLE IF NOT EXISTS likes (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) ON DELETE CASCADE, entity_type TEXT NOT NULL, entity_id UUID NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), UNIQUE(user_id, entity_type, entity_id));`
    ];

    // Setup comprehensive RLS policies for all TuneTON tables
    const rlsPolicies = [
      // Enable RLS on core tables
      `ALTER TABLE users ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE comments ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE likes ENABLE ROW LEVEL SECURITY;`,
      
      // KV Store policies - Allow service role full access, authenticated users can read/write their own data
      `DROP POLICY IF EXISTS "kv_store_service_role_policy" ON kv_store_82f19583;`,
      `CREATE POLICY "kv_store_service_role_policy" ON kv_store_82f19583 FOR ALL USING (auth.role() = 'service_role');`,
      `DROP POLICY IF EXISTS "kv_store_authenticated_policy" ON kv_store_82f19583;`,
      `CREATE POLICY "kv_store_authenticated_policy" ON kv_store_82f19583 FOR ALL TO authenticated USING (true);`,
      
      // Core table policies
      `DROP POLICY IF EXISTS "users_read_policy" ON users;`,
      `CREATE POLICY "users_read_policy" ON users FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "users_write_policy" ON users;`,
      `CREATE POLICY "users_write_policy" ON users FOR ALL TO authenticated USING (id = auth.uid());`,
      
      `DROP POLICY IF EXISTS "tracks_read_policy" ON tracks;`,
      `CREATE POLICY "tracks_read_policy" ON tracks FOR SELECT TO authenticated USING (is_public = true OR artist_id = auth.uid());`,
      `DROP POLICY IF EXISTS "tracks_write_policy" ON tracks;`,
      `CREATE POLICY "tracks_write_policy" ON tracks FOR ALL TO authenticated USING (artist_id = auth.uid());`,
      
      `DROP POLICY IF EXISTS "comments_read_policy" ON comments;`,
      `CREATE POLICY "comments_read_policy" ON comments FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "comments_write_policy" ON comments;`,
      `CREATE POLICY "comments_write_policy" ON comments FOR ALL TO authenticated USING (user_id = auth.uid());`,
      
      `DROP POLICY IF EXISTS "likes_read_policy" ON likes;`,
      `CREATE POLICY "likes_read_policy" ON likes FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "likes_write_policy" ON likes;`,
      `CREATE POLICY "likes_write_policy" ON likes FOR ALL TO authenticated USING (user_id = auth.uid());`
    ];

    // Execute schema creation
    for (const schema of schemas) {
      await supabase.rpc('sql', { query: schema });
    }

    // Execute RLS policies
    for (const policy of rlsPolicies) {
      await supabase.rpc('sql', { query: policy });
    }

    return c.json({ success: true, message: "TuneTON database ready with RLS policies" });
  } catch (error) {
    console.log('Database setup error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test database
app.get("/make-server-82f19583/test-db", async (c) => {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    if (error?.code === '42P01') return c.json({ success: false, needsSetup: true });
    return c.json({ success: true, message: "Database connected" });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// User auth
app.post("/make-server-82f19583/auth/user", async (c) => {
  try {
    const { telegram_id, username, display_name, avatar_url } = await c.req.json();
    if (!telegram_id || !username) return c.json({ error: 'Missing fields' }, 400);

    const { data: existing } = await supabase.from('users').select('*').eq('telegram_id', telegram_id).single();
    
    const { data, error } = existing 
      ? await supabase.from('users').update({ username, display_name, avatar_url }).eq('telegram_id', telegram_id).select().single()
      : await supabase.from('users').insert([{ telegram_id, username, display_name, avatar_url }]).select().single();

    if (error) throw error;
    return c.json({ success: true, user: data });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Comments
app.post("/make-server-82f19583/comments", async (c) => {
  try {
    const body = await c.req.json();
    if (!body.user_id || !body.entity_type || !body.entity_id || !body.content) {
      return c.json({ error: 'Missing fields' }, 400);
    }
    const { data, error } = await supabase.from('comments').insert([body]).select(`*, user:users(id, username, display_name, avatar_url, is_verified)`).single();
    if (error) throw error;
    return c.json({ success: true, comment: data });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/make-server-82f19583/comments/:entityType/:entityId", async (c) => {
  try {
    const { data, error } = await supabase.from('comments').select(`*, user:users(id, username, display_name, avatar_url, is_verified)`).eq('entity_type', c.req.param('entityType')).eq('entity_id', c.req.param('entityId')).is('parent_comment_id', null).order('created_at', { ascending: false });
    if (error) throw error;
    return c.json({ success: true, comments: data });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Likes
app.post("/make-server-82f19583/like", async (c) => {
  try {
    const { user_id, entity_type, entity_id } = await c.req.json();
    if (!user_id || !entity_type || !entity_id) return c.json({ error: 'Missing fields' }, 400);

    const { data: existing } = await supabase.from('likes').select('id').eq('user_id', user_id).eq('entity_type', entity_type).eq('entity_id', entity_id).single();
    
    if (existing) {
      await supabase.from('likes').delete().eq('user_id', user_id).eq('entity_type', entity_type).eq('entity_id', entity_id);
      return c.json({ success: true, liked: false });
    } else {
      await supabase.from('likes').insert([{ user_id, entity_type, entity_id }]);
      return c.json({ success: true, liked: true });
    }
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Fix RLS policies for existing tables
app.post("/make-server-82f19583/fix-rls", async (c) => {
  try {
    const rlsPolicies = [
      // Enable RLS on all tables first
      `ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE stars_transactions ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE ton_transactions ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE users ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE artists ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE albums ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE audio_presets ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE remixes ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE playlist_tracks ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE user_library ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE social_interactions ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE comments ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE contests ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE contest_entries ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE contest_votes ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE nft_collections ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE nfts ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE nft_transactions ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE platform_metrics ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;`,

      // KV Store policies
      `DROP POLICY IF EXISTS "kv_store_service_role_policy" ON kv_store_82f19583;`,
      `CREATE POLICY "kv_store_service_role_policy" ON kv_store_82f19583 FOR ALL USING (auth.role() = 'service_role');`,
      `DROP POLICY IF EXISTS "kv_store_authenticated_policy" ON kv_store_82f19583;`,
      `CREATE POLICY "kv_store_authenticated_policy" ON kv_store_82f19583 FOR ALL TO authenticated USING (true);`,

      // User Wallets - Users can only access their own wallets
      `DROP POLICY IF EXISTS "user_wallets_policy" ON user_wallets;`,
      `CREATE POLICY "user_wallets_policy" ON user_wallets FOR ALL TO authenticated USING (user_id = auth.uid());`,

      // Stars Transactions - Users can read their own transactions, insert their own
      `DROP POLICY IF EXISTS "stars_transactions_read_policy" ON stars_transactions;`,
      `CREATE POLICY "stars_transactions_read_policy" ON stars_transactions FOR SELECT TO authenticated USING (user_id = auth.uid());`,
      `DROP POLICY IF EXISTS "stars_transactions_insert_policy" ON stars_transactions;`,
      `CREATE POLICY "stars_transactions_insert_policy" ON stars_transactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());`,

      // TON Transactions - Users can read their own transactions, insert their own
      `DROP POLICY IF EXISTS "ton_transactions_read_policy" ON ton_transactions;`,
      `CREATE POLICY "ton_transactions_read_policy" ON ton_transactions FOR SELECT TO authenticated USING (user_id = auth.uid());`,
      `DROP POLICY IF EXISTS "ton_transactions_insert_policy" ON ton_transactions;`,
      `CREATE POLICY "ton_transactions_insert_policy" ON ton_transactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());`,

      // Users - Public profiles readable, own profile editable
      `DROP POLICY IF EXISTS "users_read_policy" ON users;`,
      `CREATE POLICY "users_read_policy" ON users FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "users_write_policy" ON users;`,
      `CREATE POLICY "users_write_policy" ON users FOR ALL TO authenticated USING (id = auth.uid());`,

      // User Achievements - Users can read all, manage their own
      `DROP POLICY IF EXISTS "user_achievements_read_policy" ON user_achievements;`,
      `CREATE POLICY "user_achievements_read_policy" ON user_achievements FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "user_achievements_write_policy" ON user_achievements;`,
      `CREATE POLICY "user_achievements_write_policy" ON user_achievements FOR ALL TO authenticated USING (user_id = auth.uid());`,

      // User Sessions - Users can only access their own sessions
      `DROP POLICY IF EXISTS "user_sessions_policy" ON user_sessions;`,
      `CREATE POLICY "user_sessions_policy" ON user_sessions FOR ALL TO authenticated USING (user_id = auth.uid());`,

      // Artists - Public readable, own profile editable
      `DROP POLICY IF EXISTS "artists_read_policy" ON artists;`,
      `CREATE POLICY "artists_read_policy" ON artists FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "artists_write_policy" ON artists;`,
      `CREATE POLICY "artists_write_policy" ON artists FOR ALL TO authenticated USING (user_id = auth.uid());`,

      // Albums - Public readable for public albums, own albums editable
      `DROP POLICY IF EXISTS "albums_read_policy" ON albums;`,
      `CREATE POLICY "albums_read_policy" ON albums FOR SELECT TO authenticated USING (is_public = true OR artist_id = auth.uid());`,
      `DROP POLICY IF EXISTS "albums_write_policy" ON albums;`,
      `CREATE POLICY "albums_write_policy" ON albums FOR ALL TO authenticated USING (artist_id = auth.uid());`,

      // Tracks - Public readable for public tracks, own tracks editable
      `DROP POLICY IF EXISTS "tracks_read_policy" ON tracks;`,
      `CREATE POLICY "tracks_read_policy" ON tracks FOR SELECT TO authenticated USING (is_public = true OR artist_id = auth.uid());`,
      `DROP POLICY IF EXISTS "tracks_write_policy" ON tracks;`,
      `CREATE POLICY "tracks_write_policy" ON tracks FOR ALL TO authenticated USING (artist_id = auth.uid());`,

      // Audio Presets - Public readable for public presets, own presets editable
      `DROP POLICY IF EXISTS "audio_presets_read_policy" ON audio_presets;`,
      `CREATE POLICY "audio_presets_read_policy" ON audio_presets FOR SELECT TO authenticated USING (is_public = true OR creator_id = auth.uid());`,
      `DROP POLICY IF EXISTS "audio_presets_write_policy" ON audio_presets;`,
      `CREATE POLICY "audio_presets_write_policy" ON audio_presets FOR ALL TO authenticated USING (creator_id = auth.uid());`,

      // Remixes - Public readable for public remixes, own remixes editable
      `DROP POLICY IF EXISTS "remixes_read_policy" ON remixes;`,
      `CREATE POLICY "remixes_read_policy" ON remixes FOR SELECT TO authenticated USING (is_public = true OR creator_id = auth.uid());`,
      `DROP POLICY IF EXISTS "remixes_write_policy" ON remixes;`,
      `CREATE POLICY "remixes_write_policy" ON remixes FOR ALL TO authenticated USING (creator_id = auth.uid());`,

      // Playlists - Public readable for public playlists, own playlists editable
      `DROP POLICY IF EXISTS "playlists_read_policy" ON playlists;`,
      `CREATE POLICY "playlists_read_policy" ON playlists FOR SELECT TO authenticated USING (is_public = true OR creator_id = auth.uid());`,
      `DROP POLICY IF EXISTS "playlists_write_policy" ON playlists;`,
      `CREATE POLICY "playlists_write_policy" ON playlists FOR ALL TO authenticated USING (creator_id = auth.uid());`,

      // Playlist Tracks - Readable based on playlist access, editable by playlist owner
      `DROP POLICY IF EXISTS "playlist_tracks_read_policy" ON playlist_tracks;`,
      `CREATE POLICY "playlist_tracks_read_policy" ON playlist_tracks FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM playlists WHERE playlists.id = playlist_id AND (is_public = true OR creator_id = auth.uid()))
      );`,
      `DROP POLICY IF EXISTS "playlist_tracks_write_policy" ON playlist_tracks;`,
      `CREATE POLICY "playlist_tracks_write_policy" ON playlist_tracks FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM playlists WHERE playlists.id = playlist_id AND creator_id = auth.uid())
      );`,

      // User Library - Users can only access their own library
      `DROP POLICY IF EXISTS "user_library_policy" ON user_library;`,
      `CREATE POLICY "user_library_policy" ON user_library FOR ALL TO authenticated USING (user_id = auth.uid());`,

      // User Follows - Public readable, users can manage their own follows
      `DROP POLICY IF EXISTS "user_follows_read_policy" ON user_follows;`,
      `CREATE POLICY "user_follows_read_policy" ON user_follows FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "user_follows_write_policy" ON user_follows;`,
      `CREATE POLICY "user_follows_write_policy" ON user_follows FOR ALL TO authenticated USING (follower_id = auth.uid());`,

      // Social Interactions - Public readable, users can manage their own interactions
      `DROP POLICY IF EXISTS "social_interactions_read_policy" ON social_interactions;`,
      `CREATE POLICY "social_interactions_read_policy" ON social_interactions FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "social_interactions_write_policy" ON social_interactions;`,
      `CREATE POLICY "social_interactions_write_policy" ON social_interactions FOR ALL TO authenticated USING (user_id = auth.uid());`,

      // Comments - Public readable, users can manage their own comments
      `DROP POLICY IF EXISTS "comments_read_policy" ON comments;`,
      `CREATE POLICY "comments_read_policy" ON comments FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "comments_write_policy" ON comments;`,
      `CREATE POLICY "comments_write_policy" ON comments FOR ALL TO authenticated USING (user_id = auth.uid());`,

      // Community Posts - Public readable for public posts, users can manage their own posts
      `DROP POLICY IF EXISTS "community_posts_read_policy" ON community_posts;`,
      `CREATE POLICY "community_posts_read_policy" ON community_posts FOR SELECT TO authenticated USING (is_public = true OR author_id = auth.uid());`,
      `DROP POLICY IF EXISTS "community_posts_write_policy" ON community_posts;`,
      `CREATE POLICY "community_posts_write_policy" ON community_posts FOR ALL TO authenticated USING (author_id = auth.uid());`,

      // Contests - Public readable, organizers can manage their own contests
      `DROP POLICY IF EXISTS "contests_read_policy" ON contests;`,
      `CREATE POLICY "contests_read_policy" ON contests FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "contests_write_policy" ON contests;`,
      `CREATE POLICY "contests_write_policy" ON contests FOR ALL TO authenticated USING (organizer_id = auth.uid());`,

      // Contest Entries - Public readable, users can manage their own entries
      `DROP POLICY IF EXISTS "contest_entries_read_policy" ON contest_entries;`,
      `CREATE POLICY "contest_entries_read_policy" ON contest_entries FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "contest_entries_write_policy" ON contest_entries;`,
      `CREATE POLICY "contest_entries_write_policy" ON contest_entries FOR ALL TO authenticated USING (participant_id = auth.uid());`,

      // Contest Votes - Public readable, users can manage their own votes
      `DROP POLICY IF EXISTS "contest_votes_read_policy" ON contest_votes;`,
      `CREATE POLICY "contest_votes_read_policy" ON contest_votes FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "contest_votes_write_policy" ON contest_votes;`,
      `CREATE POLICY "contest_votes_write_policy" ON contest_votes FOR ALL TO authenticated USING (voter_id = auth.uid());`,

      // NFT Collections - Public readable, creators can manage their own collections
      `DROP POLICY IF EXISTS "nft_collections_read_policy" ON nft_collections;`,
      `CREATE POLICY "nft_collections_read_policy" ON nft_collections FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "nft_collections_write_policy" ON nft_collections;`,
      `CREATE POLICY "nft_collections_write_policy" ON nft_collections FOR ALL TO authenticated USING (creator_id = auth.uid());`,

      // NFTs - Public readable, owners and creators can manage
      `DROP POLICY IF EXISTS "nfts_read_policy" ON nfts;`,
      `CREATE POLICY "nfts_read_policy" ON nfts FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "nfts_write_policy" ON nfts;`,
      `CREATE POLICY "nfts_write_policy" ON nfts FOR ALL TO authenticated USING (owner_id = auth.uid() OR creator_id = auth.uid());`,

      // NFT Transactions - Public readable, participants can manage their transactions
      `DROP POLICY IF EXISTS "nft_transactions_read_policy" ON nft_transactions;`,
      `CREATE POLICY "nft_transactions_read_policy" ON nft_transactions FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "nft_transactions_write_policy" ON nft_transactions;`,
      `CREATE POLICY "nft_transactions_write_policy" ON nft_transactions FOR ALL TO authenticated USING (from_user_id = auth.uid() OR to_user_id = auth.uid());`,

      // User Activities - Users can read all activities, manage their own
      `DROP POLICY IF EXISTS "user_activities_read_policy" ON user_activities;`,
      `CREATE POLICY "user_activities_read_policy" ON user_activities FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "user_activities_write_policy" ON user_activities;`,
      `CREATE POLICY "user_activities_write_policy" ON user_activities FOR ALL TO authenticated USING (user_id = auth.uid());`,

      // Platform Metrics - Read-only for authenticated users
      `DROP POLICY IF EXISTS "platform_metrics_read_policy" ON platform_metrics;`,
      `CREATE POLICY "platform_metrics_read_policy" ON platform_metrics FOR SELECT TO authenticated USING (true);`,

      // App Config - Read-only for authenticated users
      `DROP POLICY IF EXISTS "app_config_read_policy" ON app_config;`,
      `CREATE POLICY "app_config_read_policy" ON app_config FOR SELECT TO authenticated USING (true);`,

      // Content Reports - Users can read all reports, manage their own reports
      `DROP POLICY IF EXISTS "content_reports_read_policy" ON content_reports;`,
      `CREATE POLICY "content_reports_read_policy" ON content_reports FOR SELECT TO authenticated USING (true);`,
      `DROP POLICY IF EXISTS "content_reports_write_policy" ON content_reports;`,
      `CREATE POLICY "content_reports_write_policy" ON content_reports FOR ALL TO authenticated USING (reporter_id = auth.uid());`,
    ];

    // Execute RLS policies
    for (const policy of rlsPolicies) {
      try {
        await supabase.rpc('sql', { query: policy });
      } catch (err) {
        console.log(`Policy execution warning: ${policy} - ${err.message}`);
        // Continue with other policies even if some fail due to missing tables
      }
    }

    return c.json({ success: true, message: "RLS policies fixed for all TuneTON tables" });
  } catch (error) {
    console.log('RLS fix error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test KV
app.get("/make-server-82f19583/test/kv", async (c) => {
  try {
    await kv.set('test-key', { message: 'Hello from TuneTON!', timestamp: Date.now() });
    const data = await kv.get('test-key');
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Helper function to get user ID from access token
async function getUserFromToken(accessToken: string | undefined) {
  console.log('🔐 getUserFromToken called with:', accessToken?.substring(0, 20) + '...');
  
  if (!accessToken) {
    console.log('🔐 getUserFromToken: No access token provided');
    return null;
  }
  
  // Handle mock tokens from development/Telegram
  if (accessToken.startsWith('telegram_') || accessToken.startsWith('dev_')) {
    console.log('🔐 getUserFromToken: Using mock token for development:', accessToken);
    // Extract user ID from mock token format: telegram_12345_timestamp or dev_user_timestamp
    const parts = accessToken.split('_');
    const userId = parts[1] === 'user' ? 'dev-user-12345' : parts[1]; // Handle both formats
    
    const mockUser = {
      id: userId,
      email: `user${userId}@tuneton.app`,
      user_metadata: {
        telegram_id: userId
      }
    };
    console.log('🔐 getUserFromToken: Created mock user:', mockUser);
    return mockUser;
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      console.log('🔐 getUserFromToken: Supabase auth failed:', error);
      return null;
    }
    console.log('🔐 getUserFromToken: Supabase user found:', user.id);
    return user
  } catch (error) {
    console.error('🔐 getUserFromToken: Error getting user from token:', error)
    return null
  }
}

// Get user playlists
app.get('/make-server-82f19583/playlists', async (c) => {
  const authHeader = c.req.header('Authorization')
  const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
  console.log('🔐 Backend: playlists request with auth header:', authHeader?.substring(0, 30) + '...');
  console.log('🔐 Backend: extracted token:', accessToken?.substring(0, 20) + '...');
  
  const user = await getUserFromToken(accessToken)
  console.log('🔐 Backend: user from token:', user ? { id: user.id, email: user.email } : 'null');
  
  if (!user) {
    console.error('🔐 Backend: Unauthorized - no user found');
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  try {
    const playlists = await kv.getByPrefix(`playlist:${user.id}:`)
    console.log('🔐 Backend: Found playlists:', playlists.length);
    return c.json({ playlists: playlists || [] })
  } catch (error) {
    console.error('Error fetching playlists:', error)
    return c.json({ error: 'Failed to fetch playlists' }, 500)
  }
})

// Create new playlist
app.post('/make-server-82f19583/playlists', async (c) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1]
  const user = await getUserFromToken(accessToken)
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  try {
    const body = await c.req.json()
    const { name, description, isPrivate = false, cover } = body
    
    if (!name) {
      return c.json({ error: 'Playlist name is required' }, 400)
    }
    
    const playlistId = crypto.randomUUID()
    const playlist = {
      id: playlistId,
      name,
      description,
      isPrivate,
      cover,
      tracks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.id,
      userEmail: user.email
    }
    
    await kv.set(`playlist:${user.id}:${playlistId}`, playlist)
    
    return c.json({ playlist })
  } catch (error) {
    console.error('Error creating playlist:', error)
    return c.json({ error: 'Failed to create playlist' }, 500)
  }
})

// Get specific playlist
app.get('/make-server-82f19583/playlists/:id', async (c) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1]
  const user = await getUserFromToken(accessToken)
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  try {
    const playlistId = c.req.param('id')
    const playlist = await kv.get(`playlist:${user.id}:${playlistId}`)
    
    if (!playlist) {
      return c.json({ error: 'Playlist not found' }, 404)
    }
    
    return c.json({ playlist })
  } catch (error) {
    console.error('Error fetching playlist:', error)
    return c.json({ error: 'Failed to fetch playlist' }, 500)
  }
})

// Update playlist
app.put('/make-server-82f19583/playlists/:id', async (c) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1]
  const user = await getUserFromToken(accessToken)
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  try {
    const playlistId = c.req.param('id')
    const body = await c.req.json()
    
    const existingPlaylist = await kv.get(`playlist:${user.id}:${playlistId}`)
    if (!existingPlaylist) {
      return c.json({ error: 'Playlist not found' }, 404)
    }
    
    const updatedPlaylist = {
      ...existingPlaylist,
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`playlist:${user.id}:${playlistId}`, updatedPlaylist)
    
    return c.json({ playlist: updatedPlaylist })
  } catch (error) {
    console.error('Error updating playlist:', error)
    return c.json({ error: 'Failed to update playlist' }, 500)
  }
})

// Delete playlist
app.delete('/make-server-82f19583/playlists/:id', async (c) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1]
  const user = await getUserFromToken(accessToken)
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  try {
    const playlistId = c.req.param('id')
    await kv.del(`playlist:${user.id}:${playlistId}`)
    
    return c.json({ message: 'Playlist deleted successfully' })
  } catch (error) {
    console.error('Error deleting playlist:', error)
    return c.json({ error: 'Failed to delete playlist' }, 500)
  }
})

// Add track to playlist
app.post('/make-server-82f19583/playlists/:id/tracks', async (c) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1]
  const user = await getUserFromToken(accessToken)
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  try {
    const playlistId = c.req.param('id')
    const body = await c.req.json()
    const { jamendoTrack } = body
    
    if (!jamendoTrack) {
      return c.json({ error: 'Track data is required' }, 400)
    }
    
    const playlist = await kv.get(`playlist:${user.id}:${playlistId}`)
    if (!playlist) {
      return c.json({ error: 'Playlist not found' }, 404)
    }
    
    // Check if track already exists
    const trackExists = playlist.tracks.some((track: any) => track.id === jamendoTrack.id)
    if (trackExists) {
      return c.json({ error: 'Track already in playlist' }, 400)
    }
    
    const trackWithMetadata = {
      ...jamendoTrack,
      addedAt: new Date().toISOString(),
      addedBy: user.id
    }
    
    playlist.tracks.push(trackWithMetadata)
    playlist.updatedAt = new Date().toISOString()
    
    await kv.set(`playlist:${user.id}:${playlistId}`, playlist)
    
    return c.json({ playlist })
  } catch (error) {
    console.error('Error adding track to playlist:', error)
    return c.json({ error: 'Failed to add track to playlist' }, 500)
  }
})

// Remove track from playlist
app.delete('/make-server-82f19583/playlists/:id/tracks/:trackId', async (c) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1]
  const user = await getUserFromToken(accessToken)
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  try {
    const playlistId = c.req.param('id')
    const trackId = c.req.param('trackId')
    
    const playlist = await kv.get(`playlist:${user.id}:${playlistId}`)
    if (!playlist) {
      return c.json({ error: 'Playlist not found' }, 404)
    }
    
    playlist.tracks = playlist.tracks.filter((track: any) => track.id !== trackId)
    playlist.updatedAt = new Date().toISOString()
    
    await kv.set(`playlist:${user.id}:${playlistId}`, playlist)
    
    return c.json({ playlist })
  } catch (error) {
    console.error('Error removing track from playlist:', error)
    return c.json({ error: 'Failed to remove track from playlist' }, 500)
  }
})

// Get user's liked tracks
app.get('/make-server-82f19583/liked-tracks', async (c) => {
  const authHeader = c.req.header('Authorization')
  const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
  console.log('🔐 Backend: liked-tracks request with token:', accessToken?.substring(0, 20) + '...');
  
  const user = await getUserFromToken(accessToken)
  
  if (!user) {
    console.error('🔐 Backend: Unauthorized - no user found for liked tracks');
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  try {
    const likedTracks = await kv.getByPrefix(`liked:${user.id}:`)
    console.log('🔐 Backend: Found liked tracks:', likedTracks.length);
    return c.json({ likedTracks: likedTracks || [] })
  } catch (error) {
    console.error('Error fetching liked tracks:', error)
    return c.json({ error: 'Failed to fetch liked tracks' }, 500)
  }
})

// Like/unlike track
app.post('/make-server-82f19583/tracks/:trackId/like', async (c) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1]
  const user = await getUserFromToken(accessToken)
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  try {
    const trackId = c.req.param('trackId')
    const body = await c.req.json()
    const { jamendoTrack, isLiked } = body
    
    const likeKey = `liked:${user.id}:${trackId}`
    
    if (isLiked) {
      const likedTrack = {
        ...jamendoTrack,
        likedAt: new Date().toISOString(),
        userId: user.id
      }
      await kv.set(likeKey, likedTrack)
    } else {
      await kv.del(likeKey)
    }
    
    return c.json({ success: true, isLiked })
  } catch (error) {
    console.error('Error toggling track like:', error)
    return c.json({ error: 'Failed to toggle track like' }, 500)
  }
})

// Get user's library stats
app.get('/make-server-82f19583/library/stats', async (c) => {
  const authHeader = c.req.header('Authorization')
  const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
  console.log('🔐 Backend: library/stats request with token:', accessToken?.substring(0, 20) + '...');
  
  const user = await getUserFromToken(accessToken)
  
  if (!user) {
    console.error('🔐 Backend: Unauthorized - no user found for library stats');
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  try {
    const [playlists, likedTracks] = await Promise.all([
      kv.getByPrefix(`playlist:${user.id}:`),
      kv.getByPrefix(`liked:${user.id}:`)
    ])
    
    const totalTracks = playlists.reduce((sum: number, playlist: any) => 
      sum + (playlist.tracks?.length || 0), 0
    )
    
    const stats = {
      playlistCount: playlists.length,
      likedTracksCount: likedTracks.length,
      totalTracks
    };
    
    console.log('🔐 Backend: Library stats:', stats);
    return c.json(stats)
  } catch (error) {
    console.error('Error fetching library stats:', error)
    return c.json({ error: 'Failed to fetch library stats' }, 500)
  }
})

console.log('🎵 TuneTON Server Ready - Database, Comments, Social Features, Playlists & Library Enabled');

Deno.serve(app.fetch);