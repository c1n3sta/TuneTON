-- Database schema for TuneTON self-hosted backend

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  photo_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Create tracks table
CREATE TABLE IF NOT EXISTS tracks (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT,
  album_id BIGINT,
  album_name TEXT,
  duration INTEGER DEFAULT 0,
  file_url TEXT,
  cover_url TEXT,
  genre TEXT,
  bpm INTEGER,
  key_signature TEXT,
  energy_level INTEGER,
  audio_features JSONB,
  license_info JSONB,
  play_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  remix_count INTEGER DEFAULT 0,
  slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for tracks table
CREATE INDEX IF NOT EXISTS idx_tracks_created_at ON tracks(created_at);
CREATE INDEX IF NOT EXISTS idx_tracks_slug ON tracks(slug);

-- Create playbacks table
CREATE TABLE IF NOT EXISTS playbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id BIGINT REFERENCES tracks(id) ON DELETE CASCADE,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for playbacks table
CREATE INDEX IF NOT EXISTS idx_playbacks_track_id ON playbacks(track_id);
CREATE INDEX IF NOT EXISTS idx_playbacks_created_at ON playbacks(created_at);

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON users TO tuneton_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON tracks TO tuneton_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON playbacks TO tuneton_app;