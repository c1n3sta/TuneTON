# Migration Guide: From Supabase to Self-Hosted Backend

This guide explains how to migrate the TuneTON application from Supabase to a self-hosted backend.

## Overview

The migration involves replacing Supabase services with self-hosted equivalents:

1. **Database**: PostgreSQL instead of Supabase PostgreSQL
2. **Authentication**: Custom authentication instead of Supabase Auth
3. **API**: RESTful API instead of Supabase functions
4. **Storage**: FTP-based storage instead of Supabase Storage

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database
- Telegram bot token
- FTP access to hosting server

## Step 1: Set Up Self-Hosted Backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - Database credentials
   - Telegram bot token
   - Server port

## Step 2: Database Migration

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE tuneton;
   ```

2. Run the schema script:
   ```bash
   psql -U your_username -d tuneton -f database/schema.sql
   ```

3. Run the data migration script:
   ```bash
   node ../scripts/migrate-from-supabase.js
   ```

## Step 3: Update Frontend Configuration

1. Update `.env.production`:
   ```env
   # Replace Supabase URLs with self-hosted backend URLs
   VITE_API_BASE_URL=http://your-backend-url:3001/api
   ```

2. Replace Supabase client with self-hosted API client:
   - Replace `src/utils/supabase.ts` with `src/utils/apiClient.js`
   - Update authentication hooks to use `src/hooks/useAuth.js`

## Step 4: Test the Migration

1. Start the self-hosted backend:
   ```bash
   npm start
   ```

2. Test the backend:
   ```bash
   npm run test:backend
   ```

3. Update and test the frontend:
   ```bash
   npm run build
   npm run preview
   ```

## Step 5: Deploy to Production

1. Deploy the backend:
   ```bash
   npm run deploy:backend
   ```

2. Deploy the frontend:
   ```bash
   npm run deploy:prod
   ```

## Rollback Plan

If issues occur during migration:

1. Revert frontend to use Supabase
2. Restore database from backup
3. Document issues and fix before retrying

## Benefits of Migration

1. **Cost Savings**: Eliminate Supabase subscription fees
2. **Performance**: Direct control over database optimization
3. **Customization**: Full control over features and functionality
4. **Scalability**: Independent scaling of components
5. **Data Ownership**: Complete control over user data

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Verify database credentials in `.env`
   - Ensure PostgreSQL is running
   - Check firewall settings

2. **Authentication Failures**:
   - Verify Telegram bot token
   - Check server logs for errors

3. **API Endpoint Errors**:
   - Verify backend is running
   - Check server logs for errors
   - Ensure correct API URLs in frontend

### Support

For assistance with the migration, contact the development team or refer to the documentation in:
- `server/README.md`
- `documentation/`