-- Create playbacks table with correct schema to match existing tracks table
CREATE TABLE IF NOT EXISTS playbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id BIGINT REFERENCES tracks(id) ON DELETE CASCADE,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_playbacks_track_id ON playbacks(track_id);
CREATE INDEX IF NOT EXISTS idx_playbacks_created_at ON playbacks(created_at);

-- Enable Row Level Security
ALTER TABLE playbacks ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (only if they don't already exist)
DO $$
BEGIN
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
GRANT SELECT, INSERT ON playbacks TO anon;

-- This migration has been consolidated into the main migration file
-- No additional changes needed here
SELECT 1;

-- This migration has been consolidated into the main migration file
-- No additional changes needed here
SELECT 1;