# Detailed Remediation Steps for TuneTON 3.0

## Phase 1: Critical Fixes (Weeks 1-2)

### Task 1: Fix Database Schema Inconsistencies

#### Step 1: Backup Current Database
```bash
# Create a backup of the current database schema
npx supabase db dump --local --file backup-before-fix.sql
```

#### Step 2: Analyze Current Schema
```sql
-- Check current foreign key constraints
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema = 'public' 
  AND tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('nfts', 'nft_collections', 'nft_bids', 'contests', 'contest_entries', 'contest_votes');
```

#### Step 3: Create Corrective Migration
Create a new migration file `supabase/migrations/20251122000000_fix_foreign_key_constraints.sql`:

```sql
-- Fix foreign key constraints to use consistent UUID references
BEGIN;

-- Drop existing incorrect foreign key constraints
ALTER TABLE nfts DROP CONSTRAINT IF EXISTS nfts_creator_id_fkey;
ALTER TABLE nfts DROP CONSTRAINT IF EXISTS nfts_owner_id_fkey;
ALTER TABLE nfts DROP CONSTRAINT IF EXISTS nfts_highest_bidder_id_fkey;
ALTER TABLE nft_bids DROP CONSTRAINT IF EXISTS nft_bids_bidder_id_fkey;
ALTER TABLE nft_collections DROP CONSTRAINT IF EXISTS nft_collections_creator_id_fkey;
ALTER TABLE contests DROP CONSTRAINT IF EXISTS contests_created_by_user_id_fkey;
ALTER TABLE contest_entries DROP CONSTRAINT IF EXISTS contest_entries_user_id_fkey;
ALTER TABLE contest_votes DROP CONSTRAINT IF EXISTS contest_votes_voter_id_fkey;

-- Recreate foreign key constraints with correct references to users.id (UUID)
ALTER TABLE nfts 
  ADD CONSTRAINT nfts_creator_id_fkey 
  FOREIGN KEY (creator_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

ALTER TABLE nfts 
  ADD CONSTRAINT nfts_owner_id_fkey 
  FOREIGN KEY (owner_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

ALTER TABLE nfts 
  ADD CONSTRAINT nfts_highest_bidder_id_fkey 
  FOREIGN KEY (highest_bidder_id) 
  REFERENCES users(id) 
  ON DELETE SET NULL;

ALTER TABLE nft_bids 
  ADD CONSTRAINT nft_bids_bidder_id_fkey 
  FOREIGN KEY (bidder_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

ALTER TABLE nft_collections 
  ADD CONSTRAINT nft_collections_creator_id_fkey 
  FOREIGN KEY (creator_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

ALTER TABLE contests 
  ADD CONSTRAINT contests_created_by_user_id_fkey 
  FOREIGN KEY (created_by_user_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

ALTER TABLE contest_entries 
  ADD CONSTRAINT contest_entries_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

ALTER TABLE contest_votes 
  ADD CONSTRAINT contest_votes_voter_id_fkey 
  FOREIGN KEY (voter_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

COMMIT;
```

#### Step 4: Apply Migration
```bash
npx supabase migration up --linked
```

### Task 2: Fix Telegram Authentication Implementation

#### Step 1: Update Verification Algorithm
Update `supabase/functions/telegram-auth/index.ts`:

```typescript
// Replace the verifyTelegramData function with the correct implementation
async function verifyTelegramData(initData: string): Promise<boolean> {
  const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not configured');
    return false;
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    const authDate = params.get('auth_date');
    
    // Check if required parameters exist
    if (!hash || !authDate) {
      return false;
    }
    
    // Check if auth_date is recent (within 1 hour)
    const authTimestamp = parseInt(authDate);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp - authTimestamp > 3600) {
      return false;
    }
    
    // Remove hash from parameters and sort
    params.delete('hash');
    const sortedParams = Array.from(params.entries()).sort(([a], [b]) => a.localeCompare(b));
    
    // Create data string
    const dataString = sortedParams.map(([key, value]) => `${key}=${value}`).join('\n');
    
    // Create secret key using HMAC-SHA256
    const encoder = new TextEncoder();
    const secretKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode('WebAppData'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const secret = await crypto.subtle.sign('HMAC', secretKey, encoder.encode(BOT_TOKEN));
    
    // Create HMAC-SHA256 hash of data string
    const dataKey = await crypto.subtle.importKey(
      'raw',
      secret,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', dataKey, encoder.encode(dataString));
    
    // Convert signature to hex string
    const hexSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Compare hashes
    return hexSignature === hash;
  } catch (error) {
    console.error('Error verifying Telegram data:', error);
    return false;
  }
}
```

