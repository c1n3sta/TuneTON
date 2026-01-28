#!/bin/bash

# Setup script for Prometheus and Grafana monitoring

# Start Prometheus and Grafana with Docker Compose
echo "Starting Prometheus and Grafana..."
docker-compose up -d

echo "Prometheus and Grafana setup completed!"
echo "Access Prometheus at: http://localhost:9090"
echo "Access Grafana at: http://localhost:3003"
echo "Default Grafana credentials: admin/admin"
echo ""
echo "Next steps:"
echo "1. Log in to Grafana"
echo "2. Add Prometheus as a data source (URL: http://prometheus:9090)"
echo "3. Import dashboards or create your own"
echo ""
echo "You can manage the services with:"
echo "  docker-compose logs     # View logs"
echo "  docker-compose stop     # Stop the services"
echo "  docker-compose start    # Start the services"
echo "  docker-compose down     # Stop and remove containers"