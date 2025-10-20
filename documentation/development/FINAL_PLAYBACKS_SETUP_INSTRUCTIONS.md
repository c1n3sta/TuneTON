# Final Playbacks Setup Instructions

## Overview

This document provides detailed instructions for setting up the playbacks tracking system in the TuneTON application. This system records and tracks user interactions with music tracks.

## Prerequisites

1. Supabase project with database access
2. Database tables created (tracks and playbacks)
3. Supabase Edge Functions deployed
4. Environment variables configured

## Database Setup

### 1. Create Playbacks Table

If not already created, run the following SQL command in your Supabase SQL editor:

```sql
CREATE TABLE playbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id TEXT REFERENCES tracks(id) ON DELETE CASCADE,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Create Indexes for Performance

```sql
CREATE INDEX IF NOT EXISTS idx_playbacks_track_id ON playbacks(track_id);
CREATE INDEX IF NOT EXISTS idx_playbacks_created_at ON playbacks(created_at);
```

### 3. Enable Row Level Security (RLS)

```sql
ALTER TABLE playbacks ENABLE ROW LEVEL SECURITY;
```

### 4. Create Access Policies

```sql
-- Allow anyone to insert playbacks (for tracking)
CREATE POLICY "Anyone can insert playbacks" ON playbacks
  FOR INSERT WITH CHECK (true);

-- Allow public read access to playbacks
CREATE POLICY "Public playbacks are viewable by everyone" ON playbacks
  FOR SELECT USING (true);

-- Grant necessary permissions
GRANT SELECT, INSERT ON playbacks TO anon;
GRANT USAGE ON SEQUENCE playbacks_id_seq TO anon;
```

## Function Implementation

### 1. Playbacks Edge Function

Ensure the playbacks Edge Function is properly implemented at `supabase/functions/playbacks/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // Get all playbacks
  if (_req.method === 'GET') {
    const { data, error } = await supabase
      .from('playbacks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }

  // Record a new playback
  if (_req.method === 'POST') {
    const { track_id } = await _req.json();

    // Check if a playback record already exists for this track
    const { data: existingPlayback, error: fetchError } = await supabase
      .from('playbacks')
      .select('id, count')
      .eq('track_id', track_id)
      .maybeSingle();

    if (fetchError) {
      return new Response(JSON.stringify({ error: fetchError.message }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }

    if (existingPlayback) {
      // Update existing playback count
      const { data, error } = await supabase
        .from('playbacks')
        .update({ count: existingPlayback.count + 1, updated_at: new Date() })
        .eq('id', existingPlayback.id)
        .select();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { "Content-Type": "application/json" },
          status: 500,
        });
      }

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      // Create new playback record
      const { data, error } = await supabase
        .from('playbacks')
        .insert([{ track_id, count: 1 }])
        .select();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { "Content-Type": "application/json" },
          status: 500,
        });
      }

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        status: 201,
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    headers: { "Content-Type": "application/json" },
    status: 405,
  });
});
```

## Frontend Integration

### 1. Update Environment Variables

Ensure your frontend environment variables are correctly configured:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=https://your-project.supabase.co/functions/v1
```

### 2. Playback Tracking Implementation

In your frontend code, implement playback tracking:

```typescript
// Function to record a playback event
const recordPlayback = async (trackId: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/playbacks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ track_id: trackId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Playback recorded:', data);
  } catch (error) {
    console.error('Error recording playback:', error);
  }
};

// Call this function when a track is played
// For example, in your audio player component:
const handlePlay = (trackId: string) => {
  // Play the track
  playTrack(trackId);

  // Record the playback
  recordPlayback(trackId);
};
```

## Testing

### 1. Manual Testing

1. Start your frontend application
2. Navigate to a track page
3. Play the track
4. Check the Supabase dashboard to verify the playback was recorded
5. Play the same track again to verify the count increments

### 2. API Testing

Test the playbacks API directly:

```bash
# Record a playback
curl -X POST https://your-project.supabase.co/functions/v1/playbacks \
  -H "Content-Type: application/json" \
  -d '{"track_id": "your-track-id"}'

# Get all playbacks
curl https://your-project.supabase.co/functions/v1/playbacks
```

## Monitoring

### 1. Database Monitoring

Monitor the playbacks table in the Supabase dashboard:

1. Check row count growth
2. Monitor query performance
3. Watch for any errors

### 2. Function Monitoring

Monitor the playbacks function:

1. Check function logs in the Supabase dashboard
2. Monitor execution times
3. Watch for error rates

## Troubleshooting

### Common Issues

1. **Playback Not Recording**
   - Check that the track_id is being passed correctly
   - Verify the playbacks function is deployed
   - Check function logs for errors

2. **Database Connection Issues**
   - Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
   - Check that the playbacks table exists
   - Verify RLS policies are correctly configured

3. **CORS Errors**
   - Ensure the API_BASE_URL is correctly configured
   - Check that the function is returning proper CORS headers

### Debugging Steps

1. Check browser console for JavaScript errors
2. Check Supabase function logs
3. Verify database table structure
4. Test API endpoints directly with curl

## Maintenance

### Regular Tasks

1. **Database Cleanup**
   - Periodically archive old playback records
   - Monitor database size growth

2. **Performance Monitoring**
   - Check function execution times
   - Monitor database query performance
   - Optimize indexes as needed

3. **Security Updates**
   - Regularly review access policies
   - Update dependencies in functions
   - Monitor for security vulnerabilities

## Conclusion

The playbacks tracking system is now fully set up and operational. This system will track user interactions with music tracks, providing valuable data for understanding user behavior and preferences.

The implementation follows best practices for serverless architecture, with proper error handling, security considerations, and monitoring capabilities.
