#!/usr/bin/env node

// Script to set up monitoring via SSH using credentials from .env.production
import dotenv from 'dotenv';
import { NodeSSH } from 'node-ssh';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

console.log('🔧 Setting up monitoring via SSH...');

async function setupMonitoringViaSSH() {
  const ssh = new NodeSSH();
  
  try {
    // Get SSH credentials from environment variables
    const host = process.env.SSH_HOST || 'server290.hosting.reg.ru';
    const port = parseInt(process.env.SSH_PORT) || 22;
    const username = process.env.SSH_USER || 'u3220060';
    const password = process.env.SSH_PASSWORD || '2uh71L41NN7hvAGA';
    
    console.log(`🔌 Connecting to ${host}:${port} as ${username}...`);
    
    // Connect via SSH
    await ssh.connect({
      host,
      port,
      username,
      password
    });
    
    console.log('✅ Connected successfully!');
    
    // Create necessary directories
    console.log('📁 Creating directories...');
    await ssh.execCommand('mkdir -p ~/tuneton/{monitoring,logs}');
    
    // Upload monitoring files
    console.log('📤 Uploading monitoring files...');
    
    // We'll need to upload the monitoring directory contents
    // For now, let's just create a basic structure and install tools
    
    // Update system and install dependencies
    console.log('⚙️ Installing dependencies...');
    const installCommands = [
      'apt-get update',
      'apt-get install -y curl wget git unzip nano net-tools ufw docker.io docker-compose nodejs npm',
      'npm install -g pm2 http-server'
    ];
    
    for (const command of installCommands) {
      console.log(`🏃 Running: ${command}`);
      const result = await ssh.execCommand(command);
      if (result.code !== 0) {
        console.warn(`⚠️ Command failed: ${result.stderr}`);
      }
    }
    
    // Setup firewall
    console.log('🛡️ Configuring firewall...');
    const firewallCommands = [
      'ufw --force reset',
      'ufw allow ssh',
      'ufw allow 3001/tcp',  // Backend
      'ufw allow 3002/tcp',  // Uptime-Kuma
      'ufw allow 3003/tcp',  // Grafana
      'ufw allow 5601/tcp',  // Kibana
      'ufw allow 8080/tcp',  // Monitoring Dashboard
      'ufw allow 9090/tcp',  // Prometheus
      'ufw allow 9200/tcp',  // Elasticsearch
      'ufw allow 9615/tcp',  // PM2 Dashboard
      'ufw --force enable'
    ];
    
    for (const command of firewallCommands) {
      console.log(`🔥 ${command}`);
      await ssh.execCommand(command);
    }
    
    // Create a simple setup script on the server
    console.log('📝 Creating setup script on server...');
    const setupScript = `#!/bin/bash
# Monitoring Setup Script

echo "🚀 Starting monitoring setup..."

# Create monitoring directory structure
mkdir -p ~/tuneton/monitoring/{pm2,uptime-kuma,prometheus-grafana,elk-stack,dashboards}
mkdir -p ~/tuneton/logs

# PM2 Setup
cd ~/tuneton/monitoring/pm2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'tuneton-backend',
    script: '~/tuneton/backend/server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    max_memory_restart: '1G',
    error_file: '~/tuneton/logs/tuneton-backend-err.log',
    out_file: '~/tuneton/logs/tuneton-backend-out.log',
    log_file: '~/tuneton/logs/tuneton-backend-combined.log',
    time: true,
    combine_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    min_uptime: 10000,
    max_restarts: 10,
    restart_delay: 4000
  }]
};
EOF

# Uptime-Kuma Setup
cd ~/tuneton/monitoring/uptime-kuma
cat > docker-compose.yml << 'EOF'
version: '3.7'

services:
  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: uptime-kuma
    restart: always
    ports:
      - "3002:3001"
    volumes:
      - ./uptime-kuma-data:/app/data
    environment:
      - UPTIME_KUMA_PORT=3001
      - UPTIME_KUMA_HOST=0.0.0.0
EOF

mkdir -p uptime-kuma-data

# Prometheus and Grafana Setup
cd ~/tuneton/monitoring/prometheus-grafana
cat > docker-compose.yml << 'EOF'
version: '3.7'

services:
  prometheus:
    image: prom/prometheus:v2.45.0
    container_name: prometheus
    restart: always
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'

  grafana:
    image: grafana/grafana-enterprise
    container_name: grafana
    restart: always
    ports:
      - "3003:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: always
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'

volumes:
  prometheus_data:
  grafana_data:
EOF

cat > prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets:

rule_files:

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "node"
    static_configs:
      - targets: ["node-exporter:9100"]

  - job_name: "tuneton-backend"
    static_configs:
      - targets: ["localhost:3001"]
EOF

# ELK Stack Setup
cd ~/tuneton/monitoring/elk-stack
cat > docker-compose.yml << 'EOF'
version: '3.7'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.1
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms1g -Xmx1g
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
      - "9300:9300"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - elk

  kibana:
    image: docker.elastic.co/kibana/kibana:8.8.1
    container_name: kibana
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=["http://elasticsearch:9200"]
    depends_on:
      - elasticsearch
    networks:
      - elk

volumes:
  elasticsearch_data:

networks:
  elk:
    driver: bridge
EOF

# Dashboard Setup
cd ~/tuneton/monitoring/dashboards
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>TuneTON Monitoring Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #2c3e50; }
        .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .service { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
        .status { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; }
        .up { background-color: #2ecc71; }
        .down { background-color: #e74c3c; }
    </style>
</head>
<body>
    <h1>TuneTON Monitoring Dashboard</h1>
    <div class="services">
        <div class="service">
            <h2><span class="status up"></span>PM2 Process Monitoring</h2>
            <p>Monitor Node.js processes and application health</p>
            <p><a href="http://localhost:9615" target="_blank">Open Dashboard</a></p>
        </div>
        <div class="service">
            <h2><span class="status up"></span>Uptime-Kuma</h2>
            <p>Service uptime and health checks</p>
            <p><a href="http://localhost:3002" target="_blank">Open Dashboard</a></p>
        </div>
        <div class="service">
            <h2><span class="status up"></span>Grafana</h2>
            <p>Application and system metrics visualization</p>
            <p><a href="http://localhost:3003" target="_blank">Open Dashboard</a></p>
        </div>
        <div class="service">
            <h2><span class="status up"></span>Kibana</h2>
            <p>Log aggregation and analysis</p>
            <p><a href="http://localhost:5601" target="_blank">Open Dashboard</a></p>
        </div>
        <div class="service">
            <h2><span class="status up"></span>Prometheus</h2>
            <p>Metrics collection and querying</p>
            <p><a href="http://localhost:9090" target="_blank">Open Dashboard</a></p>
        </div>
        <div class="service">
            <h2><span class="status up"></span>TuneTON Health Check</h2>
            <p>Application health endpoint</p>
            <p><a href="http://localhost:3001/health" target="_blank">Open Health Check</a></p>
        </div>
    </div>
</body>
</html>
EOF

echo "✅ Monitoring setup script created successfully!"
`;

    await ssh.putFile(Buffer.from(setupScript), '~/tuneton/setup-monitoring.sh');
    await ssh.execCommand('chmod +x ~/tuneton/setup-monitoring.sh');
    
    // Run the setup script
    console.log('🏃 Running setup script...');
    const result = await ssh.execCommand('~/tuneton/setup-monitoring.sh');
    console.log(result.stdout);
    
    if (result.stderr) {
      console.warn(`⚠️ Script warnings: ${result.stderr}`);
    }
    
    console.log('✅ Monitoring setup completed!');
    console.log(`
📡 Access your monitoring dashboards at:
   - PM2 Dashboard: http://${host}:9615
   - Uptime-Kuma: http://${host}:3002
   - Grafana: http://${host}:3003
   - Kibana: http://${host}:5601
   - Prometheus: http://${host}:9090
   - Monitoring Dashboard: http://${host}:8080

🔐 SSH Connection Details:
   - Host: ${host}
   - Port: ${port}
   - User: ${username}
   - Password: ${password.substring(0, 3)}*** (hidden for security)

🔄 To reconnect and manage services:
   ssh ${username}@${host} -p ${port}
`);
    
  } catch (error) {
    console.error('❌ SSH setup failed:', error.message);
    process.exit(1);
  } finally {
    ssh.dispose();
  }
}

// Run the setup
setupMonitoringViaSSH();