-- Update track statistics handling to ensure proper data management
-- This migration creates functions and triggers to automatically update track statistics
-- and provides safe fallback handling for missing data scenarios

-- Create a function to safely increment track play count
-- This function updates the play_count in the tracks table when playbacks are updated
CREATE OR REPLACE FUNCTION update_track_play_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the play_count in the tracks table
  UPDATE tracks 
  SET play_count = play_count + NEW.count,
      updated_at = NOW()
  WHERE id = NEW.track_id;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't stop execution
  RAISE WARNING 'Failed to update play count for track %: %', NEW.track_id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update track play count when playbacks are inserted or updated
DROP TRIGGER IF EXISTS trigger_update_track_play_count ON playbacks;
CREATE TRIGGER trigger_update_track_play_count
  AFTER INSERT OR UPDATE ON playbacks
  FOR EACH ROW
  EXECUTE FUNCTION update_track_play_count();

-- Create a function to safely get track statistics with fallback for missing data
CREATE OR REPLACE FUNCTION get_track_statistics_with_fallback(track_id BIGINT)
RETURNS TABLE(
  play_count INTEGER,
  like_count INTEGER,
  remix_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(t.play_count, 0) as play_count,
    COALESCE(t.like_count, 0) as like_count,
    COALESCE(t.remix_count, 0) as remix_count
  FROM tracks t
  WHERE t.id = track_id;
EXCEPTION WHEN OTHERS THEN
  -- Return default values when there's an error
  RETURN QUERY SELECT 0 as play_count, 0 as like_count, 0 as remix_count;
END;
$$ LANGUAGE plpgsql;

-- Create a function to handle missing track data gracefully
CREATE OR REPLACE FUNCTION handle_missing_track_data(track_id BIGINT)
RETURNS TEXT AS $$
BEGIN
  -- Check if track exists
  IF EXISTS (SELECT 1 FROM tracks WHERE id = track_id) THEN
    RETURN 'Data not available';
  ELSE
    RETURN 'Track not found';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RETURN 'No data available';
END;
$$ LANGUAGE plpgsql;

-- Create a function to safely update track ratings (if we add rating functionality later)
CREATE OR REPLACE FUNCTION update_track_rating(track_id BIGINT, rating DECIMAL)
RETURNS BOOLEAN AS $$
BEGIN
  -- This is a placeholder for future rating functionality
  -- Currently just returns true to indicate success
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Add comments to document the functions
COMMENT ON FUNCTION update_track_play_count() IS 'Updates track play count when playbacks are inserted or updated';
COMMENT ON FUNCTION get_track_statistics_with_fallback(BIGINT) IS 'Safely retrieves track statistics with fallback for missing data';
COMMENT ON FUNCTION handle_missing_track_data(BIGINT) IS 'Provides user-friendly messages for missing track data';
COMMENT ON FUNCTION update_track_rating(BIGINT, DECIMAL) IS 'Placeholder for track rating functionality';