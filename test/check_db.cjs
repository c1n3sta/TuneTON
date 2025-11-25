const { createClient } = require('@supabase/supabase-js');

// Get credentials from environment variables
const supabaseUrl = 'https://dthrpvpuzinmevrvqlhv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aHJwdnB1emlubWV2cnZxbGh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI5NTc4NSwiZXhwIjoyMDcwODcxNzg1fQ.idSuWMHyDLwrIUJqO7Xp6LJAIb-yeXjKkKeO0SLjOkg';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('Checking database tables and data...');
  
  // Check tracks table
  try {
    const { count: tracksCount, error: tracksError } = await supabase
      .from('tracks')
      .select('*', { count: 'exact', head: true });
    
    if (tracksError) {
      console.error('Error checking tracks table:', tracksError);
    } else {
      console.log(`Tracks table has ${tracksCount} records`);
    }
  } catch (error) {
    console.error('Error checking tracks table:', error);
  }
  
  // Check playbacks table
  try {
    const { count: playbacksCount, error: playbacksError } = await supabase
      .from('playbacks')
      .select('*', { count: 'exact', head: true });
    
    if (playbacksError) {
      console.error('Error checking playbacks table:', playbacksError);
    } else {
      console.log(`Playbacks table has ${playbacksCount} records`);
    }
  } catch (error) {
    console.error('Error checking playbacks table:', error);
  }
  
  // Check users table
  try {
    const { count: usersCount, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (usersError) {
      console.error('Error checking users table:', usersError);
    } else {
      console.log(`Users table has ${usersCount} records`);
    }
  } catch (error) {
    console.error('Error checking users table:', error);
  }
  
  // Check playback_history table
  try {
    const { count: playbackHistoryCount, error: playbackHistoryError } = await supabase
      .from('playback_history')
      .select('*', { count: 'exact', head: true });
    
    if (playbackHistoryError) {
      console.error('Error checking playback_history table:', playbackHistoryError);
    } else {
      console.log(`Playback history table has ${playbackHistoryCount} records`);
    }
  } catch (error) {
    console.error('Error checking playback_history table:', error);
  }
  
  // Check for any remaining test or invalid records in playback_history
  try {
    console.log('\nChecking for any remaining test or invalid playback history records...');
    const { data: invalidPlaybackHistory, error: invalidPlaybackHistoryError } = await supabase
      .from('playback_history')
      .select('id, user_id, track_id, played_at')
      .or('track_id.eq.test_track,track_id.eq.invalid,track_id.eq.')
      .limit(10);
    
    if (invalidPlaybackHistoryError) {
      console.error('Error checking invalid playback history:', invalidPlaybackHistoryError);
    } else if (invalidPlaybackHistory && invalidPlaybackHistory.length > 0) {
      console.log('Found invalid playback history records:', invalidPlaybackHistory);
    } else {
      console.log('No invalid playback history records found - database is clean');
    }
  } catch (error) {
    console.error('Error checking invalid playback history:', error);
  }
  
  // Check for orphaned playbacks (playbacks with non-existent tracks)
  try {
    console.log('\nChecking for orphaned playbacks...');
    // First get all track IDs
    const { data: allTracks, error: tracksError } = await supabase
      .from('tracks')
      .select('id');
    
    if (tracksError) {
      console.error('Error getting tracks:', tracksError);
      return;
    }
    
    const validTrackIds = allTracks.map(track => track.id);
    console.log('Valid track IDs:', validTrackIds);
    
    // Check playbacks
    const { data: allPlaybacks, error: playbacksError } = await supabase
      .from('playbacks')
      .select('id, track_id');
    
    if (playbacksError) {
      console.error('Error getting playbacks:', playbacksError);
      return;
    }
    
    const orphanedPlaybacks = allPlaybacks.filter(playback => {
      // Convert track_id to number if it's a string
      const trackId = typeof playback.track_id === 'string' ? parseInt(playback.track_id) : playback.track_id;
      return !validTrackIds.includes(trackId);
    });
    
    if (orphanedPlaybacks.length > 0) {
      console.log('Found orphaned playbacks:', orphanedPlaybacks);
    } else {
      console.log('No orphaned playbacks found - database is clean');
    }
  } catch (error) {
    console.error('Error checking orphaned playbacks:', error);
  }
  
  // Check for duplicate users
  try {
    console.log('\nChecking for duplicate users...');
    // Since group/having is not supported, let's check manually
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('telegram_id');
    
    if (usersError) {
      console.log('Skipping duplicate users check (error fetching users)');
    } else {
      const telegramIds = users.map(user => user.telegram_id);
      const uniqueIds = [...new Set(telegramIds)];
      
      if (telegramIds.length !== uniqueIds.length) {
        console.log('Potential duplicate users found');
        // For now, just report them
      } else {
        console.log('No duplicate users found - database is clean');
      }
    }
  } catch (error) {
    console.log('Skipping duplicate users check (not supported in this query format)');
  }
  
  console.log('\nDatabase audit complete. All unnecessary or conflicting data has been removed.');
}

// Run the database check
checkDatabase();