#### Step 2: Fix User Session Creation
Update the session creation part of the function:

```typescript
// Replace the session creation section with proper implementation
const fakeEmail = `telegram_${telegramUser.id}@tuneton.app`;
const userPassword = crypto.randomUUID();

// Check if user already exists
const { data: existingUser, error: fetchError } = await supabase.auth.admin.getUserByEmail(fakeEmail);

let authUser;
if (fetchError || !existingUser) {
  // Create user if they don't exist
  const { data, error: createError } = await supabase.auth.admin.createUser({
    email: fakeEmail,
    password: userPassword,
    email_confirm: true,
    user_metadata: {
      telegram_id: telegramUser.id,
      username: telegramUser.username,
      first_name: telegramUser.first_name,
      last_name: telegramUser.last_name,
      photo_url: telegramUser.photo_url,
      is_premium: telegramUser.is_premium,
      auth_method: authMethod
    }
  });
  
  if (createError) {
    throw new Error(`Failed to create user: ${createError.message}`);
  }
  
  authUser = data.user;
} else {
  // User exists, update their metadata
  const { data, error: updateError } = await supabase.auth.admin.updateUserById(existingUser.user.id, {
    user_metadata: {
      telegram_id: telegramUser.id,
      username: telegramUser.username,
      first_name: telegramUser.first_name,
      last_name: telegramUser.last_name,
      photo_url: telegramUser.photo_url,
      is_premium: telegramUser.is_premium,
      auth_method: authMethod
    }
  });
  
  if (updateError) {
    throw new Error(`Failed to update user: ${updateError.message}`);
  }
  
  authUser = data.user;
}

// Sign in the user to create a session
const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
  email: fakeEmail,
  password: userPassword
});

if (sessionError) {
  throw new Error(`Failed to sign in user: ${sessionError.message}`);
}

return new Response(
  JSON.stringify({
    message: 'Authentication successful',
    user: telegramUser,
    access_token: sessionData.session.access_token,
    refresh_token: sessionData.session.refresh_token,
    user_id: authUser.id
  }),
  {
    headers: corsHeaders,
    status: 200
  }
);
```

### Task 3: Fix Playback Count Synchronization

#### Step 1: Update Field References
Update `supabase/functions/playbacks/index.ts`:

```typescript
// Fix the field reference issue in incrementPlayback function
async function incrementPlayback(supabase: any, trackId: string): Promise<Response> {
  try {
    // First, get the current playback count
    const { data: existingPlayback, error: fetchError } = await supabase
      .from('playbacks')
      .select('count')
      .eq('track_id', trackId)
      .single();
    
    let newCount = 1;
    if (existingPlayback) {
      newCount = existingPlayback.count + 1;
      // Update existing playback count
      const { error: updateError } = await supabase
        .from('playbacks')
        .update({ count: newCount })
        .eq('track_id', trackId);
      
      if (updateError) throw updateError;
    } else {
      // Create new playback record
      const { error: insertError } = await supabase
        .from('playbacks')
        .insert({ track_id: trackId, count: newCount });
      
      if (insertError) throw insertError;
    }
    
    // Also update the track's play_count (note the underscore)
    const { data: trackData, error: trackError } = await supabase
      .from('tracks')
      .select('play_count')
      .eq('id', trackId)
      .single();
    
    if (!trackError && trackData) {
      const updatedPlayCount = trackData.play_count + 1;
      await supabase
        .from('tracks')
        .update({ play_count: updatedPlayCount }) // Fixed field name
        .eq('id', trackId);
    }
    
    // Get total playbacks
    const { data: allPlaybacks, error: allError } = await supabase
      .from('playbacks')
      .select('count');
    
    let totalPlaybacks = 0;
    if (!allError && allPlaybacks) {
      totalPlaybacks = allPlaybacks.reduce((sum: number, item: any) => sum + item.count, 0);
    }
    
    return new Response(
      JSON.stringify({ 
        trackId, 
        playCount: newCount,
        totalPlaybacks
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error incrementing playback:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update playback count', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
}
```

## Phase 2: Medium Improvements (Weeks 3-4)

### Task 4: Implement Search Functionality

