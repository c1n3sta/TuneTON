#!/usr/bin/env node

// Script to test the monitoring suite
import fetch from 'node-fetch';

async function testMonitoring() {
  const baseUrl = process.env.MONITORING_URL || 'http://localhost';
  
  console.log(`Testing monitoring suite at ${baseUrl}...\n`);
  
  // Services to test
  const services = [
    {
      name: 'PM2 Dashboard',
      url: `${baseUrl}:9615`,
      expectedStatus: 200
    },
    {
      name: 'Uptime-Kuma',
      url: `${baseUrl}:3002`,
      expectedStatus: 200
    },
    {
      name: 'Grafana',
      url: `${baseUrl}:3003`,
      expectedStatus: 200
    },
    {
      name: 'Kibana',
      url: `${baseUrl}:5601`,
      expectedStatus: 200
    },
    {
      name: 'Prometheus',
      url: `${baseUrl}:9090`,
      expectedStatus: 200
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const service of services) {
    try {
      console.log(`Testing ${service.name} at ${service.url}...`);
      const response = await fetch(service.url, { timeout: 5000 });
      
      if (response.status === service.expectedStatus) {
        console.log(`  ✓ ${service.name} is accessible`);
        passed++;
      } else {
        console.log(`  ✗ ${service.name} returned status ${response.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`  ✗ ${service.name} is not accessible: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\nMonitoring test completed!`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

// Run the test
testMonitoring();