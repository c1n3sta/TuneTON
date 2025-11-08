-- Create user_favorite_artists table
CREATE TABLE IF NOT EXISTS user_favorite_artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  artist_id TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  artist_image TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, artist_id)
);

-- Create indexes for user_favorite_artists
CREATE INDEX IF NOT EXISTS idx_user_favorite_artists_user_id ON user_favorite_artists(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_artists_artist_id ON user_favorite_artists(artist_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_artists_added_at ON user_favorite_artists(added_at);

-- Enable Row Level Security for user_favorite_artists
ALTER TABLE user_favorite_artists ENABLE ROW LEVEL SECURITY;

-- Create policies for user_favorite_artists
CREATE POLICY "Favorite artists are viewable by user" ON user_favorite_artists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorite artists" ON user_favorite_artists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite artists" ON user_favorite_artists
  FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions for user_favorite_artists
GRANT SELECT, INSERT, DELETE ON user_favorite_artists TO anon;
GRANT ALL ON user_favorite_artists TO service_role;