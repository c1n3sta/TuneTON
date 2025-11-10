# Debug Credentials Parsing
Write-Host "Debugging Credentials Parsing" -ForegroundColor Green
Write-Host "===========================" -ForegroundColor Green

# Read the .env.production file and parse credentials
$envContent = Get-Content ".env.production"

Write-Host "Raw lines from .env.production:" -ForegroundColor Yellow
foreach ($line in $envContent) {
    if ($line -match "FTP_") {
        Write-Host "  $line" -ForegroundColor White
    }
}

# Extract credentials more carefully
$ftpHostLine = $envContent | Where-Object { $_ -match "^FTP_HOST=" }
$ftpUserLine = $envContent | Where-Object { $_ -match "^FTP_USER=" }
$ftpPasswordLine = $envContent | Where-Object { $_ -match "^FTP_PASSWORD=" }
$ftpRemoteDirLine = $envContent | Where-Object { $_ -match "^FTP_REMOTE_DIR=" }

Write-Host "`nParsed credentials:" -ForegroundColor Yellow
Write-Host "  FTP_HOST line: '$ftpHostLine'" -ForegroundColor White
Write-Host "  FTP_USER line: '$ftpUserLine'" -ForegroundColor White
Write-Host "  FTP_PASSWORD line: '$ftpPasswordLine'" -ForegroundColor White
Write-Host "  FTP_REMOTE_DIR line: '$ftpRemoteDirLine'" -ForegroundColor White

# Extract values
$ftpHost = ($ftpHostLine -split "=", 2)[1]
$ftpUser = ($ftpUserLine -split "=", 2)[1]
$ftpPassword = ($ftpPasswordLine -split "=", 2)[1]
$ftpRemoteDir = ($ftpRemoteDirLine -split "=", 2)[1]

# Trim whitespace and quotes
$ftpHost = $ftpHost.Trim().Trim('"')
$ftpUser = $ftpUser.Trim().Trim('"')
$ftpPassword = $ftpPassword.Trim().Trim('"')
$ftpRemoteDir = $ftpRemoteDir.Trim().Trim('"')

Write-Host "`nExtracted and cleaned credentials:" -ForegroundColor Yellow
Write-Host "  Host: '$ftpHost'" -ForegroundColor White
Write-Host "  User: '$ftpUser'" -ForegroundColor White
Write-Host "  Password: '$ftpPassword'" -ForegroundColor White
Write-Host "  Remote Directory: '$ftpRemoteDir'" -ForegroundColor White

Write-Host "`nPassword character analysis:" -ForegroundColor Yellow
Write-Host "  Password length: $($ftpPassword.Length)" -ForegroundColor White
for ($i = 0; $i -lt $ftpPassword.Length; $i++) {
    $char = $ftpPassword[$i]
    $code = [int][char]$char
    Write-Host ("  Character {0}: '{1}' (ASCII: {2})" -f $i, $char, $code) -ForegroundColor White
}

# Test with these exact credentials
Write-Host "`nTesting with cleaned credentials..." -ForegroundColor Yellow
try {
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
    
    Write-Host "SUCCESS! FTP connection established." -ForegroundColor Green
    $response.Close()
}
catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}