# PowerShell script to deploy Supabase Edge Function using REST API

# Configuration
$SUPABASE_ACCESS_TOKEN = "YOUR_SUPABASE_ACCESS_TOKEN" # Get this from Supabase Dashboard -> Access Tokens
$PROJECT_REF = "dthrpvpuzinmevrvqlhv"
$FUNCTION_NAME = "hello"
$FUNCTION_PATH = "supabase/functions/$FUNCTION_NAME"

# Check if function directory exists
if (-not (Test-Path -Path $FUNCTION_PATH)) {
    Write-Error "Function directory not found at $FUNCTION_PATH"
    exit 1
}

# Create a temporary directory for the function bundle
$TEMP_DIR = "$env:TEMP/supabase-deploy-$FUNCTION_NAME-$(Get-Date -Format 'yyyyMMddHHmmss')" 
New-Item -ItemType Directory -Path $TEMP_DIR -Force | Out-Null

# Copy function files to temp directory
Copy-Item -Path "$FUNCTION_PATH/*" -Destination $TEMP_DIR -Recurse -Force

# Create a zip file of the function
$ZIP_PATH = "$TEMP_DIR/function.zip"
Compress-Archive -Path "$TEMP_DIR/*" -DestinationPath $ZIP_PATH -Force

# Deploy the function using Supabase API
$headers = @{
    "Authorization" = "Bearer $SUPABASE_ACCESS_TOKEN"
    "Content-Type"  = "application/zip"
}

try {
    $response = Invoke-RestMethod -Uri "https://api.supabase.com/v1/projects/$PROJECT_REF/functions/$FUNCTION_NAME`?slug=$FUNCTION_NAME" `
        -Method "POST" `
        -Headers $headers `
        -InFile $ZIP_PATH `
        -ContentType "application/zip"
    
    Write-Host "✅ Function deployed successfully!" -ForegroundColor Green
    Write-Host "Deployment ID: $($response.id)"
    
} catch {
    Write-Error "❌ Deployment failed: $_"
    if ($_.ErrorDetails.Message) {
        Write-Error "Details: $($_.ErrorDetails.Message)"
    }
} finally {
    # Clean up
    Remove-Item -Path $TEMP_DIR -Recurse -Force -ErrorAction SilentlyContinue
}
