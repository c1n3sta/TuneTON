#!/bin/bash

# Initial server setup script for the TuneTON monitoring suite
# This script should be run on a fresh server to prepare it for monitoring

echo "========================================="
echo "TuneTON Monitoring Server Initialization"
echo "========================================="

# Update system packages
echo "Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
echo "Installing Docker..."
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
echo "Installing PM2..."
sudo npm install -g pm2

# Create necessary directories
echo "Creating directories..."
mkdir -p logs
mkdir -p monitoring

# Set up firewall (optional - uncomment if needed)
# echo "Setting up firewall..."
# sudo ufw allow 22/tcp    # SSH
# sudo ufw allow 3001/tcp  # TuneTON backend
# sudo ufw allow 3002/tcp  # Uptime-Kuma
# sudo ufw allow 3003/tcp  # Grafana
# sudo ufw allow 5601/tcp  # Kibana
# sudo ufw allow 8080/tcp  # Monitoring dashboard
# sudo ufw allow 9090/tcp  # Prometheus
# sudo ufw allow 9200/tcp  # Elasticsearch
# sudo ufw allow 9615/tcp  # PM2 dashboard
# sudo ufw --force enable

echo ""
echo "========================================="
echo "Server initialization complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Upload the monitoring files to the server"
echo "2. Run the setup scripts in each monitoring component directory"
echo "3. Configure each monitoring tool according to the documentation"
echo ""
echo "Useful commands:"
echo "  docker --version          # Check Docker installation"
echo "  docker-compose --version  # Check Docker Compose installation"
echo "  node --version            # Check Node.js installation"
echo "  pm2 --version             # Check PM2 installation"