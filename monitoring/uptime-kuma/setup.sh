#!/bin/bash

# Setup script for Uptime-Kuma monitoring

# Create data directory
echo "Creating data directory..."
mkdir -p uptime-kuma-data

# Start Uptime-Kuma with Docker Compose
echo "Starting Uptime-Kuma..."
docker-compose up -d

echo "Uptime-Kuma setup completed!"
echo "Access the dashboard at: http://localhost:3002"
echo "You can manage the service with:"
echo "  docker-compose logs     # View logs"
echo "  docker-compose stop     # Stop the service"
echo "  docker-compose start    # Start the service"
echo "  docker-compose down     # Stop and remove containers"