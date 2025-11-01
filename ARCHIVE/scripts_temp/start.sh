#!/bin/bash

# Startup script for TuneTON application
echo "Starting TuneTON application..."

# Install dependencies
echo "Installing dependencies..."
./scripts/install-dependencies.sh

# Start the development server
echo "Starting development server..."
npm run dev