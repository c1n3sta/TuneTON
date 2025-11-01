#!/bin/bash

# Script to install required dependencies on startup
echo "Installing required dependencies..."

# Install vector extension if not already installed
echo "Installing vector extension..."
psql -h localhost -p 54322 -U postgres -d postgres -c "CREATE EXTENSION IF NOT EXISTS vector;" 2>/dev/null || true

# Install other required extensions
echo "Installing other required extensions..."
psql -h localhost -p 54322 -U postgres -d postgres -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;" 2>/dev/null || true

# Run migrations
echo "Running database migrations..."
npx supabase db reset 2>/dev/null || true

# Deploy functions
echo "Deploying Supabase functions..."
npx supabase functions deploy 2>/dev/null || true

echo "Dependency installation completed."