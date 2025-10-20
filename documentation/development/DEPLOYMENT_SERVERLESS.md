# Serverless Functions Deployment Guide

## Overview

This guide provides instructions for deploying TuneTON's backend services using Supabase Edge Functions. This serverless architecture replaces the previous Node.js server implementation with auto-scaling, managed functions.

## Prerequisites

1. Supabase account and project
2. Supabase CLI installed
3. Environment variables configured
4. Database tables created

## Deployment Steps

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Link to Your Supabase Project

```bash
supabase link --project-ref your-project-ref
```

### 3. Create Database Tables

Run the database migration script:

```bash
supabase db push
```

Or manually execute the SQL script:

```bash
supabase db reset
```

### 4. Deploy Functions

Deploy all functions at once:

```bash
supabase functions deploy
```

Or deploy individual functions:

```bash
supabase functions deploy telegram-auth
supabase functions deploy tracks
supabase functions deploy playbacks
supabase functions deploy health
```

### 5. Set Environment Variables

Set required environment variables:

```bash
supabase secrets set TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

### 6. Configure Function URLs

Update your frontend environment variables to use the new Supabase Functions URLs:

```env
VITE_API_BASE_URL=https://your-project.supabase.co/functions/v1
```

## Function Details

### Telegram Authentication Function

- **Name**: `telegram-auth`
- **Path**: `supabase/functions/telegram-auth/index.ts`
- **Purpose**: Secure Telegram WebApp authentication
- **Environment Variables**:
  - `TELEGRAM_BOT_TOKEN`: Telegram bot token for validation

### Tracks Function

- **Name**: `tracks`
- **Path**: `supabase/functions/tracks/index.ts`
- **Purpose**: Retrieve track metadata and playback counts
- **Database Tables**: `tracks`, `playbacks`

### Playbacks Function

- **Name**: `playbacks`
- **Path**: `supabase/functions/playbacks/index.ts`
- **Purpose**: Record track playback events
- **Database Tables**: `playbacks`, `tracks`

### Health Function

- **Name**: `health`
- **Path**: `supabase/functions/health/index.ts`
- **Purpose**: Service health monitoring
- **Database Tables**: None

## Database Schema

### Tracks Table

```sql
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
```

### Playbacks Table

```sql
CREATE TABLE playbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id TEXT REFERENCES tracks(id) ON DELETE CASCADE,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Data Migration

### Migrate Existing Data

Run the data migration script to transfer data from JSON files to the database:

```bash
npm run migrate:data
```

This script will:

1. Read data from `data/tracks.json`
2. Read data from `data/playbacks.json`
3. Insert data into the corresponding database tables

## Environment Variables

### Required Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
VITE_API_BASE_URL=https://your-project.supabase.co/functions/v1

# Telegram Web App Configuration
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

### Setting Secrets

```bash
supabase secrets set TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

## Testing Functions Locally

### Start Local Development Server

```bash
supabase functions serve
```

### Test Individual Functions

```bash
curl http://localhost:54321/functions/v1/health
curl http://localhost:54321/functions/v1/tracks
```

## Monitoring and Debugging

### View Function Logs

```bash
supabase functions logs
```

### View Specific Function Logs

```bash
supabase functions logs --function-name tracks
```

### Monitor Database Queries

Use the Supabase dashboard to monitor:

- Query performance
- Database connections
- Error rates

## Rollback Process

If you need to rollback to the previous Node.js implementation:

1. Revert environment variables to use Node.js server URLs
2. Restart Node.js server
3. Temporarily disable Supabase Functions
4. Monitor for any data inconsistencies

## Troubleshooting

### Common Issues

1. **Function Deployment Failures**
   - Check function syntax and imports
   - Verify environment variables are set
   - Ensure proper file permissions

2. **Database Connection Issues**
   - Verify database connection strings
   - Check RLS (Row Level Security) policies
   - Ensure proper table permissions

3. **CORS Errors**
   - Verify CORS headers in function responses
   - Check allowed origins in frontend requests

### Debugging Steps

1. Check function logs:

   ```bash
   supabase functions logs --function-name function-name
   ```

2. Test function locally:

   ```bash
   supabase functions serve
   ```

3. Verify database schema:
   ```bash
   supabase db diff
   ```

## Best Practices

### Function Design

1. **Keep Functions Lightweight**
   - Minimize dependencies
   - Optimize for cold start performance
   - Use efficient algorithms

2. **Error Handling**
   - Implement comprehensive error handling
   - Return appropriate HTTP status codes
   - Log errors for debugging

3. **Security**
   - Validate all inputs
   - Use parameterized queries
   - Implement rate limiting

### Database Optimization

1. **Indexing**
   - Create indexes on frequently queried columns
   - Use composite indexes for complex queries
   - Monitor query performance

2. **Query Optimization**
   - Use efficient SELECT statements
   - Limit result sets when possible
   - Avoid N+1 query problems

## Performance Considerations

### Caching

- Leverage CDN caching with proper cache headers
- Implement database query caching where appropriate
- Use connection pooling for database operations

### Scaling

- Supabase Edge Functions auto-scale based on demand
- Database connections are managed automatically
- Monitor usage to optimize costs

## Cost Management

### Monitoring Usage

- Track function invocation counts
- Monitor database query volumes
- Set up alerts for unusual usage patterns

### Optimization Tips

- Minimize function execution time
- Reduce database query complexity
- Use efficient data structures

## Future Enhancements

### Planned Improvements

1. **Advanced Caching**
   - Implement Redis for complex caching scenarios
   - Add cache warming strategies

2. **Enhanced Monitoring**
   - Add custom metrics and dashboards
   - Implement distributed tracing

3. **Security Enhancements**
   - Add request validation middleware
   - Implement advanced rate limiting

This deployment guide provides a comprehensive overview of deploying TuneTON's backend services using Supabase Edge Functions, ensuring a smooth transition from the previous Node.js server architecture.
