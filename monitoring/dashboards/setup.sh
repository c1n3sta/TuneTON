#!/bin/bash

# Setup script for the all-in-one monitoring dashboard

# Create a simple HTTP server to serve the dashboard
echo "Setting up dashboard server..."

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "Starting dashboard server on port 8080 using Python 3..."
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    echo "Starting dashboard server on port 8080 using Python..."
    python -m SimpleHTTPServer 8080
else
    echo "Python not found. Please install Python to serve the dashboard."
    echo "Alternatively, you can serve the dashboard using any HTTP server:"
    echo "1. Copy the index.html file to your web server directory"
    echo "2. Serve with Node.js: npx http-server -p 8080"
    echo "3. Serve with PHP: php -S localhost:8080"
    exit 1
fi