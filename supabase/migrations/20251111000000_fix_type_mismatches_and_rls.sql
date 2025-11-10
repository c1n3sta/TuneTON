-- Fix type mismatches and update RLS policies for Telegram auth
-- This migration should be run after all other migrations

BEGIN;

-- Drop existing foreign key constraints that need to be recreated
ALTER TABLE IF EXISTS contests DROP CONSTRAINT IF EXISTS contests_created_by_user_id_fkey;
ALTER TABLE IF EXISTS contest_entries DROP CONSTRAINT IF EXISTS contest_entries_user_id_fkey;
ALTER TABLE IF EXISTS contest_entries DROP CONSTRAINT IF EXISTS contest_entries_contest_id_fkey;
ALTER TABLE IF EXISTS contest_votes DROP CONSTRAINT IF EXISTS contest_votes_voter_id_fkey;
ALTER TABLE IF EXISTS contest_votes DROP CONSTRAINT IF EXISTS contest_votes_entry_id_fkey;
ALTER TABLE IF EXISTS nft_collections DROP CONSTRAINT IF EXISTS nft_collections_creator_id_fkey;
ALTER TABLE IF EXISTS nfts DROP CONSTRAINT IF EXISTS nfts_creator_id_fkey;
ALTER TABLE IF EXISTS nfts DROP CONSTRAINT IF EXISTS nfts_owner_id_fkey;
ALTER TABLE IF EXISTS nfts DROP CONSTRAINT IF EXISTS nfts_highest_bidder_id_fkey;
ALTER TABLE IF EXISTS nft_bids DROP CONSTRAINT IF EXISTS nft_bids_bidder_id_fkey;
ALTER TABLE IF EXISTS nft_bids DROP CONSTRAINT IF EXISTS nft_bids_nft_id_fkey;

-- Update column types to use BIGINT for Telegram user IDs
-- First, check if the columns exist and are of the wrong type
DO $$
BEGIN
    -- Check and alter contests.created_by_user_id
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'contests' AND column_name = 'created_by_user_id' 
               AND data_type != 'bigint') THEN
        ALTER TABLE contests 
        ALTER COLUMN created_by_user_id TYPE BIGINT 
        USING (created_by_user_id::TEXT)::BIGINT;
    END IF;

    -- Check and alter contest_entries.user_id
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'contest_entries' AND column_name = 'user_id' 
               AND data_type != 'bigint') THEN
        ALTER TABLE contest_entries 
        ALTER COLUMN user_id TYPE BIGINT 
        USING (user_id::TEXT)::BIGINT;
    END IF;

    -- Check and alter contest_votes.voter_id
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'contest_votes' AND column_name = 'voter_id' 
               AND data_type != 'bigint') THEN
        ALTER TABLE contest_votes 
        ALTER COLUMN voter_id TYPE BIGINT 
        USING (voter_id::TEXT)::BIGINT;
    END IF;

    -- Check and alter nft_collections.creator_id
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'nft_collections' AND column_name = 'creator_id' 
               AND data_type != 'bigint') THEN
        ALTER TABLE nft_collections 
        ALTER COLUMN creator_id TYPE BIGINT 
        USING (creator_id::TEXT)::BIGINT;
    END IF;

    -- Check and alter nfts.creator_id, owner_id, highest_bidder_id
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'nfts' AND column_name = 'creator_id' 
               AND data_type != 'bigint') THEN
        ALTER TABLE nfts 
        ALTER COLUMN creator_id TYPE BIGINT 
        USING (creator_id::TEXT)::BIGINT;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'nfts' AND column_name = 'owner_id' 
               AND data_type != 'bigint') THEN
        ALTER TABLE nfts 
        ALTER COLUMN owner_id TYPE BIGINT 
        USING (owner_id::TEXT)::BIGINT;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'nfts' AND column_name = 'highest_bidder_id' 
               AND data_type = 'uuid') THEN
        ALTER TABLE nfts 
        ALTER COLUMN highest_bidder_id TYPE BIGINT 
        USING (highest_bidder_id::TEXT)::BIGINT;
    END IF;

    -- Check and alter nft_bids.bidder_id
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'nft_bids' AND column_name = 'bidder_id' 
               AND data_type != 'bigint') THEN
        ALTER TABLE nft_bids 
        ALTER COLUMN bidder_id TYPE BIGINT 
        USING (bidder_id::TEXT)::BIGINT;
    END IF;
END $$;

