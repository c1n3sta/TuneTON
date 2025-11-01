# Robust FTP Deployment Script for TuneTON

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
} else {
    Write-Host "Environment file not found: $envFilePath" -ForegroundColor Yellow
}

# Debug: Show FTP environment variables
Write-Host "FTP Environment Variables:" -ForegroundColor Cyan
Write-Host "FTP_HOST: $($env:FTP_HOST)" -ForegroundColor Cyan
Write-Host "FTP_USER: $($env:FTP_USER)" -ForegroundColor Cyan
Write-Host "FTP_PASSWORD: $($env:FTP_PASSWORD)" -ForegroundColor Cyan
Write-Host "FTP_REMOTE_DIR: $($env:FTP_REMOTE_DIR)" -ForegroundColor Cyan

# Build the application
Write-Host "Building the application..." -ForegroundColor Green
npm install
npm run build

# Create a temporary directory for the deployment
Write-Host "Preparing deployment package..." -ForegroundColor Green
$DeployDir = "$env:TEMP\tuneton-deploy-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $DeployDir -Force | Out-Null

# Copy the built files
Copy-Item -Path "dist\*" -Destination $DeployDir -Recurse

# Create .htaccess for SPA routing
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable CORS for API requests
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
'@

Set-Content -Path "$DeployDir\.htaccess" -Value $htaccessContent

# Set proper permissions (simulated in Windows)
# In Windows, we'll ensure the files are readable
Get-ChildItem -Path $DeployDir -Recurse | ForEach-Object {
    if ($_.PSIsContainer) {
        # For directories, ensure they're accessible
        $_.Attributes = "Directory"
    } else {
        # For files, ensure they're not read-only
        $_.Attributes = $_.Attributes -band -bnot [System.IO.FileAttributes]::ReadOnly
    }
}

# Check if FTP credentials are available
if ($env:FTP_HOST -and $env:FTP_USER -and $env:FTP_PASSWORD) {
    Write-Host "Deploying via FTP..." -ForegroundColor Green
    
    try {
        # Test connection first
        Write-Host "Testing FTP connection..." -ForegroundColor Yellow
        $testRequest = [System.Net.FtpWebRequest]::Create("ftp://$($env:FTP_HOST):21/")
        $testRequest.Method = [System.Net.WebRequestMethods+Ftp]::PrintWorkingDirectory
        $testRequest.Credentials = New-Object System.Net.NetworkCredential($env:FTP_USER, $env:FTP_PASSWORD)
        $testRequest.UsePassive = $true
        $testRequest.UseBinary = $true
        $testRequest.KeepAlive = $false
        $testRequest.Timeout = 30000
        
        $testResponse = $testRequest.GetResponse()
        $testResponse.Close()
        Write-Host "FTP connection test successful!" -ForegroundColor Green
        
        # Create FTP request for directory creation (if needed)
        Write-Host "Uploading files to FTP server..." -ForegroundColor Yellow
        
        # Get all files to upload
        $files = Get-ChildItem -Path $DeployDir -Recurse -File
        
        $uploadedCount = 0
        $failedCount = 0
        
        foreach ($file in $files) {
            try {
                # Calculate relative path
                $relativePath = $file.FullName.Substring($DeployDir.Length).TrimStart('\')
                $ftpPath = "ftp://$($env:FTP_HOST):21/$($env:FTP_REMOTE_DIR)/$relativePath".Replace('\', '/')
                
                # Upload file
                $request = [System.Net.FtpWebRequest]::Create($ftpPath)
                $request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
                $request.Credentials = New-Object System.Net.NetworkCredential($env:FTP_USER, $env:FTP_PASSWORD)
                $request.UseBinary = $true
                $request.UsePassive = $true
                $request.KeepAlive = $false
                $request.Timeout = 30000
                
                # Read file content
                $fileContent = [System.IO.File]::ReadAllBytes($file.FullName)
                $request.ContentLength = $fileContent.Length
                
                # Upload
                $requestStream = $request.GetRequestStream()
                $requestStream.Write($fileContent, 0, $fileContent.Length)
                $requestStream.Close()
                
                # Get response
                $response = $request.GetResponse()
                Write-Host "Uploaded: $relativePath" -ForegroundColor Cyan
                $response.Close()
                
                $uploadedCount++
            }
            catch {
                Write-Host "Failed to upload: $relativePath - $($_.Exception.Message)" -ForegroundColor Red
                $failedCount++
            }
        }
        
        Write-Host "Deployment completed! Uploaded: $uploadedCount, Failed: $failedCount" -ForegroundColor Green
        if ($failedCount -eq 0) {
            Write-Host "All files deployed successfully via FTP!" -ForegroundColor Green
        } else {
            Write-Host "Some files failed to deploy. Check the errors above." -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "FTP deployment failed: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.InnerException) {
            Write-Host "Inner exception: $($_.Exception.InnerException.Message)" -ForegroundColor Red
        }
        Write-Host "Deployment package ready at: $DeployDir" -ForegroundColor Yellow
    }
}
else {
    Write-Host "FTP credentials not configured." -ForegroundColor Yellow
    Write-Host "Deployment package ready at: $DeployDir" -ForegroundColor Green
    Write-Host ""
    Write-Host "To deploy via FTP, set the following environment variables:" -ForegroundColor Yellow
    Write-Host "  `$env:FTP_HOST=`"your_ftp_host`"" -ForegroundColor Gray
    Write-Host "  `$env:FTP_USER=`"your_ftp_username`"" -ForegroundColor Gray
    Write-Host "  `$env:FTP_PASSWORD=`"your_ftp_password`"" -ForegroundColor Gray
    Write-Host "  `$env:FTP_REMOTE_DIR=`"/www/tuneton.space`"" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Then run this script again." -ForegroundColor Yellow
}