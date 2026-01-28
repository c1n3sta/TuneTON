#!/bin/bash

# Setup script for PM2 monitoring

# Install PM2 globally
echo "Installing PM2..."
npm install -g pm2

# Create logs directory
echo "Creating logs directory..."
mkdir -p logs

# Start the application with PM2
echo "Starting TuneTON backend with PM2..."
pm2 start ecosystem.config.js

# Save the PM2 configuration
echo "Saving PM2 configuration..."
pm2 save

# Setup PM2 to start on boot
echo "Setting up PM2 to start on boot..."
pm2 startup

echo "PM2 setup completed!"
echo "You can monitor your application with:"
echo "  pm2 list          # List all processes"
echo "  pm2 monit         # Monitor processes"
echo "  pm2 logs          # View logs"
echo "  pm2 stop tuneton-backend    # Stop the application"
echo "  pm2 restart tuneton-backend # Restart the application"
echo "  pm2 delete tuneton-backend  # Delete the application from PM2"