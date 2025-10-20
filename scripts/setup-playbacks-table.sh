#!/bin/bash

# Script to set up the playbacks table using Supabase CLI
echo "Setting up playbacks table..."

# Link to the project
echo "Linking to Supabase project..."
npx supabase link --project-ref dthrpvpuzinmevrvqlhv

# Apply the migration
echo "Applying playbacks table migration..."
npx supabase db push

echo "Playbacks table setup completed!"
echo "Now run: node scripts/migrate-data-to-db.js to migrate the data"