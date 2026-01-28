# Deploying the TuneTON Monitoring Suite

This document explains how to deploy and set up the monitoring suite on your hosting platform (tuneton.space).

## Overview

The monitoring suite consists of several components that work together to provide comprehensive monitoring of your TuneTON application:

1. **PM2** - Process monitoring for the Node.js backend
2. **Uptime-Kuma** - Service uptime monitoring
3. **Prometheus + Grafana** - Metrics collection and visualization
4. **ELK Stack** - Log aggregation and analysis
5. **All-in-One Dashboard** - Unified view of all monitoring components

## Deployment Process

### 1. Deploy Monitoring Files

First, deploy the monitoring suite files to your hosting platform:

```bash
npm run deploy:monitoring
```

This command will upload all monitoring configuration files to the `monitoring` directory on your server.

### 2. SSH into Your Server

Connect to your server via SSH to set up the monitoring components:

```bash
ssh username@your-server-ip
```

### 3. Navigate to the Monitoring Directory

```bash
cd monitoring
```

### 4. Set Up Each Component

#### PM2 Process Monitoring

```bash
cd pm2
chmod +x setup.sh
./setup.sh
cd ..
```

This will:
- Install PM2 globally
- Start your TuneTON backend with PM2
- Set up PM2 to start on boot

#### Uptime-Kuma

```bash
cd uptime-kuma
chmod +x setup.sh
./setup.sh
cd ..
```

This will:
- Start Uptime-Kuma using Docker Compose
- Make it accessible on port 3002

#### Prometheus and Grafana

```bash
cd prometheus-grafana
chmod +x setup.sh
./setup.sh
cd ..
```

This will:
- Start Prometheus and Grafana using Docker Compose
- Make Prometheus accessible on port 9090
- Make Grafana accessible on port 3003

#### ELK Stack

```bash
cd elk-stack
chmod +x setup.sh
./setup.sh
cd ..
```

This will:
- Start Elasticsearch, Kibana, and Fluentd using Docker Compose
- Make Elasticsearch accessible on port 9200
- Make Kibana accessible on port 5601

### 5. Serve the All-in-One Dashboard

The all-in-one dashboard provides a unified view of all monitoring components:

```bash
cd dashboards
npm install -g http-server
npx http-server -p 8080
```

This will serve the dashboard on port 8080.

## Accessing the Monitoring Tools

After deployment, you can access the monitoring tools at the following URLs:

- **All-in-One Dashboard**: http://your-server-ip:8080
- **PM2 Dashboard**: http://your-server-ip:9615
- **Uptime-Kuma**: http://your-server-ip:3002
- **Grafana**: http://your-server-ip:3003
- **Kibana**: http://your-server-ip:5601
- **Prometheus**: http://your-server-ip:9090

## Configuring the Monitoring Tools

### Uptime-Kuma Configuration

1. Open Uptime-Kuma in your browser
2. Create an admin account
3. Add monitors for your services:
   - TuneTON backend health endpoint: http://localhost:3001/health
   - Other critical endpoints as needed

### Grafana Configuration

1. Open Grafana in your browser (default credentials: admin/admin)
2. Add Prometheus as a data source:
   - URL: http://prometheus:9090 (if using Docker) or http://localhost:9090
3. Import dashboards or create your own

### Kibana Configuration

1. Open Kibana in your browser
2. Create an index pattern for "tuneton-*"
3. Explore logs in the Discover section

## Instrumenting Your Application

To get the most out of the monitoring suite, instrument your TuneTON backend application with Prometheus metrics.

### Adding Prometheus Metrics

1. SSH into your server
2. Navigate to your TuneTON backend directory
3. Install the prometheus-client:
   ```bash
   npm install prom-client
   ```

4. Modify your Express app (server/src/index.js) to expose metrics:
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

5. Restart your application with PM2:
   ```bash
   pm2 restart tuneton-backend
   ```

## Managing the Monitoring Suite

### Starting All Services

To start all monitoring services:

```bash
cd monitoring
chmod +x setup-all.sh
./setup-all.sh
```

### Stopping Services

To stop all Docker-based services:

```bash
cd monitoring/prometheus-grafana
docker-compose down
cd ../uptime-kuma
docker-compose down
cd ../elk-stack
docker-compose down
```

To stop PM2-managed services:

```bash
pm2 stop tuneton-backend
```

### Viewing Logs

To view logs from Docker services:

```bash
cd monitoring/prometheus-grafana
docker-compose logs
```

To view PM2 logs:

```bash
pm2 logs
```

## Troubleshooting

### Common Issues

1. **Ports already in use**:
   - Check if services are already running: `netstat -tulpn | grep :port`
   - Stop conflicting services or change ports in docker-compose.yml

2. **Docker permissions**:
   - Add your user to the docker group: `sudo usermod -aG docker $USER`
   - Log out and back in for changes to take effect

3. **Insufficient memory**:
   - Monitor memory usage: `free -h`
   - Adjust memory limits in docker-compose.yml if needed

4. **Services not accessible**:
   - Check firewall settings: `ufw status`
   - Ensure ports are allowed through the firewall

### Checking Service Status

To check if services are running:

```bash
# Check Docker services
docker-compose ps

# Check PM2 processes
pm2 list
```

## Security Considerations

When deploying monitoring tools in production:

1. **Change default passwords**:
   - Update admin credentials for Grafana, Kibana, etc.
   - Use strong, unique passwords for each service

2. **Restrict access**:
   - Use reverse proxies with authentication
   - Restrict access by IP address where possible

3. **Enable HTTPS**:
   - Configure SSL/TLS for all monitoring endpoints
   - Use Let's Encrypt for free certificates

4. **Regular updates**:
   - Keep all monitoring tools updated with security patches
   - Subscribe to security advisories for each tool

## Maintenance

Regular maintenance tasks:

1. **Clean up old data**:
   - Prometheus: Adjust retention time in docker-compose.yml
   - ELK: Set up index lifecycle policies in Kibana

2. **Backup configurations**:
   - Backup Grafana dashboards
   - Backup Uptime-Kuma database
   - Keep copies of all configuration files

3. **Monitor resource usage**:
   - Check disk space regularly
   - Monitor CPU and memory usage
   - Set up alerts for resource exhaustion

## Conclusion

The TuneTON monitoring suite provides comprehensive monitoring capabilities for your application. By following this guide, you can deploy and configure all components to gain valuable insights into your application's performance, uptime, and health.

Regular monitoring and maintenance will help ensure your TuneTON application runs smoothly and any issues are detected and resolved quickly.