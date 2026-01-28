#!/bin/bash

# Master setup script for all TuneTON monitoring components

echo "========================================="
echo "TuneTON Monitoring Suite Setup"
echo "========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker to proceed."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose to proceed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js to proceed."
    exit 1
fi

echo "All prerequisites found. Starting setup..."

# Setup PM2
echo ""
echo "-----------------------------------------"
echo "Setting up PM2 Process Monitoring..."
echo "-----------------------------------------"
cd pm2
chmod +x setup.sh
./setup.sh
cd ..

# Setup Uptime-Kuma
echo ""
echo "-----------------------------------------"
echo "Setting up Uptime-Kuma..."
echo "-----------------------------------------"
cd uptime-kuma
chmod +x setup.sh
./setup.sh
cd ..

# Setup Prometheus and Grafana
echo ""
echo "-----------------------------------------"
echo "Setting up Prometheus and Grafana..."
echo "-----------------------------------------"
cd prometheus-grafana
chmod +x setup.sh
./setup.sh
cd ..

# Setup ELK Stack
echo ""
echo "-----------------------------------------"
echo "Setting up ELK Stack..."
echo "-----------------------------------------"
cd elk-stack
chmod +x setup.sh
./setup.sh
cd ..

# Setup Dashboard
echo ""
echo "-----------------------------------------"
echo "Setting up Monitoring Dashboard..."
echo "-----------------------------------------"
cd dashboards
chmod +x setup.sh
echo "Dashboard setup complete. Run 'npm install -g http-server' and then 'npx http-server -p 8080' to serve the dashboard."
cd ..

echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Monitoring services are now running:"
echo "  PM2 Dashboard: http://localhost:9615"
echo "  Uptime-Kuma: http://localhost:3002"
echo "  Grafana: http://localhost:3003 (admin/admin)"
echo "  Kibana: http://localhost:5601"
echo "  Prometheus: http://localhost:9090"
echo ""
echo "To serve the all-in-one dashboard:"
echo "  cd monitoring/dashboards"
echo "  npx http-server -p 8080"
echo "  Then visit: http://localhost:8080"
echo ""
echo "Note: Some services may take a minute to fully initialize."