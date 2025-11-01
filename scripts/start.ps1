# PowerShell startup script for TuneTON application
Write-Host "Starting TuneTON application..." -ForegroundColor Yellow

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Cyan
.\scripts\install-dependencies.ps1

# Start the development server
Write-Host "Starting development server..." -ForegroundColor Cyan
npm run dev