#!/bin/bash

# Secure Backend Reorganization Script
# Moves backend files from web-accessible directory to isolated application directory

echo "=== Secure Backend Reorganization ==="
echo "Moving backend files for better security isolation..."
echo ""

# Check if we're on the server (basic check)
if [[ ! -d "/www/tuneton.space" ]]; then
    echo "ERROR: This script must be run on the hosting server."
    echo "Please SSH into your server and run this script there."
    exit 1
fi

echo "1. Checking current directory structure..."
echo "Current working directory: $(pwd)"
echo ""
echo "Contents of /tuneton/:"
ls -la /tuneton/ 2>/dev/null || echo "Directory /tuneton/ does not exist or is not accessible"
echo ""
echo "Contents of /www/tuneton.space/:"
ls -la /www/tuneton.space/ 2>/dev/null || echo "Directory /www/tuneton.space/ does not exist or is not accessible"
echo ""

echo "2. Creating isolated backend directory..."
mkdir -p /tuneton/backend
echo "Created /tuneton/backend directory"
echo ""

echo "3. Copying backend files from web-accessible directory..."
if [[ -d "/www/tuneton.space/backend" ]]; then
    cp -r /www/tuneton.space/backend/* /tuneton/backend/
    echo "Copied files from /www/tuneton.space/backend/ to /tuneton/backend/"
else
    echo "WARNING: /www/tuneton.space/backend/ directory not found"
fi
echo ""

echo "4. Setting proper file permissions..."
if [[ -d "/tuneton/backend" ]]; then
    # Set directory permissions
    find /tuneton/backend -type d -exec chmod 755 {} \;
    # Set file permissions
    find /tuneton/backend -type f -exec chmod 644 {} \;
    # Restrict sensitive files
    chmod 600 /tuneton/backend/.env* 2>/dev/null || echo "No .env files to restrict"
    
    echo "Set proper permissions on backend files"
else
    echo "WARNING: /tuneton/backend directory not found"
fi
echo ""

echo "5. Verifying the copy was successful..."
if [[ -d "/tuneton/backend" ]]; then
    echo "Contents of /tuneton/backend/:"
    ls -la /tuneton/backend/
else
    echo "ERROR: /tuneton/backend directory was not created successfully"
    exit 1
fi
echo ""

echo "=== Security Reorganization Complete ==="
echo ""
echo "NEXT STEPS:"
echo "1. Test your application to ensure everything works correctly"
echo "2. Configure your web server to proxy requests to port 3001"
echo "3. Once confirmed working, you can remove the web-accessible copy:"
echo "   rm -rf /www/tuneton.space/backend/"
echo ""
echo "SECURITY BENEFITS:"
echo "- Backend code is now isolated from web-accessible directories"
echo "- Reduced attack surface by limiting direct file access"
echo "- Improved permission control over sensitive files"
echo "- Follows security best practices for web applications"