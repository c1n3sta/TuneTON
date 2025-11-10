# PowerShell script to deploy Supabase Edge Function for Telegram Auth using REST API

# Configuration
# You need to get your Supabase Access Token from the Supabase Dashboard:
# 1. Go to https://app.supabase.com/
# 2. Select your project
# 3. Go to Settings -> API
# 4. Find "Service Role Secret" (not the anon key)
# 5. Or create an access token in Settings -> Access Tokens
$SUPABASE_ACCESS_TOKEN = "sbp_0bc204c35d2a15e226291383a237d739cde4ea25" # Replace with your actual access token
$PROJECT_REF = "dthrpvpuzinmevrvqlhv"
$FUNCTION_NAME = "telegram-auth"
$FUNCTION_PATH = "supabase/functions/$FUNCTION_NAME"

Write-Host "Deploying Telegram Auth function to Supabase..." -ForegroundColor Yellow
Write-Host "Project Ref: $PROJECT_REF" -ForegroundColor Cyan
Write-Host "Function Name: $FUNCTION_NAME" -ForegroundColor Cyan

# Check if function directory exists
if (-not (Test-Path -Path $FUNCTION_PATH)) {
    Write-Error "Function directory not found at $FUNCTION_PATH"
    Write-Host "Please make sure you're running this script from the TuneTON directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Function directory found" -ForegroundColor Green

# Create a temporary directory for the function bundle
$TEMP_DIR = "$env:TEMP/supabase-deploy-$FUNCTION_NAME-$(Get-Date -Format 'yyyyMMddHHmmss')" 
New-Item -ItemType Directory -Path $TEMP_DIR -Force | Out-Null

# Copy function files to temp directory
Write-Host "📦 Packaging function files..." -ForegroundColor Cyan
Copy-Item -Path "$FUNCTION_PATH/*" -Destination $TEMP_DIR -Recurse -Force

# Create a zip file of the function
$ZIP_PATH = "$TEMP_DIR/function.zip"
Write-Host "📦 Creating zip archive..." -ForegroundColor Cyan
Compress-Archive -Path "$TEMP_DIR/*" -DestinationPath $ZIP_PATH -Force

# Check if access token is set
if ($SUPABASE_ACCESS_TOKEN -eq "YOUR_SUPABASE_ACCESS_TOKEN") {
    Write-Warning "⚠️  Access token not configured!"
    Write-Host "Please update the script with your Supabase Access Token:" -ForegroundColor Yellow
    Write-Host "1. Go to https://app.supabase.com/" -ForegroundColor Yellow
    Write-Host "2. Select your project (project ref: $PROJECT_REF)" -ForegroundColor Yellow
    Write-Host "3. Go to Settings -> API" -ForegroundColor Yellow
    Write-Host "4. Find 'Service Role Secret' or create an access token in Settings -> Access Tokens" -ForegroundColor Yellow
    Write-Host "5. Replace 'YOUR_SUPABASE_ACCESS_TOKEN' in this script with your token" -ForegroundColor Yellow
    exit 1
}

# Deploy the function using Supabase API
$headers = @{
    "Authorization" = "Bearer $SUPABASE_ACCESS_TOKEN"
    "Content-Type"  = "application/zip"
}

Write-Host "🚀 Deploying function..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "https://api.supabase.com/v1/projects/$PROJECT_REF/functions/$FUNCTION_NAME`?slug=$FUNCTION_NAME" `
        -Method "POST" `
        -Headers $headers `
        -InFile $ZIP_PATH `
        -ContentType "application/zip"
    
    Write-Host "✅ Telegram Auth Function deployed successfully!" -ForegroundColor Green
    Write-Host "Deployment ID: $($response.id)" -ForegroundColor Cyan
    
} catch {
    Write-Error "❌ Deployment failed: $_"
    if ($_.ErrorDetails.Message) {
        Write-Error "Details: $($_.ErrorDetails.Message)"
    }
    Write-Host "Troubleshooting tips:" -ForegroundColor Yellow
    Write-Host "1. Check that your access token is correct and has sufficient permissions" -ForegroundColor Yellow
    Write-Host "2. Verify that the project ref ($PROJECT_REF) is correct" -ForegroundColor Yellow
    Write-Host "3. Make sure the function name ($FUNCTION_NAME) matches your function directory" -ForegroundColor Yellow
} finally {
    # Clean up
    Write-Host "🧹 Cleaning up temporary files..." -ForegroundColor Cyan
    Remove-Item -Path $TEMP_DIR -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "🏁 Deployment process completed" -ForegroundColor Green