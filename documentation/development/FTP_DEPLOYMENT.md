# FTP Deployment Guide for ISPmanager

## Overview

This guide provides instructions for setting up FTP access for the tuneton.space domain hosted on ISPmanager control panel and deploying the TuneTON application via FTP.

## Prerequisites

1. Access to ISPmanager control panel
2. Domain (tuneton.space) configured in ISPmanager
3. FTP client software (e.g., FileZilla, WinSCP)
4. Built application files (from `dist` directory)

## Setting up FTP Access in ISPmanager

### 1. Log into ISPmanager Control Panel

1. Open your web browser and navigate to your ISPmanager control panel URL
2. Log in with your administrator credentials

### 2. Create FTP Account

1. In the ISPmanager dashboard, locate and click on **"FTP"** or **"FTP Accounts"**
2. Click **"Add"** or **"Create FTP Account"**
3. Fill in the following details:
   - **Username**: `tuneton` (or another preferred username)
   - **Password**: Generate a strong password or enter your own
   - **Directory**: `/www/tuneton.space` (or the appropriate web root directory)
   - **Domain**: Select `tuneton.space` from the dropdown
4. Click **"Create"** or **"Save"**

### 3. Configure FTP Permissions

1. After creating the account, ensure it has the following permissions:
   - Read access: **Enabled**
   - Write access: **Enabled**
   - Directory listing: **Enabled**
2. Set appropriate file permissions:
   - Files: `644` (readable by owner, readable by group and others)
   - Directories: `755` (readable and executable by owner, readable and executable by group and others)

### 4. Note FTP Connection Details

Record the following information for your FTP client:

- **FTP Host**: Your server's IP address or hostname
- **FTP Port**: `21` (standard FTP) or `22` (SFTP if available)
- **Username**: The FTP username you created
- **Password**: The FTP password you set
- **Directory**: The root directory for your domain (usually `/www/tuneton.space`)

## Deploying via FTP

### 1. Build the Application

Before deploying, ensure you have the latest build:

```bash
npm run build
```

This creates the production-ready files in the `dist` directory.

### 2. Connect with FTP Client

Using FileZilla as an example:

1. Open FileZilla
2. Enter the connection details:
   - **Host**: Your server's IP address or hostname
   - **Username**: Your FTP username
   - **Password**: Your FTP password
   - **Port**: 21 (or 22 for SFTP)
3. Click **"Quickconnect"**

### 3. Upload Files

1. In the local site panel (left), navigate to your TuneTON project's `dist` directory
2. In the remote site panel (right), navigate to your web root directory (e.g., `/www/tuneton.space`)
3. Select all files in the local `dist` directory
4. Right-click and select **"Upload"** or drag files to the remote panel

### 4. Upload .htaccess File

Create a `.htaccess` file in the root directory with the following content for proper SPA routing:

```apache
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
```

## Alternative Deployment Methods

### Using LFTP (Command Line)

If you prefer command-line deployment:

```bash
lftp -c "open -u username,password ftp.yourserver.com; mirror -R dist/ /www/tuneton.space/"
```

### Using RSYNC over SSH (if available)

```bash
rsync -avz --delete dist/ user@tuneton.space:/www/tuneton.space/
```

## Security Considerations

1. **Use SFTP when possible**: SFTP is more secure than FTP as it encrypts data in transit
2. **Strong passwords**: Use complex passwords for FTP accounts
3. **Limit access**: Restrict FTP accounts to specific directories
4. **Regular updates**: Change FTP passwords periodically
5. **Monitor access**: Regularly review FTP access logs

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Ensure the FTP user has write permissions to the target directory
   - Check directory ownership and permissions in ISPmanager

2. **Connection Refused**
   - Verify the FTP server address and port
   - Check if the FTP service is running on the server
   - Confirm firewall settings allow FTP connections

3. **File Transfer Issues**
   - Try switching between active and passive FTP modes
   - Check available disk space on the server
   - Verify file permissions on the server

### Verification Steps

1. After deployment, visit https://tuneton.space to verify the application loads correctly
2. Check browser console for any errors
3. Test all application features to ensure proper functionality

## Automation

For regular deployments, consider setting up a deployment script:

```bash
#!/bin/bash
# deploy-ftp.sh

# Build the application
npm run build

# Upload via lftp
lftp -c "
open -u $FTP_USER,$FTP_PASSWORD $FTP_HOST
mirror -R dist/ $FTP_REMOTE_DIR --delete --verbose
bye
"
```

Set environment variables for FTP credentials:

```bash
export FTP_USER="your_ftp_username"
export FTP_PASSWORD="your_ftp_password"
export FTP_HOST="your_ftp_host"
export FTP_REMOTE_DIR="/www/tuneton.space"
```

## Backup Before Deployment

Always backup the existing site before deploying new files:

```bash
# Download current site files
lftp -c "
open -u $FTP_USER,$FTP_PASSWORD $FTP_HOST
mirror $FTP_REMOTE_DIR backup/$(date +%Y%m%d) --verbose
bye
"
```

This FTP deployment guide provides a comprehensive approach to setting up and using FTP access for deploying the TuneTON application to the tuneton.space domain hosted on ISPmanager.
