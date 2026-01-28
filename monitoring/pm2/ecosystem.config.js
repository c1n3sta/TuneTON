module.exports = {
  apps: [{
    name: 'tuneton-backend',
    script: './server/src/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    max_memory_restart: '1G',
    error_file: './logs/tuneton-backend-err.log',
    out_file: './logs/tuneton-backend-out.log',
    log_file: './logs/tuneton-backend-combined.log',
    time: true,
    // Restart the app if it uses more than 90% of the server's RAM
    max_memory_restart: '90%',
    // Watch and restart if files change
    watch: false,
    // Merge logs from different instances
    combine_logs: true,
    // Add timestamps to logs
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // Minimum uptime to consider the app as stable
    min_uptime: 10000,
    // Maximum number of times a script can restart
    max_restarts: 10,
    // Time to wait before restarting a crashing app
    restart_delay: 4000
  }]
};