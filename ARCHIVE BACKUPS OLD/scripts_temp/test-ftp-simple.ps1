# Simple FTP Test Script
Write-Host "Testing FTP connection with explicit credentials..." -ForegroundColor Green

# Use the exact credentials from the .env.production file
$ftpHost = "31.31.197.37"
$ftpUser = "u3220060_tuneton_qoder"
$ftpPassword = "8XIaE5MdeOK4tJv1"
$ftpPort = "21"

Write-Host "Host: $ftpHost" -ForegroundColor Cyan
Write-Host "User: $ftpUser" -ForegroundColor Cyan
Write-Host "Port: $ftpPort" -ForegroundColor Cyan

try {
    Write-Host "Attempting to connect..." -ForegroundColor Yellow
    
    # Create FTP request with explicit port
    $request = [System.Net.FtpWebRequest]::Create("ftp://$ftpHost`:$ftpPort")
    $request.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
    $request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPassword)
    $request.UsePassive = $true
    $request.UseBinary = $true
    $request.KeepAlive = $false
    
    # Set timeout
    $request.Timeout = 30000
    
    Write-Host "Sending request..." -ForegroundColor Yellow
    $response = $request.GetResponse()
    $responseStream = $response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($responseStream)
    $directories = $reader.ReadToEnd()
    $reader.Close()
    $response.Close()
    
    Write-Host "SUCCESS! FTP connection established." -ForegroundColor Green
    Write-Host "Directories found:" -ForegroundColor Cyan
    Write-Host $directories -ForegroundColor White
}
catch {
    Write-Host "FTP connection FAILED: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.InnerException) {
        Write-Host "Inner exception: $($_.Exception.InnerException.Message)" -ForegroundColor Red
    }
    
    # Try with different passive mode setting
    Write-Host "Retrying with passive mode disabled..." -ForegroundColor Yellow
    try {
        $request = [System.Net.FtpWebRequest]::Create("ftp://$ftpHost`:$ftpPort")
        $request.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
        $request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPassword)
        $request.UsePassive = $false  # Try active mode
        $request.UseBinary = $true
        $request.KeepAlive = $false
        $request.Timeout = 30000
        
        $response = $request.GetResponse()
        $responseStream = $response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($responseStream)
        $directories = $reader.ReadToEnd()
        $reader.Close()
        $response.Close()
        
        Write-Host "SUCCESS with active mode! FTP connection established." -ForegroundColor Green
        Write-Host "Directories found:" -ForegroundColor Cyan
        Write-Host $directories -ForegroundColor White
    }
    catch {
        Write-Host "FTP connection FAILED with active mode too: $($_.Exception.Message)" -ForegroundColor Red
    }
}