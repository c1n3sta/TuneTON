# Configure FTP Credentials for TuneTON Deployment

Write-Host "Configure FTP Credentials for TuneTON Deployment" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Get FTP configuration from user
$ftpHost = Read-Host "Enter FTP Host (e.g., ftp.tuneton.space or server IP)"
$ftpUser = Read-Host "Enter FTP Username"
$ftpPassword = Read-Host "Enter FTP Password" -AsSecureString
$ftpRemoteDir = Read-Host "Enter Remote Directory (e.g., /www/tuneton.space)"

# Convert secure string to plain text (for environment variable)
$ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($ftpPassword)
$ftpPasswordPlainText = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
[System.Runtime.InteropServices.Marshal]::FreeBSTR($ptr)

# Set environment variables for current session
$env:FTP_HOST = $ftpHost
$env:FTP_USER = $ftpUser
$env:FTP_PASSWORD = $ftpPasswordPlainText
$env:FTP_REMOTE_DIR = $ftpRemoteDir

# Save to .env file for future use
$envContent = @"
FTP_HOST=$ftpHost
FTP_USER=$ftpUser
FTP_PASSWORD=$ftpPasswordPlainText
FTP_REMOTE_DIR=$ftpRemoteDir
"@

$envFile = ".env.ftp"
Set-Content -Path $envFile -Value $envContent

Write-Host ""
Write-Host "FTP credentials configured successfully!" -ForegroundColor Green
Write-Host "Credentials saved to: $envFile" -ForegroundColor Yellow
Write-Host ""
Write-Host "To use these credentials in future sessions, run:" -ForegroundColor Yellow
Write-Host "  Get-Content $envFile | ForEach-Object { `$name, `$value = `$_ -split '=', 2; Set-Content env:`$name `$value }" -ForegroundColor Gray
Write-Host ""
Write-Host "To deploy, run: .\deploy-ftp.ps1" -ForegroundColor Green