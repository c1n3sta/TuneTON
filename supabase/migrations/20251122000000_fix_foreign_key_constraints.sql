-- Fix foreign key constraints to use consistent UUID references
BEGIN;

-- Drop existing incorrect foreign key constraints if they exist
ALTER TABLE IF EXISTS nfts DROP CONSTRAINT IF EXISTS nfts_creator_id_fkey;
ALTER TABLE IF EXISTS nfts DROP CONSTRAINT IF EXISTS nfts_owner_id_fkey;
ALTER TABLE IF EXISTS nfts DROP CONSTRAINT IF EXISTS nfts_highest_bidder_id_fkey;
ALTER TABLE IF EXISTS nft_bids DROP CONSTRAINT IF EXISTS nft_bids_bidder_id_fkey;
ALTER TABLE IF EXISTS nft_collections DROP CONSTRAINT IF EXISTS nft_collections_creator_id_fkey;
ALTER TABLE IF EXISTS contests DROP CONSTRAINT IF EXISTS contests_created_by_user_id_fkey;
ALTER TABLE IF EXISTS contest_entries DROP CONSTRAINT IF EXISTS contest_entries_user_id_fkey;
ALTER TABLE IF EXISTS contest_votes DROP CONSTRAINT IF EXISTS contest_votes_voter_id_fkey;
ALTER TABLE IF EXISTS playbacks DROP CONSTRAINT IF EXISTS playbacks_track_id_fkey;

-- Recreate foreign key constraints with correct references to users.id (UUID)
ALTER TABLE IF EXISTS nfts 
  ADD CONSTRAINT nfts_creator_id_fkey 
  FOREIGN KEY (creator_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

ALTER TABLE IF EXISTS nfts 
  ADD CONSTRAINT nfts_owner_id_fkey 
  FOREIGN KEY (owner_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

ALTER TABLE IF EXISTS nfts 
  ADD CONSTRAINT nfts_highest_bidder_id_fkey 
  FOREIGN KEY (highest_bidder_id) 
  REFERENCES users(id) 
  ON DELETE SET NULL;

ALTER TABLE IF EXISTS nft_bids 
  ADD CONSTRAINT nft_bids_bidder_id_fkey 
  FOREIGN KEY (bidder_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

ALTER TABLE IF EXISTS nft_collections 
  ADD CONSTRAINT nft_collections_creator_id_fkey 
  FOREIGN KEY (creator_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

ALTER TABLE IF EXISTS contests 
  ADD CONSTRAINT contests_created_by_user_id_fkey 
  FOREIGN KEY (created_by_user_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

ALTER TABLE IF EXISTS contest_entries 
  ADD CONSTRAINT contest_entries_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

ALTER TABLE IF EXISTS contest_votes 
  ADD CONSTRAINT contest_votes_voter_id_fkey 
  FOREIGN KEY (voter_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

ALTER TABLE IF EXISTS playbacks 
  ADD CONSTRAINT playbacks_track_id_fkey 
  FOREIGN KEY (track_id) 
  REFERENCES tracks(id) 
  ON DELETE CASCADE;

COMMIT;