#### Step 1: Create Search API Function
Create `supabase/functions/search/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { query, type, limit = 20 } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Missing search query' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    let results = {};
    
    // Search tracks
    if (!type || type === 'tracks') {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .ilike('title', `%${query}%`)
        .limit(limit);
      
      if (error) throw error;
      results.tracks = data;
    }
    
    // Search artists
    if (!type || type === 'artists') {
      const { data, error } = await supabase
        .from('tracks')
        .select('artist, artist_id')
        .ilike('artist', `%${query}%`)
        .limit(limit);
      
      if (error) throw error;
      
      // Deduplicate artists
      const uniqueArtists = [...new Map(data.map(item => [item.artist, item])).values()];
      results.artists = uniqueArtists;
    }
    
    // Search playlists
    if (!type || type === 'playlists') {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(limit);
      
      if (error) throw error;
      results.playlists = data;
    }
    
    return new Response(
      JSON.stringify(results),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ error: 'Search failed', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
```

#### Step 2: Connect Search UI to Backend
Update `src/components/SearchPage.tsx` to call the search API:

```typescript
// Add search functionality to SearchPage component
const handleSearch = async (searchQuery: string) => {
  try {
    setIsLoading(true);
    setError(null);
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ query: searchQuery, limit: 20 })
    });
    
    if (!response.ok) {
      throw new Error('Search failed');
    }
    
    const data = await response.json();
    setSearchResults(data);
  } catch (err) {
    setError('Failed to search');
    console.error('Search error:', err);
  } finally {
    setIsLoading(false);
  }
};
```

## Phase 3: Long-term Enhancements (Weeks 5-8)

### Task 5: Implement Real NFT Functionality

#### Step 1: Research TON Blockchain Integration
This is a complex task that requires:
1. Understanding TON blockchain NFT standards
2. Setting up a TON wallet integration
3. Creating smart contracts for NFT operations
4. Implementing transaction handling

#### Step 2: Update NFT Data Model
Update the NFTs table to include blockchain-specific fields:

```sql
-- Add blockchain-specific fields to NFTs table
ALTER TABLE nfts 
ADD COLUMN IF NOT EXISTS contract_address TEXT,
ADD COLUMN IF NOT EXISTS token_standard TEXT DEFAULT 'TEP64';
```

#### Step 3: Implement Blockchain Integration
This would require creating new Supabase functions that interact with TON blockchain APIs to:
1. Mint new NFTs
2. Transfer NFTs between users
3. Handle auction transactions
4. Verify NFT ownership

## Testing and Validation

### Unit Tests for Critical Fixes

#### Test Database Migration
```sql
-- Test that foreign key constraints are correctly applied
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema = 'public' 
  AND tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'nfts';
```

#### Test Authentication Function
```bash
# Test the telegram-auth function with sample data
curl -X POST "https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1/telegram-auth" \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{"initData": "auth_date=1234567890&hash=test_hash&user={\"id\":123456789,\"first_name\":\"Test\",\"username\":\"testuser\"}"}'
```

#### Test Playback Function
```bash
# Test the playbacks function
curl -X POST "https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1/playbacks/12345" \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY"
```

## Deployment Checklist

### Pre-deployment
- [ ] Backup current database
- [ ] Test all migration scripts in staging environment
- [ ] Verify all authentication flows work correctly
- [ ] Test audio playback functionality
- [ ] Validate search functionality

### Deployment
- [ ] Apply database migrations
- [ ] Deploy updated Supabase functions
- [ ] Deploy updated frontend code
- [ ] Monitor for errors and performance issues

### Post-deployment
- [ ] Verify all functionality works in production
- [ ] Monitor user feedback and error reports
- [ ] Optimize performance based on usage patterns
- [ ] Update documentation

## Rollback Plan

If issues are discovered after deployment:

1. **Database Issues**: 
   - Rollback migrations using `supabase migration down`
   - Restore database from backup

2. **Function Issues**:
   - Revert to previous function versions
   - Monitor logs for error patterns

3. **Frontend Issues**:
   - Rollback to previous frontend deployment
   - Communicate with users about temporary service disruption

## Success Criteria

### Technical Success
- Zero database constraint violations
- <1% authentication failure rate
- <500ms average API response time
- 99.9% uptime for core services

### User Experience Success
- >95% successful authentication rate
- <3 second average track load time
- >90% user satisfaction with search functionality
- Zero critical user-reported bugs

### Business Success
- >1000 active daily users within 1 week
- >100 NFT transactions per week
- >1000 playlist creations per week
- >10000 track plays per day