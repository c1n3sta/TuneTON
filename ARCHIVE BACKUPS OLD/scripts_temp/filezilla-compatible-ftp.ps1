# FileZilla Compatible FTP Script
Write-Host "FileZilla Compatible FTP Test" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

# Try to match FileZilla settings exactly
try {
    Write-Host "Creating FTP request with FileZilla-compatible settings..." -ForegroundColor Yellow
    
    $request = [System.Net.FtpWebRequest]::Create("ftp://31.31.197.37:21/")
    $request.Method = [System.Net.WebRequestMethods+Ftp]::PrintWorkingDirectory
    
    # Use credentials from .env.production
    $request.Credentials = New-Object System.Net.NetworkCredential("u3220060_tuneton_qoder", "8XIaE5MdeOK4tJv1")
    
    # Match FileZilla settings
    $request.UsePassive = $true  # MODE_DEFAULT usually means passive
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
    Write-Host "Current directory: $content" -ForegroundColor Cyan
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

# Try with different passive mode setting
Write-Host "`nTrying with passive mode disabled..." -ForegroundColor Yellow
try {
    $request = [System.Net.FtpWebRequest]::Create("ftp://31.31.197.37:21/")
    $request.Method = [System.Net.WebRequestMethods+Ftp]::PrintWorkingDirectory
    $request.Credentials = New-Object System.Net.NetworkCredential("u3220060_tuneton_qoder", "8XIaE5MdeOK4tJv1")
    
    # Try active mode
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
    Write-Host "Current directory: $content" -ForegroundColor Cyan
}
catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.InnerException) {
        Write-Host "Inner exception: $($_.Exception.InnerException.Message)" -ForegroundColor Red
    }
}