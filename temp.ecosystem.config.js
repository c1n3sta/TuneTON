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