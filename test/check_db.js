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
    const { data: tracks, error: tracksError } = await supabase
      .from('tracks')
      .select('count()', { count: 'exact' });
    
    if (tracksError) {
      console.error('Error checking tracks table:', tracksError);
    } else {
      console.log(`Tracks table has ${tracks[0].count} records`);
    }
  } catch (error) {
    console.error('Error checking tracks table:', error);
  }
  
  // Check playbacks table
  try {
    const { data: playbacks, error: playbacksError } = await supabase
      .from('playbacks')
      .select('count()', { count: 'exact' });
    
    if (playbacksError) {
      console.error('Error checking playbacks table:', playbacksError);
    } else {
      console.log(`Playbacks table has ${playbacks[0].count} records`);
    }
  } catch (error) {
    console.error('Error checking playbacks table:', error);
  }
  
  // Check users table
  try {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count()', { count: 'exact' });
    
    if (usersError) {
      console.error('Error checking users table:', usersError);
    } else {
      console.log(`Users table has ${users[0].count} records`);
    }
  } catch (error) {
    console.error('Error checking users table:', error);
  }
  
  // Check playback_history table
  try {
    const { data: playbackHistory, error: playbackHistoryError } = await supabase
      .from('playback_history')
      .select('count()', { count: 'exact' });
    
    if (playbackHistoryError) {
      console.error('Error checking playback_history table:', playbackHistoryError);
    } else {
      console.log(`Playback history table has ${playbackHistory[0].count} records`);
    }
  } catch (error) {
    console.error('Error checking playback_history table:', error);
  }
  
  // Check for any duplicate or problematic entries in tracks table
  try {
    console.log('\nChecking for duplicate tracks...');
    const { data: duplicateTracks, error: duplicateError } = await supabase
      .from('tracks')
      .select('id, title, count(id)')
      .group('id, title')
      .having('count(id)', '>', 1)
      .limit(10);
    
    if (duplicateError) {
      console.error('Error checking for duplicate tracks:', duplicateError);
    } else if (duplicateTracks && duplicateTracks.length > 0) {
      console.log('Found duplicate tracks:', duplicateTracks);
    } else {
      console.log('No duplicate tracks found');
    }
  } catch (error) {
    console.error('Error checking for duplicate tracks:', error);
  }
  
  // Check for any orphaned records in playbacks table
  try {
    console.log('\nChecking for orphaned playbacks (playbacks with non-existent tracks)...');
    const { data: orphanedPlaybacks, error: orphanedError } = await supabase
      .from('playbacks')
      .select('id, track_id')
      .limit(10);
    
    if (orphanedError) {
      console.error('Error checking for orphaned playbacks:', orphanedError);
    } else {
      console.log(`Checked playbacks records, found ${orphanedPlaybacks.length} sample records`);
    }
  } catch (error) {
    console.error('Error checking for orphaned playbacks:', error);
  }
}

checkDatabase();