# Script to set up the playbacks table using Supabase CLI
Write-Host "Setting up playbacks table..."

# Link to the project
Write-Host "Linking to Supabase project..."
npx supabase link --project-ref dthrpvpuzinmevrvqlhv

# Apply the migration
Write-Host "Applying playbacks table migration..."
npx supabase db push

Write-Host "Playbacks table setup completed!"
Write-Host "Now run: node scripts/migrate-data-to-db.js to migrate the data"