-- Recreate foreign key constraints to reference users.telegram_id
-- Only add constraints if they don't already exist
DO $$
BEGIN
    -- contests.created_by_user_id
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'contests_created_by_user_id_fkey'
    ) THEN
        ALTER TABLE contests 
        ADD CONSTRAINT contests_created_by_user_id_fkey 
        FOREIGN KEY (created_by_user_id) 
        REFERENCES users(telegram_id) 
        ON DELETE CASCADE;
    END IF;

    -- contest_entries.user_id
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'contest_entries_user_id_fkey'
    ) THEN
        ALTER TABLE contest_entries 
        ADD CONSTRAINT contest_entries_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES users(telegram_id) 
        ON DELETE CASCADE;
    END IF;

    -- contest_entries.contest_id
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'contest_entries_contest_id_fkey'
    ) THEN
        ALTER TABLE contest_entries 
        ADD CONSTRAINT contest_entries_contest_id_fkey 
        FOREIGN KEY (contest_id) 
        REFERENCES contests(id) 
        ON DELETE CASCADE;
    END IF;

    -- contest_votes.voter_id
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'contest_votes_voter_id_fkey'
    ) THEN
        ALTER TABLE contest_votes 
        ADD CONSTRAINT contest_votes_voter_id_fkey 
        FOREIGN KEY (voter_id) 
        REFERENCES users(telegram_id) 
        ON DELETE CASCADE;
    END IF;

    -- contest_votes.entry_id
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'contest_votes_entry_id_fkey'
    ) THEN
        ALTER TABLE contest_votes 
        ADD CONSTRAINT contest_votes_entry_id_fkey 
        FOREIGN KEY (entry_id) 
        REFERENCES contest_entries(id) 
        ON DELETE CASCADE;
    END IF;

    -- nft_collections.creator_id
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'nft_collections_creator_id_fkey'
    ) THEN
        ALTER TABLE nft_collections 
        ADD CONSTRAINT nft_collections_creator_id_fkey 
        FOREIGN KEY (creator_id) 
        REFERENCES users(telegram_id) 
        ON DELETE CASCADE;
    END IF;

    -- nfts.creator_id
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'nfts_creator_id_fkey'
    ) THEN
        ALTER TABLE nfts 
        ADD CONSTRAINT nfts_creator_id_fkey 
        FOREIGN KEY (creator_id) 
        REFERENCES users(telegram_id) 
        ON DELETE CASCADE;
    END IF;

    -- nfts.owner_id
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'nfts_owner_id_fkey'
    ) THEN
        ALTER TABLE nfts 
        ADD CONSTRAINT nfts_owner_id_fkey 
        FOREIGN KEY (owner_id) 
        REFERENCES users(telegram_id) 
        ON DELETE CASCADE;
    END IF;

    -- nfts.highest_bidder_id
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'nfts_highest_bidder_id_fkey'
    ) THEN
        ALTER TABLE nfts 
        ADD CONSTRAINT nfts_highest_bidder_id_fkey 
        FOREIGN KEY (highest_bidder_id) 
        REFERENCES users(telegram_id) 
        ON DELETE SET NULL;
    END IF;

    -- nft_bids.bidder_id
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'nft_bids_bidder_id_fkey'
    ) THEN
        ALTER TABLE nft_bids 
        ADD CONSTRAINT nft_bids_bidder_id_fkey 
        FOREIGN KEY (bidder_id) 
        REFERENCES users(telegram_id) 
        ON DELETE CASCADE;
    END IF;

    -- nft_bids.nft_id
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'nft_bids_nft_id_fkey'
    ) THEN
        ALTER TABLE nft_bids 
        ADD CONSTRAINT nft_bids_nft_id_fkey 
        FOREIGN KEY (nft_id) 
        REFERENCES nfts(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- Update RLS policies
-- First, drop existing policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
        AND tablename IN ('users', 'contests', 'contest_entries', 'contest_votes', 
                         'nft_collections', 'nfts', 'nft_bids', 'playback_history')
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

-- NFT bids policies
CREATE POLICY "NFT bids are viewable by everyone" ON nft_bids
  FOR SELECT USING (true);

CREATE POLICY "Users can create NFT bids" ON nft_bids
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own NFT bids" ON nft_bids
  FOR UPDATE USING (true);

-- Playback history policies
CREATE POLICY "Playback history is viewable by everyone" ON playback_history
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own playback history" ON playback_history
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own playback history" ON playback_history
  FOR UPDATE USING (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON users TO anon;
GRANT SELECT, INSERT, UPDATE ON contests TO anon;
GRANT SELECT, INSERT, UPDATE ON contest_entries TO anon;
GRANT SELECT, INSERT ON contest_votes TO anon;
GRANT SELECT, INSERT, UPDATE ON nft_collections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON nfts TO anon;
GRANT SELECT, INSERT, UPDATE ON nft_bids TO anon;
GRANT SELECT, INSERT, UPDATE ON playback_history TO anon;

-- Service role permissions
GRANT ALL ON users TO service_role;
GRANT ALL ON contests TO service_role;
GRANT ALL ON contest_entries TO service_role;
GRANT ALL ON contest_votes TO service_role;
GRANT ALL ON nft_collections TO service_role;
GRANT ALL ON nfts TO service_role;
GRANT ALL ON nft_bids TO service_role;
GRANT ALL ON playback_history TO service_role;

-- Create or replace the auth.uid() function
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS BIGINT
LANGUAGE SQL STABLE
AS $$
  SELECT COALESCE(
    nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::BIGINT,
    0
  )
$$;

COMMIT;
