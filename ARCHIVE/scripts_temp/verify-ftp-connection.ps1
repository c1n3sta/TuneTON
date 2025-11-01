# Verify FTP Connection with Exact Credentials from .env.production
Write-Host "Verifying FTP Connection with Exact Credentials" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Extract credentials from .env.production file
$envContent = Get-Content ".env.production"
$ftpHost = ($envContent | Where-Object { $_ -match "FTP_HOST=" }) -replace "FTP_HOST=", ""
$ftpUser = ($envContent | Where-Object { $_ -match "FTP_USER=" }) -replace "FTP_USER=", ""
$ftpPassword = ($envContent | Where-Object { $_ -match "FTP_PASSWORD=" }) -replace "FTP_PASSWORD=", ""
$ftpRemoteDir = ($envContent | Where-Object { $_ -match "FTP_REMOTE_DIR=" }) -replace "FTP_REMOTE_DIR=", ""

# Display the credentials being used (for verification only)
Write-Host "FTP Configuration from .env.production:" -ForegroundColor Cyan
Write-Host "  Host: $ftpHost" -ForegroundColor White
Write-Host "  Port: 21" -ForegroundColor White
Write-Host "  User: $ftpUser" -ForegroundColor White
Write-Host "  Password: $ftpPassword" -ForegroundColor White
Write-Host "  Remote Directory: $ftpRemoteDir" -ForegroundColor White

# Test FTP connection
try {
    Write-Host "`nTesting FTP connection..." -ForegroundColor Yellow
    
    # Create FTP request with exact credentials
    $ftpUrl = "ftp://${ftpHost}:21/"
    Write-Host "Connecting to: $ftpUrl" -ForegroundColor Cyan
    
    $request = [System.Net.FtpWebRequest]::Create($ftpUrl)
    $request.Method = [System.Net.WebRequestMethods+Ftp]::PrintWorkingDirectory
    $request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPassword)
    $request.UsePassive = $true
    $request.UseBinary = $true
    $request.KeepAlive = $false
    $request.Timeout = 30000
    
    Write-Host "Sending authentication request..." -ForegroundColor Yellow
    $response = $request.GetResponse()
    
    Write-Host "Reading server response..." -ForegroundColor Yellow
    $responseStream = $response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($responseStream)
    $content = $reader.ReadToEnd()
    $reader.Close()
    $response.Close()
    
    Write-Host "SUCCESS! FTP connection established." -ForegroundColor Green
    Write-Host "Current working directory: $content" -ForegroundColor Cyan
    
    # Test listing directory contents
    Write-Host "`nTesting directory listing..." -ForegroundColor Yellow
    $listRequest = [System.Net.FtpWebRequest]::Create($ftpUrl)
    $listRequest.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
    $listRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPassword)
    $listRequest.UsePassive = $true
    $listRequest.UseBinary = $true
    $listRequest.KeepAlive = $false
    $listRequest.Timeout = 30000
    
    $listResponse = $listRequest.GetResponse()
    $listResponseStream = $listResponse.GetResponseStream()
    $listReader = New-Object System.IO.StreamReader($listResponseStream)
    $listContent = $listReader.ReadToEnd()
    $listReader.Close()
    $listResponse.Close()
    
    Write-Host "Directory listing successful:" -ForegroundColor Green
    Write-Host $listContent -ForegroundColor White
}
catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.InnerException) {
        Write-Host "Inner exception: $($_.Exception.InnerException.Message)" -ForegroundColor Red
    }
    if ($_.Exception.Response) {
        Write-Host "Response status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        Write-Host "Response description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    }
    
    # Try with active mode as fallback
    Write-Host "`nTrying with active mode (passive disabled)..." -ForegroundColor Yellow
    try {
        $request = [System.Net.FtpWebRequest]::Create($ftpUrl)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::PrintWorkingDirectory
        $request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPassword)
        $request.UsePassive = $false  # Active mode
        $request.UseBinary = $true
        $request.KeepAlive = $false
        $request.Timeout = 30000
        
        $response = $request.GetResponse()
        $responseStream = $response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($responseStream)
        $content = $reader.ReadToEnd()
        $reader.Close()
        $response.Close()
        
        Write-Host "SUCCESS with active mode! FTP connection established." -ForegroundColor Green
        Write-Host "Current working directory: $content" -ForegroundColor Cyan
    }
    catch {
        Write-Host "FAILED with active mode too: $($_.Exception.Message)" -ForegroundColor Red
    }
}