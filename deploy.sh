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

# Deploy to ISPManager
# Replace with your actual deployment command
# Example using rsync over SSH
# rsync -avz --delete "$DEPLOY_DIR/" user@tuneton.space:/path/to/web/root/

echo "Deployment package ready at: $DEPLOY_DIR"
echo "Please deploy the contents to your ISPManager hosting"
