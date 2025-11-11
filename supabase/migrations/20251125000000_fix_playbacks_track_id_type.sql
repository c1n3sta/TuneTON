-- Fix playbacks table track_id data type to match tracks.id
BEGIN;

-- Drop existing constraint
ALTER TABLE playbacks DROP CONSTRAINT IF EXISTS playbacks_track_id_fkey;

-- Alter column type
ALTER TABLE playbacks ALTER COLUMN track_id TYPE BIGINT USING track_id::BIGINT;

-- Recreate foreign key constraint
ALTER TABLE playbacks 
  ADD CONSTRAINT playbacks_track_id_fkey 
  FOREIGN KEY (track_id) 
  REFERENCES tracks(id) 
  ON DELETE CASCADE;

COMMIT;