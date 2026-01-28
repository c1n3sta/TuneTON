#!/bin/bash

# Setup script for ELK stack log aggregation

# Create necessary directories
echo "Creating directories..."
mkdir -p fluentd/conf
mkdir -p ../logs

# Start ELK stack with Docker Compose
echo "Starting ELK stack..."
docker-compose up -d

echo "ELK stack setup completed!"
echo "Access Elasticsearch at: http://localhost:9200"
echo "Access Kibana at: http://localhost:5601"
echo ""
echo "Next steps:"
echo "1. Wait for services to start (may take a minute or two)"
echo "2. Log in to Kibana"
echo "3. Create an index pattern for 'tuneton-*'"
echo "4. Explore your logs in the Discover section"
echo ""
echo "You can manage the services with:"
echo "  docker-compose logs     # View logs"
echo "  docker-compose stop     # Stop the services"
echo "  docker-compose start    # Start the services"
echo "  docker-compose down     # Stop and remove containers"