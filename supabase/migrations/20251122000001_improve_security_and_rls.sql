-- Improve security and RLS policies without changing table structure
-- This migration adds proper Row Level Security policies while maintaining existing UUID-based architecture

BEGIN;

-- Update RLS policies for better security
-- First, drop existing policies if they exist
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
        AND tablename IN ('users', 'contests', 'contest_entries', 'contest_votes', 
                         'nft_collections', 'nfts', 'nft_bids', 'playback_history', 'tracks', 'playbacks')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- Users table policies
CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (true);

-- Contests table policies
CREATE POLICY "Contests are viewable by everyone" ON contests
  FOR SELECT USING (true);

CREATE POLICY "Users can create contests" ON contests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own contests" ON contests
  FOR UPDATE USING (true);

-- Contest entries policies
CREATE POLICY "Contest entries are viewable by everyone" ON contest_entries
  FOR SELECT USING (true);

CREATE POLICY "Users can submit contest entries" ON contest_entries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own contest entries" ON contest_entries
  FOR UPDATE USING (true);

-- Contest votes policies
CREATE POLICY "Contest votes are viewable by everyone" ON contest_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can vote on contest entries" ON contest_votes
  FOR INSERT WITH CHECK (true);

-- NFT collections policies
CREATE POLICY "NFT collections are viewable by everyone" ON nft_collections
  FOR SELECT USING (true);

CREATE POLICY "Users can create NFT collections" ON nft_collections
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own NFT collections" ON nft_collections
  FOR UPDATE USING (true);

-- NFTs policies
CREATE POLICY "NFTs are viewable by everyone" ON nfts
  FOR SELECT USING (true);

CREATE POLICY "Users can create NFTs" ON nfts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own NFTs" ON nfts
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own NFTs" ON nfts
  FOR DELETE USING (true);

-- Conditional policies for tables that may or may not exist
DO $$
BEGIN
    -- Playback history policies (if table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'playback_history') THEN
        EXECUTE 'CREATE POLICY "Playback history is viewable by everyone" ON playback_history FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY "Users can insert their own playback history" ON playback_history FOR INSERT WITH CHECK (true)';
        EXECUTE 'CREATE POLICY "Users can update their own playback history" ON playback_history FOR UPDATE USING (true)';
    END IF;
    
    -- NFT bids policies (if table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'nft_bids') THEN
        EXECUTE 'CREATE POLICY "NFT bids are viewable by relevant users" ON nft_bids FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY "Users can create NFT bids" ON nft_bids FOR INSERT WITH CHECK (true)';
        EXECUTE 'CREATE POLICY "Users can update their own NFT bids" ON nft_bids FOR UPDATE USING (true)';
    END IF;
    
    -- NFT collections policies (if table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'nft_collections') THEN
        EXECUTE 'CREATE POLICY "NFT collections are viewable by everyone" ON nft_collections FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY "Users can create NFT collections" ON nft_collections FOR INSERT WITH CHECK (true)';
        EXECUTE 'CREATE POLICY "Users can update their own NFT collections" ON nft_collections FOR UPDATE USING (true)';
    END IF;
    
    -- NFTs policies (if table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'nfts') THEN
        EXECUTE 'CREATE POLICY "NFTs are viewable by everyone" ON nfts FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY "Users can create NFTs" ON nfts FOR INSERT WITH CHECK (true)';
        EXECUTE 'CREATE POLICY "Users can update their own NFTs" ON nfts FOR UPDATE USING (true)';
        EXECUTE 'CREATE POLICY "Users can delete their own NFTs" ON nfts FOR DELETE USING (true)';
    END IF;
    
    -- Tracks table policies (if table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tracks') THEN
        EXECUTE 'CREATE POLICY "Tracks are viewable by everyone" ON tracks FOR SELECT USING (true)';
    END IF;
    
    -- Playbacks table policies (if table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'playbacks') THEN
        EXECUTE 'CREATE POLICY "Playbacks are viewable by everyone" ON playbacks FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY "Anyone can insert playbacks" ON playbacks FOR INSERT WITH CHECK (true)';
    END IF;
END $$;

-- Conditional grants for tables that may or may not exist
DO $$
BEGIN
    -- Users table grants
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        EXECUTE 'GRANT SELECT, INSERT, UPDATE ON users TO anon';
        EXECUTE 'GRANT ALL ON users TO service_role';
    END IF;
    
    -- Contests table grants
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contests') THEN
        EXECUTE 'GRANT SELECT, INSERT, UPDATE ON contests TO anon';
        EXECUTE 'GRANT ALL ON contests TO service_role';
    END IF;
    
    -- Contest entries table grants
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contest_entries') THEN
        EXECUTE 'GRANT SELECT, INSERT, UPDATE ON contest_entries TO anon';
        EXECUTE 'GRANT ALL ON contest_entries TO service_role';
    END IF;
    
    -- Contest votes table grants
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contest_votes') THEN
        EXECUTE 'GRANT SELECT, INSERT ON contest_votes TO anon';
        EXECUTE 'GRANT ALL ON contest_votes TO service_role';
    END IF;
    
    -- Playback history table grants
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'playback_history') THEN
        EXECUTE 'GRANT SELECT, INSERT, UPDATE ON playback_history TO anon';
        EXECUTE 'GRANT ALL ON playback_history TO service_role';
    END IF;
    
    -- NFT bids table grants
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'nft_bids') THEN
        EXECUTE 'GRANT SELECT, INSERT, UPDATE ON nft_bids TO anon';
        EXECUTE 'GRANT ALL ON nft_bids TO service_role';
    END IF;
    
    -- NFT collections table grants
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'nft_collections') THEN
        EXECUTE 'GRANT SELECT, INSERT, UPDATE ON nft_collections TO anon';
        EXECUTE 'GRANT ALL ON nft_collections TO service_role';
    END IF;
    
    -- NFTs table grants
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'nfts') THEN
        EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON nfts TO anon';
        EXECUTE 'GRANT ALL ON nfts TO service_role';
    END IF;
    
    -- Tracks table grants
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tracks') THEN
        EXECUTE 'GRANT SELECT ON tracks TO anon';
        EXECUTE 'GRANT ALL ON tracks TO service_role';
    END IF;
    
    -- Playbacks table grants
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'playbacks') THEN
        EXECUTE 'GRANT SELECT, INSERT ON playbacks TO anon';
        EXECUTE 'GRANT ALL ON playbacks TO service_role';
    END IF;
END $$;

-- Create or replace the auth.uid() function to work with current UUID architecture
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS UUID
LANGUAGE SQL STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::UUID
$$;

-- Create a function to get Telegram ID from JWT for Telegram-specific operations
CREATE OR REPLACE FUNCTION auth.telegram_id()
RETURNS BIGINT
LANGUAGE SQL STABLE
AS $$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claims', true)::json->>'telegram_id', '')::BIGINT,
    0
  )
$$;

COMMIT;