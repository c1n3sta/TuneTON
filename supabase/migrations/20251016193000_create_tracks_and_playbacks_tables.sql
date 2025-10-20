-- Create tracks table with correct schema
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

-- Create playbacks table
CREATE TABLE IF NOT EXISTS playbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id BIGINT REFERENCES tracks(id) ON DELETE CASCADE,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tracks_created_at ON tracks(created_at);
CREATE INDEX IF NOT EXISTS idx_tracks_slug ON tracks(slug);
CREATE INDEX IF NOT EXISTS idx_playbacks_track_id ON playbacks(track_id);
CREATE INDEX IF NOT EXISTS idx_playbacks_created_at ON playbacks(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE playbacks ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (only if they don't already exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Public tracks are viewable by everyone'
  ) THEN
    CREATE POLICY "Public tracks are viewable by everyone" ON tracks
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Public playbacks are viewable by everyone'
  ) THEN
    CREATE POLICY "Public playbacks are viewable by everyone" ON playbacks
      FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Anyone can insert playbacks'
  ) THEN
    CREATE POLICY "Anyone can insert playbacks" ON playbacks
      FOR INSERT WITH CHECK (true);
  END IF;
END
$$;

-- Grant access to anon role
GRANT SELECT ON tracks TO anon;
GRANT SELECT, INSERT ON playbacks TO anon;