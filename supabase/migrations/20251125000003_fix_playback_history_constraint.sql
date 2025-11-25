-- Fix playback_history table constraint to properly reference users
BEGIN;

-- First, clean up any invalid data
DELETE FROM playback_history 
WHERE user_id IS NULL OR user_id NOT IN (SELECT telegram_id FROM users);

-- Drop existing constraint
ALTER TABLE playback_history DROP CONSTRAINT IF EXISTS playback_history_user_id_fkey;

-- Add the correct foreign key referencing users.telegram_id (BIGINT)
ALTER TABLE playback_history 
    ADD CONSTRAINT playback_history_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES users(telegram_id) 
    ON DELETE CASCADE;

COMMIT;