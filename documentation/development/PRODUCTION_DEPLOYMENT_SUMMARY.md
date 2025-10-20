# Production Deployment Summary for TuneTON Serverless Architecture

## Overview

This document provides a complete guide for building and deploying the TuneTON application with its new serverless architecture using Supabase Edge Functions.

## Build Process

### 1. Frontend Build

The frontend build process remains the same as before:

```bash
npm run build:prod
```

This will create a production-ready build in the `dist` directory.

### 2. Database Setup

Create the necessary database tables:

```sql
-- Create tracks table
CREATE TABLE tracks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  duration INTEGER DEFAULT 0,
  playCount INTEGER DEFAULT 0,
  audioUrl TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create playbacks table
CREATE TABLE playbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id TEXT REFERENCES tracks(id) ON DELETE CASCADE,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tracks_created_at ON tracks(created_at);
CREATE INDEX IF NOT EXISTS idx_playbacks_track_id ON playbacks(track_id);
CREATE INDEX IF NOT EXISTS idx_playbacks_created_at ON playbacks(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE playbacks ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public tracks are viewable by everyone" ON tracks
  FOR SELECT USING (true);

CREATE POLICY "Public playbacks are viewable by everyone" ON playbacks
  FOR SELECT USING (true);

-- Create policies for insert access (playbacks can be inserted by anyone)
CREATE POLICY "Anyone can insert playbacks" ON playbacks
  FOR INSERT WITH CHECK (true);

-- Grant access to anon role
GRANT SELECT ON tracks TO anon;
GRANT SELECT, INSERT ON playbacks TO anon;
GRANT USAGE ON SEQUENCE playbacks_id_seq TO anon;
```

### 3. Data Migration

Migrate existing data from JSON files to the database:

```bash
# Set environment variables
export SUPABASE_URL=https://dthrpvpuzinmevrvqlhv.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Run migration script
npm run migrate:data
```

### 4. Function Deployment

Deploy the Supabase Edge Functions:

1. Health Function (`supabase/functions/health/index.ts`)
2. Tracks Function (`supabase/functions/tracks/index.ts`)
3. Playbacks Function (`supabase/functions/playbacks/index.ts`)
4. Telegram Auth Function (`supabase/functions/telegram-auth/index.ts`)

### 5. Environment Configuration

Ensure the following environment variables are set in your deployment environment:

```env
VITE_SUPABASE_URL=https://dthrpvpuzinmevrvqlhv.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_API_URL=https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1
VITE_API_BASE_URL=https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

## Deployment Architecture

The new deployment architecture is much simpler than the previous one:

```
Internet → CDN/Static Hosting → Frontend (React/Vite)
                              ↓
                    Supabase Edge Functions
                              ↓
                        Supabase Database
                              ↓
                        Telegram WebApp
                              ↓
                        TON Blockchain
```

### Benefits of the New Architecture

1. **Simplified Deployment**: No need to manage separate Node.js servers
2. **Auto-scaling**: Supabase Edge Functions automatically scale with demand
3. **Reduced Costs**: Pay-per-use pricing model
4. **Improved Reliability**: Managed infrastructure with built-in redundancy
5. **Enhanced Security**: Centralized security management through Supabase

## Testing

After deployment, test your application:

1. Health check: `curl https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1/health`
2. Tracks endpoint: `curl https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1/tracks`
3. Playbacks endpoint: `curl -X POST https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1/playbacks/1`

## Monitoring

Monitor your application through:

1. Supabase Dashboard for function logs
2. Supabase Analytics for database queries
3. Browser developer tools for frontend performance

## Rollback Plan

If issues are encountered, you can rollback by:

1. Reverting to the previous version in your static hosting
2. Restoring the database from backup if needed
3. Reverting function deployments through the Supabase Dashboard

## Future Updates

For future updates:

1. Make changes to the local files
2. Rebuild the frontend: `npm run build:prod`
3. Redeploy functions as needed
4. Run data migrations if database schema changes
5. Test thoroughly after deployment

This new serverless architecture provides a more robust, scalable, and maintainable solution for the TuneTON application.
