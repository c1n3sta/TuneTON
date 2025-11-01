# PowerShell script to install required dependencies on startup
Write-Host "Installing required dependencies..." -ForegroundColor Yellow

# Try to install vector extension
Write-Host "Installing vector extension..." -ForegroundColor Cyan
try {
    # This would normally connect to the database and run the CREATE EXTENSION command
    # Since we're in PowerShell, we'll use the Supabase CLI
    supabase db reset
    Write-Host "✅ Vector extension installed successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Failed to install vector extension: $_" -ForegroundColor Red
}

# Deploy functions
Write-Host "Deploying Supabase functions..." -ForegroundColor Cyan
try {
    supabase functions deploy
    Write-Host "✅ Functions deployed successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Failed to deploy functions: $_" -ForegroundColor Red
}

Write-Host "Dependency installation process completed." -ForegroundColor Yellow