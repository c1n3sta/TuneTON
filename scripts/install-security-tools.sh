#!/bin/bash

# Install script for security reorganization tools

echo "Installing dependencies for security reorganization scripts..."

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "ERROR: package.json not found. Please run this script from the scripts directory."
    exit 1
fi

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

echo ""
echo "Installation complete!"
echo ""
echo "Available scripts:"
echo "  npm run reorganize     - Show manual reorganization instructions"
echo "  npm run deploy-secure  - Run secure deployment (requires server access)"
echo ""
echo "To run the security reorganization on your server:"
echo "1. SSH into your server"
echo "2. Copy the secure-backend-reorg.sh script to your server"
echo "3. Run: chmod +x secure-backend-reorg.sh"
echo "4. Run: ./secure-backend-reorg.sh"