# Debug FTP Connection Script
Write-Host "Debug FTP Connection Test" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green

# FTP Server Details (matching FileZilla settings)
$ftpServer = "31.31.197.37"
$ftpPort = 21
$username = "u3220060_tuneton_qoder"

# Read password from .env.production file and properly trim it
$envContent = Get-Content ".env.production" | Where-Object { $_ -match "FTP_PASSWORD=" }
if ($envContent) {
    $password = $envContent -replace "FTP_PASSWORD=", ""
    # Trim any whitespace characters including \r and \n
    $password = $password.Trim()
    Write-Host "Extracted password: '$password'" -ForegroundColor Cyan
    Write-Host "Password length: $($password.Length)" -ForegroundColor Cyan
} else {
    $password = "8XIaE5MdeOK4tJv1"
    Write-Host "Using default password" -ForegroundColor Yellow
}

Write-Host "Server: $ftpServer" -ForegroundColor Cyan
Write-Host "Port: $ftpPort" -ForegroundColor Cyan
Write-Host "Username: $username" -ForegroundColor Cyan

# Test 1: Connection test matching FileZilla settings
Write-Host "`nTest 1: Connection test matching FileZilla settings" -ForegroundColor Yellow
try {
    $ftpUrl = "ftp://${ftpServer}:${ftpPort}/"
    Write-Host "Connecting to: $ftpUrl" -ForegroundColor Cyan
    
    $request = [System.Net.FtpWebRequest]::Create($ftpUrl)
    $request.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
    $request.Credentials = New-Object System.Net.NetworkCredential($username, $password)
    
    # Match FileZilla settings as closely as possible
    $request.UsePassive = $true  # MODE_DEFAULT in FileZilla usually means passive
    $request.UseBinary = $true
    $request.KeepAlive = $false
    $request.Timeout = 30000
    
    Write-Host "Sending request..." -ForegroundColor Yellow
    $response = $request.GetResponse()
    
    Write-Host "Reading response..." -ForegroundColor Yellow
    $responseStream = $response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($responseStream)
    $content = $reader.ReadToEnd()
    $reader.Close()
    $response.Close()
    
    Write-Host "SUCCESS! FTP connection established." -ForegroundColor Green
    Write-Host "Response content:" -ForegroundColor Cyan
    Write-Host $content -ForegroundColor White
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
}

# Test 2: Try with active mode (passive disabled)
Write-Host "`nTest 2: Try with active mode (passive disabled)" -ForegroundColor Yellow
try {
    $ftpUrl = "ftp://${ftpServer}:${ftpPort}/"
    Write-Host "Connecting to: $ftpUrl" -ForegroundColor Cyan
    
    $request = [System.Net.FtpWebRequest]::Create($ftpUrl)
    $request.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
    $request.Credentials = New-Object System.Net.NetworkCredential($username, $password)
    
    # Try active mode instead
    $request.UsePassive = $false
    $request.UseBinary = $true
    $request.KeepAlive = $false
    $request.Timeout = 30000
    
    Write-Host "Sending request..." -ForegroundColor Yellow
    $response = $request.GetResponse()
    
    Write-Host "Reading response..." -ForegroundColor Yellow
    $responseStream = $response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($responseStream)
    $content = $reader.ReadToEnd()
    $reader.Close()
    $response.Close()
    
    Write-Host "SUCCESS! FTP connection established." -ForegroundColor Green
    Write-Host "Response content:" -ForegroundColor Cyan
    Write-Host $content -ForegroundColor White
}
catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.InnerException) {
        Write-Host "Inner exception: $($_.Exception.InnerException.Message)" -ForegroundColor Red
    }
}