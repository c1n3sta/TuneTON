# Direct FTP Test Script
Write-Host "Direct FTP Connection Test" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# FTP Server Details
$ftpServer = "31.31.197.37"
$ftpPort = "21"
$username = "u3220060_tuneton_qoder"
$password = "8XIaE5MdeOK4tJv1"

Write-Host "Server: $ftpServer" -ForegroundColor Cyan
Write-Host "Port: $ftpPort" -ForegroundColor Cyan
Write-Host "Username: $username" -ForegroundColor Cyan

# Create FTP request
try {
    Write-Host "Creating FTP request..." -ForegroundColor Yellow
    
    # Simplify the URL construction
    $ftpUrl = "ftp://31.31.197.37:21"
    Write-Host "Connecting to: $ftpUrl" -ForegroundColor Cyan
    
    $request = [System.Net.FtpWebRequest]::Create($ftpUrl)
    $request.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
    $request.Credentials = New-Object System.Net.NetworkCredential($username, $password)
    $request.UsePassive = $true
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
    
    # Try with different settings
    Write-Host "Trying with passive mode disabled..." -ForegroundColor Yellow
    try {
        $ftpUrl = "ftp://31.31.197.37:21"
        $request = [System.Net.FtpWebRequest]::Create($ftpUrl)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
        $request.Credentials = New-Object System.Net.NetworkCredential($username, $password)
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
        
        Write-Host "SUCCESS with active mode!" -ForegroundColor Green
        Write-Host "Response content:" -ForegroundColor Cyan
        Write-Host $content -ForegroundColor White
    }
    catch {
        Write-Host "FAILED with active mode too: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.InnerException) {
            Write-Host "Inner exception: $($_.Exception.InnerException.Message)" -ForegroundColor Red
        }
    }
}