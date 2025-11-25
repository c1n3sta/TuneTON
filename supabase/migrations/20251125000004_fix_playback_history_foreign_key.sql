-- Fix playback_history table to properly reference users
BEGIN;

-- Drop existing constraint
ALTER TABLE playback_history DROP CONSTRAINT IF EXISTS playback_history_user_id_fkey;

-- Add the correct foreign key referencing users.telegram_id (BIGINT)
ALTER TABLE playback_history 
    ADD CONSTRAINT playback_history_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES users(telegram_id) 
    ON DELETE CASCADE;

COMMIT;
