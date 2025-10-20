# Create Playbacks Table Instructions

## Overview

This document provides detailed instructions for creating the playbacks table in the Supabase database for the TuneTON application.

## Prerequisites

1. Supabase CLI installed
2. Supabase project created
3. Supabase credentials configured

## Table Schema

The playbacks table tracks audio playback events in the TuneTON application. Here is the schema:

```sql
CREATE TABLE playbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Implementation Steps

### 1. Using Supabase SQL Editor

1. Navigate to your Supabase project dashboard
2. Go to the SQL Editor section
3. Run the following SQL command:

```sql
CREATE TABLE playbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_playbacks_track_id ON playbacks(track_id);
CREATE INDEX idx_playbacks_user_id ON playbacks(user_id);
CREATE INDEX idx_playbacks_created_at ON playbacks(created_at);
```

### 2. Using Supabase CLI

1. Create a new migration file:

   ```bash
   supabase migration new create_playbacks_table
   ```

2. Edit the generated migration file and add the SQL:

   ```sql
   CREATE TABLE playbacks (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     track_id TEXT NOT NULL,
     user_id UUID REFERENCES users(id),
     ip_address INET,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Create indexes for better query performance
   CREATE INDEX idx_playbacks_track_id ON playbacks(track_id);
   CREATE INDEX idx_playbacks_user_id ON playbacks(user_id);
   CREATE INDEX idx_playbacks_created_at ON playbacks(created_at);
   ```

3. Apply the migration:
   ```bash
   supabase db push
   ```

### 3. Using Supabase Dashboard

1. Navigate to your Supabase project dashboard
2. Go to the Table Editor section
3. Click "New Table"
4. Enter the following details:
   - Table name: `playbacks`
   - Columns:
     - `id`: UUID, Primary Key, Default: `gen_random_uuid()`
     - `track_id`: Text, Not Null
     - `user_id`: UUID, Foreign Key to `users.id`
     - `ip_address`: INET
     - `created_at`: Timestamp, Default: `NOW()`

5. Click "Save Changes"

## Row Level Security (RLS)

Enable Row Level Security for the playbacks table:

```sql
ALTER TABLE playbacks ENABLE ROW LEVEL SECURITY;
```

## Access Policies

Create policies for accessing the playbacks table:

```sql
-- Allow authenticated users to insert playbacks
CREATE POLICY "Users can insert their own playbacks"
ON playbacks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow service role to insert playbacks for any user
CREATE POLICY "Service role can insert playbacks"
ON playbacks FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow authenticated users to read their own playbacks
CREATE POLICY "Users can read their own playbacks"
ON playbacks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow service role to read all playbacks
CREATE POLICY "Service role can read all playbacks"
ON playbacks FOR SELECT
TO service_role
USING (true);
```

## Testing the Table

### 1. Insert Test Data

```sql
INSERT INTO playbacks (track_id, user_id, ip_address)
VALUES ('test-track-123', '00000000-0000-0000-0000-000000000000', '127.0.0.1');
```

### 2. Query Test Data

```sql
SELECT * FROM playbacks WHERE track_id = 'test-track-123';
```

## Integration with Application

### Backend Function

The playbacks table is used by the Supabase function for tracking playback events:

```typescript
// supabase/functions/playbacks/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { trackId } = await req.json();

    // Insert playback record
    const { data, error } = await supabase
      .from('playbacks')
      .insert({
        track_id: trackId,
        user_id: req.auth?.userId,
        ip_address: req.headers.get('x-forwarded-for') || req.conn.remoteAddr.hostname
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, playback: data }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
```

### Frontend Integration

The frontend calls the playbacks function when a track is played:

```typescript
// src/services/playbackService.ts
async function recordPlayback(trackId: string) {
  try {
    const response = await fetch('/functions/v1/playbacks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
      },
      body: JSON.stringify({ trackId })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error recording playback:', error);
    throw error;
  }
}
```

## Maintenance

### 1. Index Maintenance

Regularly monitor and maintain indexes for optimal performance:

```sql
-- Check index usage
SELECT * FROM pg_stat_user_indexes WHERE relname = 'playbacks';
```

### 2. Data Archiving

For large datasets, consider archiving old playback data:

```sql
-- Archive playbacks older than 1 year
CREATE TABLE playbacks_archive AS
SELECT * FROM playbacks WHERE created_at < NOW() - INTERVAL '1 year';

-- Delete archived records
DELETE FROM playbacks WHERE created_at < NOW() - INTERVAL '1 year';
```

## Troubleshooting

### Common Issues

1. **Foreign Key Constraint Violation**
   - Ensure the `users` table exists and has the referenced user ID
   - Check that the `user_id` format is correct (UUID)

2. **Permission Denied**
   - Verify that RLS policies are correctly configured
   - Check that the user has appropriate permissions

3. **Index Performance Issues**
   - Monitor query performance
   - Consider adding additional indexes for frequently queried columns

## Conclusion

This document provides comprehensive instructions for creating and maintaining the playbacks table in the TuneTON application. By following these steps, you can successfully implement playback tracking functionality with proper security and performance considerations.
