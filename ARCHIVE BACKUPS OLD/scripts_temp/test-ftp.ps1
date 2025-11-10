# Test FTP Connection Script

# Load environment variables from .env.production file
$envFilePath = ".\.env.production"
if (Test-Path $envFilePath) {
    Write-Host "Loading environment variables from $envFilePath..." -ForegroundColor Green
    Get-Content $envFilePath | ForEach-Object {
        if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Remove surrounding quotes if present
            if ($value.StartsWith('"') -and $value.EndsWith('"')) {
                $value = $value.Substring(1, $value.Length - 2)
            }
            # Set environment variable for the current process
            [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}

# Display credentials (for testing only - remove in production)
Write-Host "FTP_HOST: $($env:FTP_HOST)" -ForegroundColor Cyan
Write-Host "FTP_USER: $($env:FTP_USER)" -ForegroundColor Cyan
Write-Host "FTP_PASSWORD: $($env:FTP_PASSWORD)" -ForegroundColor Cyan
Write-Host "FTP_REMOTE_DIR: $($env:FTP_REMOTE_DIR)" -ForegroundColor Cyan

# Test FTP connection using .NET FTP client
try {
    Write-Host "Testing FTP connection..." -ForegroundColor Yellow
    
    # Include port 21 in the FTP URL
    $request = [System.Net.FtpWebRequest]::Create("ftp://$($env:FTP_HOST):21")
    $request.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
    $request.Credentials = New-Object System.Net.NetworkCredential($env:FTP_USER, $env:FTP_PASSWORD)
    $request.UsePassive = $true
    $request.KeepAlive = $false
    
    $response = $request.GetResponse()
    $responseStream = $response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($responseStream)
    $directories = $reader.ReadToEnd()
    $reader.Close()
    $response.Close()
    
    Write-Host "FTP connection successful!" -ForegroundColor Green
    Write-Host "Directories found:" -ForegroundColor Cyan
    Write-Host $directories -ForegroundColor White
}
catch {
    Write-Host "FTP connection failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.InnerException) {
        Write-Host "Inner exception: $($_.Exception.InnerException.Message)" -ForegroundColor Red
    }
}