# Verify FTP Credentials Script
Write-Host "Verifying FTP Credentials" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green

# Credentials from FileZilla settings
Write-Host "FileZilla Settings:" -ForegroundColor Yellow
Write-Host "  Host: 31.31.197.37" -ForegroundColor Cyan
Write-Host "  Port: 21" -ForegroundColor Cyan
Write-Host "  User: u3220060_tuneton_qoder" -ForegroundColor Cyan
Write-Host "  Logontype: 2" -ForegroundColor Cyan
Write-Host "  PasvMode: MODE_DEFAULT" -ForegroundColor Cyan

# Credentials from .env.production
Write-Host "`n.env.production Settings:" -ForegroundColor Yellow
Write-Host "  FTP_HOST: 31.31.197.37" -ForegroundColor Cyan
Write-Host "  FTP_USER: u3220060_tuneton_qoder" -ForegroundColor Cyan
Write-Host "  FTP_PASSWORD: 8XIaE5MdeOK4tJv1" -ForegroundColor Cyan
Write-Host "  FTP_REMOTE_DIR: /www/tuneTON.space" -ForegroundColor Cyan

# Test different password possibilities
$passwordsToTry = @(
    "8XIaE5MdeOK4tJv1",
    "8XIaE5MdeOK4tJv1`r",
    "8XIaE5MdeOK4tJv1`n",
    "8XIaE5MdeOK4tJv1`r`n"
)

foreach ($password in $passwordsToTry) {
    Write-Host "`nTesting with password (length: $($password.Length)): '$password'" -ForegroundColor Yellow
    
    try {
        $request = [System.Net.FtpWebRequest]::Create("ftp://31.31.197.37:21/")
        $request.Method = [System.Net.WebRequestMethods+Ftp]::PrintWorkingDirectory
        $request.Credentials = New-Object System.Net.NetworkCredential("u3220060_tuneton_qoder", $password)
        $request.UsePassive = $true
        $request.UseBinary = $true
        $request.KeepAlive = $false
        $request.Timeout = 10000
        
        $response = $request.GetResponse()
        $response.Close()
        
        Write-Host "SUCCESS with password: '$password'" -ForegroundColor Green
        break
    }
    catch {
        Write-Host "FAILED with password: '$password' - $($_.Exception.Message)" -ForegroundColor Red
    }
}