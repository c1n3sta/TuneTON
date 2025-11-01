-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for achievements
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_earned_at ON achievements(earned_at);

-- Enable Row Level Security for achievements
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for achievements
CREATE POLICY "Achievements are viewable by user" ON achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements" ON achievements
  FOR UPDATE USING (auth.uid() = user_id);

-- Grant permissions for achievements
GRANT SELECT, INSERT, UPDATE ON achievements TO anon;
GRANT ALL ON achievements TO service_role;

-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover TEXT,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for playlists
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_created_at ON playlists(created_at);

-- Enable Row Level Security for playlists
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

-- Create policies for playlists
CREATE POLICY "Playlists are viewable by everyone for public playlists" ON playlists
  FOR SELECT USING (is_private = false);

CREATE POLICY "Users can view their own playlists" ON playlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own playlists" ON playlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists" ON playlists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists" ON playlists
  FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions for playlists
GRANT SELECT, INSERT, UPDATE, DELETE ON playlists TO anon;
GRANT ALL ON playlists TO service_role;

-- Create liked_tracks table
CREATE TABLE IF NOT EXISTS liked_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  track_data JSONB,
  liked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- Create indexes for liked_tracks
CREATE INDEX IF NOT EXISTS idx_liked_tracks_user_id ON liked_tracks(user_id);
CREATE INDEX IF NOT EXISTS idx_liked_tracks_track_id ON liked_tracks(track_id);
CREATE INDEX IF NOT EXISTS idx_liked_tracks_liked_at ON liked_tracks(liked_at);

-- Enable Row Level Security for liked_tracks
ALTER TABLE liked_tracks ENABLE ROW LEVEL SECURITY;

-- Create policies for liked_tracks
CREATE POLICY "Liked tracks are viewable by user" ON liked_tracks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own liked tracks" ON liked_tracks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own liked tracks" ON liked_tracks
  FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions for liked_tracks
GRANT SELECT, INSERT, DELETE ON liked_tracks TO anon;
GRANT ALL ON liked_tracks TO service_role;

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- 'track', 'playlist', 'nft', etc.
  entity_id TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for comments
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_comment_id ON comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Enable Row Level Security for comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions for comments
GRANT SELECT, INSERT, UPDATE, DELETE ON comments TO anon;
GRANT ALL ON comments TO service_role;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, target_user_id)
);

-- Create indexes for subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_target_user_id ON subscriptions(target_user_id);

-- Enable Row Level Security for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions
CREATE POLICY "Subscriptions are viewable by user" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions" ON subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions for subscriptions
GRANT SELECT, INSERT, DELETE ON subscriptions TO anon;
GRANT ALL ON subscriptions TO service_role;

-- Create user_balances table for stars and other currencies
CREATE TABLE IF NOT EXISTS user_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  stars INTEGER DEFAULT 0,
  toncoin NUMERIC(10, 6) DEFAULT 0.0,
  ethereum NUMERIC(10, 6) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user_balances
CREATE INDEX IF NOT EXISTS idx_user_balances_user_id ON user_balances(user_id);

-- Enable Row Level Security for user_balances
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;

-- Create policies for user_balances
CREATE POLICY "User balances are viewable by user" ON user_balances
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own balances" ON user_balances
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can update all balances" ON user_balances
  FOR UPDATE USING (auth.role() = 'service_role');

-- Grant permissions for user_balances
GRANT SELECT, UPDATE ON user_balances TO anon;
GRANT ALL ON user_balances TO service_role;

-- Create user_levels table for experience points and levels
CREATE TABLE IF NOT EXISTS user_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user_levels
CREATE INDEX IF NOT EXISTS idx_user_levels_user_id ON user_levels(user_id);
CREATE INDEX IF NOT EXISTS idx_user_levels_level ON user_levels(level);

-- Enable Row Level Security for user_levels
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;

-- Create policies for user_levels
CREATE POLICY "User levels are viewable by everyone" ON user_levels
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own levels" ON user_levels
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can update all levels" ON user_levels
  FOR UPDATE USING (auth.role() = 'service_role');

-- Grant permissions for user_levels
GRANT SELECT, UPDATE ON user_levels TO anon;
GRANT ALL ON user_levels TO service_role;

-- Add additional columns to users table for bio and verification status
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_artist BOOLEAN DEFAULT false;

-- Create functions to update user balances and levels
-- Function to add stars to user balance
CREATE OR REPLACE FUNCTION add_user_stars(user_uuid UUID, stars_amount INTEGER)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_balances (user_id, stars)
  VALUES (user_uuid, stars_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    stars = user_balances.stars + EXCLUDED.stars,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to update user level based on experience points
CREATE OR REPLACE FUNCTION update_user_level(user_uuid UUID, exp_points INTEGER)
RETURNS VOID AS $$
DECLARE
  new_level INTEGER;
BEGIN
  -- Calculate level based on experience points (simplified formula)
  new_level := FLOOR(SQRT(exp_points / 100.0)) + 1;
  
  INSERT INTO user_levels (user_id, level, experience_points)
  VALUES (user_uuid, new_level, exp_points)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    level = EXCLUDED.level,
    experience_points = EXCLUDED.experience_points,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;