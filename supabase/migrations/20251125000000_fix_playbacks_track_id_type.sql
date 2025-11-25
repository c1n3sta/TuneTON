-- Fix playbacks table track_id column type to match tracks.id
-- The tracks table uses BIGINT for id, but playbacks table was using UUID for track_id
BEGIN;

-- Drop existing foreign key constraint
ALTER TABLE IF EXISTS playbacks DROP CONSTRAINT IF EXISTS playbacks_track_id_fkey;

-- Change track_id column type from UUID to BIGINT
ALTER TABLE IF EXISTS playbacks 
  ALTER COLUMN track_id TYPE BIGINT 
  USING track_id::TEXT::BIGINT;

-- Recreate foreign key constraint with correct types
ALTER TABLE IF EXISTS playbacks 
  ADD CONSTRAINT playbacks_track_id_fkey 
  FOREIGN KEY (track_id) 
  REFERENCES tracks(id) 
  ON DELETE CASCADE;

COMMIT;