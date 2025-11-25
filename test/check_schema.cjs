const { createClient } = require('@supabase/supabase-js');

// Get credentials from environment variables
const supabaseUrl = 'https://dthrpvpuzinmevrvqlhv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aHJwdnB1emlubWV2cnZxbGh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI5NTc4NSwiZXhwIjoyMDcwODcxNzg1fQ.idSuWMHyDLwrIUJqO7Xp6LJAIb-yeXjKkKeO0SLjOkg';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('Checking database schema for track ID type inconsistencies...');
  
  try {
    // Check tracks table schema
    console.log('\n=== TRACKS TABLE ===');
    const { data: tracksData, error: tracksError } = await supabase
      .from('tracks')
      .select('id')
      .limit(1);
    
    if (tracksError) {
      console.error('Error querying tracks table:', tracksError);
    } else {
      console.log('Tracks table accessible, sample record:', tracksData[0]);
    }
    
    // Check playbacks table schema
    console.log('\n=== PLAYBACKS TABLE ===');
    const { data: playbacksData, error: playbacksError } = await supabase
      .from('playbacks')
      .select('id, track_id')
      .limit(1);
    
    if (playbacksError) {
      console.error('Error querying playbacks table:', playbacksError);
    } else {
      console.log('Playbacks table accessible, sample record:', playbacksData[0]);
      console.log('Track ID type in playbacks:', typeof playbacksData[0].track_id);
    }
    
    // Check playback_history table schema
    console.log('\n=== PLAYBACK_HISTORY TABLE ===');
    const { data: historyData, error: historyError } = await supabase
      .from('playback_history')
      .select('id, track_id')
      .limit(1);
    
    if (historyError) {
      console.error('Error querying playback_history table:', historyError);
    } else if (historyData && historyData.length > 0) {
      console.log('Playback history table accessible, sample record:', historyData[0]);
      console.log('Track ID type in playback_history:', typeof historyData[0].track_id);
    } else {
      console.log('Playback history table is empty');
    }
    
    // Check for any type mismatches between tracks.id and playbacks.track_id
    console.log('\n=== TYPE CONSISTENCY CHECK ===');
    
    // Get a few records from each table to compare types
    const { data: trackRecords, error: trackRecordsError } = await supabase
      .from('tracks')
      .select('id')
      .limit(3);
    
    if (trackRecordsError) {
      console.error('Error getting track records:', trackRecordsError);
    } else {
      console.log('Track IDs (tracks table):', trackRecords.map(t => ({id: t.id, type: typeof t.id})));
    }
    
    const { data: playbackRecords, error: playbackRecordsError } = await supabase
      .from('playbacks')
      .select('track_id')
      .limit(3);
    
    if (playbackRecordsError) {
      console.error('Error getting playback records:', playbackRecordsError);
    } else {
      console.log('Track IDs (playbacks table):', playbackRecords.map(p => ({id: p.track_id, type: typeof p.track_id})));
    }
    
    console.log('\nSchema check complete.');
    
  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

checkSchema();