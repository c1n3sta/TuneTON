# TuneTON Monitoring Suite Usage Guide

This guide explains how to use the comprehensive monitoring suite for the TuneTON application.

## Prerequisites

Before setting up the monitoring suite, ensure you have the following installed:
- Docker and Docker Compose
- Node.js (v14 or higher)
- npm (comes with Node.js)

## Quick Start

To set up all monitoring components at once:

```bash
# On Linux/macOS
cd monitoring
chmod +x setup-all.sh
./setup-all.sh

# On Windows
cd monitoring
setup-all.bat
```

## Component Details

### 1. PM2 Process Monitoring

PM2 is used to manage and monitor the Node.js processes of the TuneTON backend.

#### Setup
```bash
cd monitoring/pm2
chmod +x setup.sh
./setup.sh
```

#### Usage
```bash
# View process list
pm2 list

# Monitor processes in real-time
pm2 monit

# View logs
pm2 logs

# Restart the application
pm2 restart tuneton-backend

# Stop the application
pm2 stop tuneton-backend
```

### 2. Uptime-Kuma

Uptime-Kuma provides uptime monitoring for your services with a beautiful dashboard.

#### Setup
```bash
cd monitoring/uptime-kuma
chmod +x setup.sh
./setup.sh
```

#### Access
Open your browser and go to: http://localhost:3002

#### Configuration
1. Create an admin account on first access
2. Add monitors for:
   - TuneTON backend health endpoint: http://localhost:3001/health
   - Other critical services as needed

### 3. Prometheus + Grafana

Prometheus collects metrics, and Grafana visualizes them in dashboards.

#### Setup
```bash
cd monitoring/prometheus-grafana
chmod +x setup.sh
./setup.sh
```

#### Access
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3003 (default credentials: admin/admin)

#### Configuration
1. Log in to Grafana
2. Add Prometheus as a data source:
   - URL: http://prometheus:9090 (if using Docker) or http://localhost:9090
3. Import dashboards or create your own

### 4. ELK Stack (Elasticsearch, Logstash, Kibana)

The ELK stack provides centralized log aggregation and analysis.

#### Setup
```bash
cd monitoring/elk-stack
chmod +x setup.sh
./setup.sh
```

#### Access
- Elasticsearch: http://localhost:9200
- Kibana: http://localhost:5601

#### Configuration
1. Wait for services to initialize (may take 1-2 minutes)
2. Log in to Kibana
3. Create an index pattern for "tuneton-*"
4. Explore logs in the Discover section

### 5. All-in-One Dashboard

The all-in-one dashboard provides a unified view of all monitoring components.

#### Setup
```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Navigate to the dashboard directory
cd monitoring/dashboards

# Serve the dashboard
npx http-server -p 8080
```

#### Access
Open your browser and go to: http://localhost:8080

## Instrumenting Your Application

To get the most out of the monitoring suite, instrument your TuneTON backend application.

### Adding Prometheus Metrics to Your Node.js App

1. Install the prometheus-client:
```bash
cd server
npm install prom-client
```

2. Add metrics collection to your Express app (in server/src/index.js):
```javascript
const client = require('prom-client');

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'tuneton-app'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestTimer = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

// Register the histogram
register.registerMetric(httpRequestTimer);

// Middleware to measure requests
app.use((req, res, next) => {
  const end = httpRequestTimer.startTimer();
  res.on('finish', () => {
    end({
      method: req.method,
      route: req.path,
      status_code: res.statusCode
    });
  });
  next();
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

3. Restart your application with PM2:
```bash
pm2 restart tuneton-backend
```

## Alerting

Set up alerts in each monitoring tool:

1. **Uptime-Kuma**: Configure notification channels (email, Telegram, etc.) and set up alerts for downtime
2. **Grafana**: Create alert rules based on metrics and configure notification channels
3. **PM2**: Configure event system to send notifications on process events

## Maintenance

Regular maintenance tasks:

1. **Clean up old data**:
   - Prometheus: Adjust retention time in docker-compose.yml
   - ELK: Set up index lifecycle policies in Kibana

2. **Update monitoring tools**:
   - Pull latest Docker images periodically
   - Update PM2: `npm update -g pm2`

3. **Backup configurations**:
   - Backup Grafana dashboards
   - Backup Uptime-Kuma database
   - Keep copies of all configuration files

## Troubleshooting

Common issues and solutions:

1. **Services not starting**:
   - Check Docker logs: `docker-compose logs`
   - Ensure ports are not already in use
   - Verify Docker and Docker Compose are properly installed

2. **Cannot access dashboards**:
   - Check if services are running: `docker-compose ps`
   - Verify port mappings in docker-compose.yml
   - Check firewall settings

3. **No metrics appearing in Grafana**:
   - Verify Prometheus can reach the target endpoints
   - Check the /metrics endpoint is accessible
   - Ensure proper network configuration in Docker

4. **Logs not appearing in Kibana**:
   - Verify Fluentd is properly configured
   - Check log file paths
   - Ensure Elasticsearch is accepting data

## Customization

You can customize the monitoring suite for your specific needs:

1. **Add more metrics**: Extend the Prometheus instrumentation
2. **Create custom dashboards**: Build Grafana dashboards for specific metrics
3. **Add more monitors**: Configure additional uptime checks in Uptime-Kuma
4. **Enhance logging**: Add more detailed logging in your application

## Security Considerations

When deploying monitoring tools in production:

1. **Change default passwords**: Update admin credentials for all tools
2. **Restrict access**: Use reverse proxies with authentication
3. **Enable HTTPS**: Configure SSL/TLS for all monitoring endpoints
4. **Network isolation**: Use Docker networks to isolate monitoring tools
5. **Regular updates**: Keep all monitoring tools updated with security patches