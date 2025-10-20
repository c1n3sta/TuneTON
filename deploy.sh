#!/bin/bash

# Exit on error
set -e

# Build the application
echo "Building the application..."
npm install
npm run build

# Create a temporary directory for the deployment
echo "Preparing deployment package..."
DEPLOY_DIR="/tmp/tuneton-deploy-$(date +%s)"
mkdir -p "$DEPLOY_DIR"

# Copy the built files
cp -R dist/* "$DEPLOY_DIR/"

# Create .htaccess for SPA routing
cat > "$DEPLOY_DIR/.htaccess" << 'EOL'
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
EOL

# Set proper permissions
chmod -R 755 "$DEPLOY_DIR"

# Check if FTP credentials are available
if [ -n "$FTP_HOST" ] && [ -n "$FTP_USER" ] && [ -n "$FTP_PASSWORD" ]; then
  echo "Deploying via FTP..."
  
  # Deploy using lftp if available
  if command -v lftp &> /dev/null; then
    lftp -c "
    set ftp:ssl-force true
    set ftp:ssl-protect-data true
    open -u $FTP_USER,$FTP_PASSWORD $FTP_HOST
    mirror -R $DEPLOY_DIR/ $FTP_REMOTE_DIR --delete --verbose
    bye
    "
    echo "Deployment completed successfully via FTP!"
  else
    echo "lftp not available. Please install lftp or deploy manually."
    echo "Deployment package ready at: $DEPLOY_DIR"
  fi
else
  echo "FTP credentials not configured."
  echo "Deployment package ready at: $DEPLOY_DIR"
  echo ""
  echo "To deploy via FTP, set the following environment variables:"
  echo "  export FTP_HOST=your_ftp_host"
  echo "  export FTP_USER=your_ftp_username"
  echo "  export FTP_PASSWORD=your_ftp_password"
  echo "  export FTP_REMOTE_DIR=/www/tuneton.space"
  echo ""
  echo "Then run this script again."
fi