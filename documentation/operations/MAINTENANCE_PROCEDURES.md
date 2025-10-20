# Maintenance Procedures Documentation

## Overview

This document provides detailed procedures for the ongoing maintenance of the TuneTON application, including routine maintenance tasks, emergency procedures, system updates, and operational best practices to ensure system reliability, performance, and security.

## Routine Maintenance

### Daily Maintenance Tasks

#### System Health Checks

```bash
#!/bin/bash
# Daily health check script
LOG_FILE="/var/log/tuneton/daily_health_check.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting daily health check" >> $LOG_FILE

# Check application status
if systemctl is-active --quiet tuneton-app; then
    echo "[$DATE] Application is running" >> $LOG_FILE
else
    echo "[$DATE] ERROR: Application is not running" >> $LOG_FILE
    # Send alert
    curl -X POST -H "Content-Type: application/json" \
         -d '{"text":"Daily Health Check: Application is down"}' \
         $SLACK_WEBHOOK_URL
fi

# Check database connectivity
if pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; then
    echo "[$DATE] Database is accessible" >> $LOG_FILE
else
    echo "[$DATE] ERROR: Database is not accessible" >> $LOG_FILE
fi

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "[$DATE] WARNING: Disk usage is ${DISK_USAGE}%" >> $LOG_FILE
fi

# Check memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
if [ $MEMORY_USAGE -gt 80 ]; then
    echo "[$DATE] WARNING: Memory usage is ${MEMORY_USAGE}%" >> $LOG_FILE
fi

echo "[$DATE] Daily health check completed" >> $LOG_FILE
```

#### Log Rotation and Archiving

```bash
#!/bin/bash
# Log rotation script
LOG_DIR="/var/log/tuneton"
ARCHIVE_DIR="/var/log/tuneton/archive"
DATE=$(date +%Y%m%d)

# Create archive directory if it doesn't exist
mkdir -p $ARCHIVE_DIR

# Rotate application logs
if [ -f "$LOG_DIR/application.log" ]; then
    # Check if log file is larger than 100MB
    if [ $(stat -c%s "$LOG_DIR/application.log") -gt 104857600 ]; then
        mv $LOG_DIR/application.log $ARCHIVE_DIR/application_$DATE.log
        touch $LOG_DIR/application.log
        gzip $ARCHIVE_DIR/application_$DATE.log
    fi
fi

# Rotate error logs
if [ -f "$LOG_DIR/error.log" ]; then
    if [ $(stat -c%s "$LOG_DIR/error.log") -gt 104857600 ]; then
        mv $LOG_DIR/error.log $ARCHIVE_DIR/error_$DATE.log
        touch $LOG_DIR/error.log
        gzip $ARCHIVE_DIR/error_$DATE.log
    fi
fi

# Clean up old archives (older than 90 days)
find $ARCHIVE_DIR -name "*.log.gz" -mtime +90 -delete
```

#### Backup Verification

```bash
#!/bin/bash
# Backup verification script
BACKUP_DIR="/backups"
LOG_FILE="/var/log/tuneton/backup_verification.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting backup verification" >> $LOG_FILE

# Verify database backups
LATEST_DB_BACKUP=$(ls -t $BACKUP_DIR/database/db_backup_*.sql.gz.gpg | head -1)
if [ -f "$LATEST_DB_BACKUP" ]; then
    # Check file integrity
    if gpg --verify $LATEST_DB_BACKUP 2>/dev/null; then
        echo "[$DATE] Database backup integrity verified" >> $LOG_FILE
    else
        echo "[$DATE] ERROR: Database backup integrity check failed" >> $LOG_FILE
        # Send alert
    fi
else
    echo "[$DATE] ERROR: No database backup found" >> $LOG_FILE
fi

# Verify application backups
LATEST_APP_BACKUP=$(ls -t $BACKUP_DIR/application/app_backup_*.tar.gz | head -1)
if [ -f "$LATEST_APP_BACKUP" ]; then
    # Check file integrity
    if tar -tzf $LATEST_APP_BACKUP >/dev/null 2>&1; then
        echo "[$DATE] Application backup integrity verified" >> $LOG_FILE
    else
        echo "[$DATE] ERROR: Application backup integrity check failed" >> $LOG_FILE
    fi
else
    echo "[$DATE] ERROR: No application backup found" >> $LOG_FILE
fi

echo "[$DATE] Backup verification completed" >> $LOG_FILE
```

### Weekly Maintenance Tasks

#### Database Maintenance

```sql
-- Weekly database maintenance script
-- Run as part of scheduled maintenance

-- Update table statistics for query planner
ANALYZE;

-- Reindex frequently updated tables
REINDEX TABLE users;
REINDEX TABLE playbacks;
REINDEX TABLE sessions;

-- Clean up old sessions
DELETE FROM sessions WHERE expires_at < NOW();

-- Vacuum database to reclaim storage
VACUUM ANALYZE;

-- Check for constraint violations
SELECT conname, conrelid::regclass FROM pg_constraint WHERE NOT convalidated;
```

#### Security Updates

```bash
#!/bin/bash
# Weekly security update script
LOG_FILE="/var/log/tuneton/security_updates.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting security updates" >> $LOG_FILE

# Update package lists
apt update >> $LOG_FILE 2>&1

# Apply security updates
apt upgrade -y --only-upgrade >> $LOG_FILE 2>&1

# Update Node.js dependencies
cd /app
npm audit fix >> $LOG_FILE 2>&1

# Update Rust dependencies
cd /app/src/wasm
cargo update >> $LOG_FILE 2>&1

# Restart services to apply updates
systemctl restart tuneton-app >> $LOG_FILE 2>&1

echo "[$DATE] Security updates completed" >> $LOG_FILE
```

#### Performance Monitoring Review

```bash
#!/bin/bash
# Weekly performance review script
LOG_FILE="/var/log/tuneton/performance_review.log"
REPORT_DIR="/var/reports/performance"
DATE=$(date '+%Y-%m-%d')

mkdir -p $REPORT_DIR

# Generate performance report
echo "Weekly Performance Report - $DATE" > $REPORT_DIR/weekly_performance_$DATE.txt
echo "===================================" >> $REPORT_DIR/weekly_performance_$DATE.txt

# Application response times
echo "Application Response Times:" >> $REPORT_DIR/weekly_performance_$DATE.txt
awk '{sum+=$1; count++} END {print "Average: " sum/count "ms"}' /var/log/tuneton/response_times.log >> $REPORT_DIR/weekly_performance_$DATE.txt

# Database query performance
echo -e "\nDatabase Query Performance:" >> $REPORT_DIR/weekly_performance_$DATE.txt
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;" >> $REPORT_DIR/weekly_performance_$DATE.txt

# Resource utilization
echo -e "\nResource Utilization:" >> $REPORT_DIR/weekly_performance_$DATE.txt
echo "CPU Usage: $(sar -u 1 5 | awk 'NR>3 {sum+=$3} END {print sum/NR "%"}')" >> $REPORT_DIR/weekly_performance_$DATE.txt
echo "Memory Usage: $(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')%" >> $REPORT_DIR/weekly_performance_$DATE.txt

# Send report to team
mail -s "Weekly Performance Report" ops-team@company.com < $REPORT_DIR/weekly_performance_$DATE.txt
```

### Monthly Maintenance Tasks

#### Full System Backup

```bash
#!/bin/bash
# Monthly full system backup script
BACKUP_DIR="/backups/monthly"
DATE=$(date +%Y%m%d)
LOG_FILE="/var/log/tuneton/monthly_backup.log"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting monthly full backup" >> $LOG_FILE

# Create backup directory
mkdir -p $BACKUP_DIR/$DATE

# Backup entire application
tar -czf $BACKUP_DIR/$DATE/full_backup_$DATE.tar.gz /app

# Backup configuration files
tar -czf $BACKUP_DIR/$DATE/config_backup_$DATE.tar.gz /etc/tuneton

# Backup database with full dump
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_DIR/$DATE/db_full_dump_$DATE.sql
gzip $BACKUP_DIR/$DATE/db_full_dump_$DATE.sql

# Encrypt backups
gpg --cipher-algo AES256 --compress-algo 1 --symmetric \
    --output $BACKUP_DIR/$DATE/full_backup_$DATE.tar.gz.gpg \
    $BACKUP_DIR/$DATE/full_backup_$DATE.tar.gz

gpg --cipher-algo AES256 --compress-algo 1 --symmetric \
    --output $BACKUP_DIR/$DATE/config_backup_$DATE.tar.gz.gpg \
    $BACKUP_DIR/$DATE/config_backup_$DATE.tar.gz

gpg --cipher-algo AES256 --compress-algo 1 --symmetric \
    --output $BACKUP_DIR/$DATE/db_full_dump_$DATE.sql.gz.gpg \
    $BACKUP_DIR/$DATE/db_full_dump_$DATE.sql.gz

# Upload to cloud storage
aws s3 sync $BACKUP_DIR/$DATE s3://tuneton-backups/monthly/$DATE/

# Cleanup local files
rm -rf $BACKUP_DIR/$DATE

# Verify cloud backup
if aws s3 ls s3://tuneton-backups/monthly/$DATE/ >/dev/null 2>&1; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Monthly backup completed successfully" >> $LOG_FILE
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: Monthly backup failed" >> $LOG_FILE
fi
```

#### Security Assessment

```bash
#!/bin/bash
# Monthly security assessment script
ASSESSMENT_DIR="/var/security/assessments"
DATE=$(date +%Y%m%d)
LOG_FILE="/var/log/tuneton/security_assessment.log"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting monthly security assessment" >> $LOG_FILE

mkdir -p $ASSESSMENT_DIR/$DATE

# Run vulnerability scan
nmap -sV -p 80,443,5432,22 $SERVER_IP > $ASSESSMENT_DIR/$DATE/port_scan.txt

# Run SSL certificate check
openssl s_client -connect $DOMAIN:443 -servername $DOMAIN < /dev/null 2>/dev/null | openssl x509 -noout -dates > $ASSESSMENT_DIR/$DATE/ssl_cert.txt

# Check for outdated dependencies
cd /app
npm audit --audit-level=moderate > $ASSESSMENT_DIR/$DATE/npm_audit.txt

# Check system packages
apt list --upgradable > $ASSESSMENT_DIR/$DATE/package_updates.txt

# Run security baseline check
lynis audit system > $ASSESSMENT_DIR/$DATE/lynis_report.txt

# Generate summary report
echo "Monthly Security Assessment - $DATE" > $ASSESSMENT_DIR/$DATE/summary.txt
echo "================================" >> $ASSESSMENT_DIR/$DATE/summary.txt
echo "Port Scan Results: $(grep open $ASSESSMENT_DIR/$DATE/port_scan.txt | wc -l) open ports" >> $ASSESSMENT_DIR/$DATE/summary.txt
echo "SSL Certificate Valid: $(grep 'notAfter' $ASSESSMENT_DIR/$DATE/ssl_cert.txt | cut -d'=' -f2)" >> $ASSESSMENT_DIR/$DATE/summary.txt
echo "NPM Vulnerabilities: $(grep 'found' $ASSESSMENT_DIR/$DATE/npm_audit.txt | head -1)" >> $ASSESSMENT_DIR/$DATE/summary.txt

# Send report to security team
mail -s "Monthly Security Assessment" security-team@company.com < $ASSESSMENT_DIR/$DATE/summary.txt

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Security assessment completed" >> $LOG_FILE
```

#### Performance Tuning

```sql
-- Monthly performance tuning script
-- Run as part of scheduled maintenance

-- Analyze and update table statistics
ANALYZE VERBOSE;

-- Reindex all tables
REINDEX DATABASE tuneton_db;

-- Update database configuration based on usage patterns
-- This would typically be done manually based on monitoring data

-- Optimize frequently used queries
-- Example: Update query plans for common operations
PREPARE get_user_playbacks(integer) AS
    SELECT * FROM playbacks WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50;

-- Check for table bloat and vacuum if necessary
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as toast_size
FROM pg_tables
WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;
```

## Emergency Procedures

### System Outage Response

#### Immediate Actions

1. **Acknowledge Alert**: Confirm receipt of outage notification
2. **Assess Impact**: Determine scope and severity of outage
3. **Activate Incident Response**: Follow incident response procedures
4. **Communicate**: Notify stakeholders and users as appropriate

#### Diagnostic Procedures

```bash
#!/bin/bash
# Emergency diagnostic script
DIAG_DIR="/var/diag/emergency"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $DIAG_DIR/$DATE

# System status
systemctl status tuneton-app > $DIAG_DIR/$DATE/system_status.txt

# Resource usage
top -b -n 1 > $DIAG_DIR/$DATE/top_output.txt
df -h > $DIAG_DIR/$DATE/disk_usage.txt
free -h > $DIAG_DIR/$DATE/memory_usage.txt

# Network connectivity
ping -c 5 $DB_HOST > $DIAG_DIR/$DATE/db_connectivity.txt
ping -c 5 8.8.8.8 > $DIAG_DIR/$DATE/internet_connectivity.txt

# Application logs
tail -n 1000 /var/log/tuneton/application.log > $DIAG_DIR/$DATE/app_logs.txt
tail -n 1000 /var/log/tuneton/error.log > $DIAG_DIR/$DATE/error_logs.txt

# Database connectivity
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1;" > $DIAG_DIR/$DATE/db_test.txt 2>&1

# Package diagnostic information
tar -czf $DIAG_DIR/diagnostic_$DATE.tar.gz $DIAG_DIR/$DATE

# Send to incident response team
mail -s "Emergency Diagnostic Information" incident-response@company.com < $DIAG_DIR/diagnostic_$DATE.tar.gz
```

#### Recovery Actions

##### Application Restart

```bash
#!/bin/bash
# Application restart procedure
LOG_FILE="/var/log/tuneton/emergency_restart.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting emergency application restart" >> $LOG_FILE

# Stop application
systemctl stop tuneton-app >> $LOG_FILE 2>&1
sleep 10

# Check if process is still running
if pgrep -f "tuneton-app" > /dev/null; then
    echo "[$DATE] WARNING: Application process still running, force killing" >> $LOG_FILE
    pkill -9 -f "tuneton-app"
    sleep 5
fi

# Clear application cache
rm -rf /app/cache/*
rm -rf /tmp/tuneton/*

# Start application
systemctl start tuneton-app >> $LOG_FILE 2>&1

# Wait for application to start
sleep 30

# Verify application is running
if curl -f http://localhost:3000/health >/dev/null 2>&1; then
    echo "[$DATE] Application restarted successfully" >> $LOG_FILE
else
    echo "[$DATE] ERROR: Application failed to start properly" >> $LOG_FILE
fi
```

##### Database Recovery

```bash
#!/bin/bash
# Database recovery procedure
LOG_FILE="/var/log/tuneton/emergency_db_recovery.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting emergency database recovery" >> $LOG_FILE

# Stop database service
systemctl stop postgresql >> $LOG_FILE 2>&1

# Check for database corruption
pg_checksums -D /var/lib/postgresql/data >> $LOG_FILE 2>&1

# If corruption detected, restore from backup
if [ $? -ne 0 ]; then
    echo "[$DATE] Database corruption detected, restoring from backup" >> $LOG_FILE

    # Stop application to prevent data inconsistency
    systemctl stop tuneton-app >> $LOG_FILE 2>&1

    # Restore from latest backup
    LATEST_BACKUP=$(ls -t /backups/database/db_backup_*.sql.gz.gpg | head -1)
    if [ -f "$LATEST_BACKUP" ]; then
        # Decrypt and restore
        gpg --decrypt $LATEST_BACKUP | gunzip | psql -h $DB_HOST -U $DB_USER -d $DB_NAME >> $LOG_FILE 2>&1

        if [ $? -eq 0 ]; then
            echo "[$DATE] Database restored successfully" >> $LOG_FILE
        else
            echo "[$DATE] ERROR: Database restoration failed" >> $LOG_FILE
        fi
    else
        echo "[$DATE] ERROR: No database backup found" >> $LOG_FILE
    fi
fi

# Start database service
systemctl start postgresql >> $LOG_FILE 2>&1

# Start application
systemctl start tuneton-app >> $LOG_FILE 2>&1

echo "[$DATE] Database recovery procedure completed" >> $LOG_FILE
```

### Data Recovery Procedures

#### Point-in-Time Recovery

```bash
#!/bin/bash
# Point-in-time recovery procedure
TARGET_TIME=$1
LOG_FILE="/var/log/tuneton/point_in_time_recovery.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting point-in-time recovery to $TARGET_TIME" >> $LOG_FILE

# Stop all services
systemctl stop tuneton-app >> $LOG_FILE 2>&1
systemctl stop postgresql >> $LOG_FILE 2>&1

# Restore base backup
LATEST_BASE_BACKUP=$(ls -t /backups/database/base_backup_*.tar | head -1)
if [ -f "$LATEST_BASE_BACKUP" ]; then
    # Extract base backup
    tar -xf $LATEST_BASE_BACKUP -C /var/lib/postgresql/data/

    # Apply WAL logs up to target time
    pg_waldump /backups/database/wal_logs/ | \
    awk -v target="$TARGET_TIME" '$1 <= target' | \
    while read line; do
        # Apply WAL changes
        echo "$line" | pg_waldump -r >> $LOG_FILE 2>&1
    done

    echo "[$DATE] Point-in-time recovery completed" >> $LOG_FILE
else
    echo "[$DATE] ERROR: No base backup found" >> $LOG_FILE
fi

# Start services
systemctl start postgresql >> $LOG_FILE 2>&1
systemctl start tuneton-app >> $LOG_FILE 2>&1
```

#### Disaster Recovery

```bash
#!/bin/bash
# Disaster recovery procedure
LOG_FILE="/var/log/tuneton/disaster_recovery.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting disaster recovery procedure" >> $LOG_FILE

# Initialize new environment
# This would typically involve provisioning new infrastructure

# Restore from cloud backups
aws s3 sync s3://tuneton-backups/latest/ /restore/

# Restore database
gunzip < /restore/database/db_backup_latest.sql.gz | psql -h $NEW_DB_HOST -U $DB_USER -d $DB_NAME >> $LOG_FILE 2>&1

# Restore application
tar -xzf /restore/application/app_backup_latest.tar.gz -C /app

# Restore configuration
tar -xzf /restore/configuration/config_backup_latest.tar.gz -C /etc/tuneton

# Start services
systemctl start tuneton-app >> $LOG_FILE 2>&1

# Verify recovery
if curl -f http://localhost:3000/health >/dev/null 2>&1; then
    echo "[$DATE] Disaster recovery completed successfully" >> $LOG_FILE
else
    echo "[$DATE] ERROR: Disaster recovery verification failed" >> $LOG_FILE
fi
```

## System Updates

### Application Updates

#### Update Procedure

```bash
#!/bin/bash
# Application update procedure
VERSION=$1
LOG_FILE="/var/log/tuneton/app_update.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting application update to version $VERSION" >> $LOG_FILE

# Create backup
/app/scripts/backup.sh >> $LOG_FILE 2>&1

# Stop application
systemctl stop tuneton-app >> $LOG_FILE 2>&1

# Download new version
wget https://github.com/company/tuneton/releases/download/$VERSION/tuneton-$VERSION.tar.gz -O /tmp/tuneton-$VERSION.tar.gz >> $LOG_FILE 2>&1

# Verify checksum
echo "$(curl -s https://github.com/company/tuneton/releases/download/$VERSION/tuneton-$VERSION.tar.gz.sha256) /tmp/tuneton-$VERSION.tar.gz" | sha256sum -c >> $LOG_FILE 2>&1

if [ $? -eq 0 ]; then
    # Extract new version
    tar -xzf /tmp/tuneton-$VERSION.tar.gz -C /app/

    # Run database migrations
    cd /app
    npm run migrate >> $LOG_FILE 2>&1

    # Update dependencies
    npm install --production >> $LOG_FILE 2>&1

    # Rebuild WASM modules if needed
    cd /app/src/wasm
    npm run build >> $LOG_FILE 2>&1

    # Start application
    systemctl start tuneton-app >> $LOG_FILE 2>&1

    # Verify update
    sleep 30
    if curl -f http://localhost:3000/health | grep "$VERSION" >/dev/null 2>&1; then
        echo "[$DATE] Application updated successfully to version $VERSION" >> $LOG_FILE
    else
        echo "[$DATE] ERROR: Application update verification failed" >> $LOG_FILE
        # Rollback procedure
        /app/scripts/rollback.sh >> $LOG_FILE 2>&1
    fi
else
    echo "[$DATE] ERROR: Checksum verification failed" >> $LOG_FILE
fi

# Cleanup
rm /tmp/tuneton-$VERSION.tar.gz
```

#### Rollback Procedure

```bash
#!/bin/bash
# Application rollback procedure
LOG_FILE="/var/log/tuneton/app_rollback.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting application rollback" >> $LOG_FILE

# Stop application
systemctl stop tuneton-app >> $LOG_FILE 2>&1

# Restore from backup
/app/scripts/restore.sh latest >> $LOG_FILE 2>&1

# Start application
systemctl start tuneton-app >> $LOG_FILE 2>&1

# Verify rollback
sleep 30
if curl -f http://localhost:3000/health >/dev/null 2>&1; then
    echo "[$DATE] Application rollback completed successfully" >> $LOG_FILE
else
    echo "[$DATE] ERROR: Application rollback verification failed" >> $LOG_FILE
fi
```

### Database Updates

#### Schema Migration

```sql
-- Database migration script template
-- Version: 1.2.3
-- Date: 2023-12-01

-- Add new column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_preferences ON users USING GIN (preferences);

-- Add new table for user sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- Update existing data
UPDATE users SET preferences = '{}' WHERE preferences IS NULL;

-- Add constraints
ALTER TABLE users ALTER COLUMN preferences SET NOT NULL;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON user_sessions TO tuneton_app;
GRANT USAGE, SELECT ON SEQUENCE user_sessions_id_seq TO tuneton_app;
```

#### Data Migration

```bash
#!/bin/bash
# Data migration script
LOG_FILE="/var/log/tuneton/data_migration.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting data migration" >> $LOG_FILE

# Backup current data
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -t users > /backups/users_backup_$(date +%Y%m%d).sql

# Run migration query
psql -h $DB_HOST -U $DB_USER -d $DB_NAME << EOF
-- Migration SQL here
UPDATE users
SET preferences = preferences || '{"theme": "dark", "notifications": true}'::jsonb
WHERE preferences IS NOT NULL;
EOF

if [ $? -eq 0 ]; then
    echo "[$DATE] Data migration completed successfully" >> $LOG_FILE
else
    echo "[$DATE] ERROR: Data migration failed" >> $LOG_FILE
fi
```

## Monitoring and Alerting Maintenance

### Alert Tuning

#### Threshold Adjustment

```bash
#!/bin/bash
# Alert threshold adjustment script
CONFIG_FILE="/etc/tuneton/alerting.conf"
BACKUP_FILE="/etc/tuneton/alerting.conf.backup"

# Backup current configuration
cp $CONFIG_FILE $BACKUP_FILE

# Update thresholds based on historical data
# This would typically be done programmatically based on metrics

# Example threshold updates
sed -i 's/RESPONSE_TIME_THRESHOLD=.*/RESPONSE_TIME_THRESHOLD=500/' $CONFIG_FILE
sed -i 's/CPU_USAGE_THRESHOLD=.*/CPU_USAGE_THRESHOLD=80/' $CONFIG_FILE
sed -i 's/MEMORY_USAGE_THRESHOLD=.*/MEMORY_USAGE_THRESHOLD=85/' $CONFIG_FILE

# Restart monitoring service
systemctl restart monitoring-agent

# Verify changes
if systemctl is-active --quiet monitoring-agent; then
    echo "Alert thresholds updated successfully"
else
    echo "ERROR: Failed to update alert thresholds, restoring backup"
    cp $BACKUP_FILE $CONFIG_FILE
    systemctl restart monitoring-agent
fi
```

#### Notification Channel Management

```bash
#!/bin/bash
# Notification channel management script
LOG_FILE="/var/log/tuneton/notification_management.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting notification channel management" >> $LOG_FILE

# Update Slack webhook URLs
sed -i "s|SLACK_WEBHOOK_URL=.*|SLACK_WEBHOOK_URL=$NEW_SLACK_WEBHOOK|" /etc/tuneton/notifications.conf

# Update email configuration
sed -i "s/EMAIL_RECIPIENTS=.*/EMAIL_RECIPIENTS=$NEW_EMAIL_RECIPIENTS/" /etc/tuneton/notifications.conf

# Update PagerDuty integration
sed -i "s/PAGERDUTY_API_KEY=.*/PAGERDUTY_API_KEY=$NEW_PAGERDUTY_KEY/" /etc/tuneton/notifications.conf

# Test notifications
/app/scripts/test_notifications.sh >> $LOG_FILE 2>&1

if [ $? -eq 0 ]; then
    echo "[$DATE] Notification channels updated successfully" >> $LOG_FILE
else
    echo "[$DATE] ERROR: Notification channel update failed" >> $LOG_FILE
fi
```

## Backup and Recovery Maintenance

### Backup Schedule Optimization

```bash
#!/bin/bash
# Backup schedule optimization script
LOG_FILE="/var/log/tuneton/backup_optimization.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting backup schedule optimization" >> $LOG_FILE

# Analyze backup performance data
BACKUP_DURATION=$(tail -n 100 /var/log/tuneton/backup.log | awk '/completed/ {print $NF}' | sed 's/s$//' | awk '{sum+=$1} END {print sum/NR}')

# Adjust backup window based on performance
if (( $(echo "$BACKUP_DURATION > 1800" | bc -l) )); then
    # If backups take more than 30 minutes, extend window
    echo "[$DATE] Extending backup window due to long backup duration" >> $LOG_FILE

    # Update cron schedule
    crontab -l | sed 's/0 2 \* \* \* .*/0 1 \* \* \* \/app\/scripts\/backup.sh/' | crontab -
else
    # Optimize backup window
    echo "[$DATE] Backup duration is acceptable: ${BACKUP_DURATION}s" >> $LOG_FILE
fi

# Optimize backup retention
CURRENT_RETENTION=$(grep "RETENTION_DAYS" /etc/tuneton/backup.conf | cut -d'=' -f2)
OPTIMAL_RETENTION=30

if [ $CURRENT_RETENTION -ne $OPTIMAL_RETENTION ]; then
    sed -i "s/RETENTION_DAYS=.*/RETENTION_DAYS=$OPTIMAL_RETENTION/" /etc/tuneton/backup.conf
    echo "[$DATE] Updated backup retention to $OPTIMAL_RETENTION days" >> $LOG_FILE
fi

echo "[$DATE] Backup schedule optimization completed" >> $LOG_FILE
```

### Recovery Testing

#### Automated Recovery Tests

```bash
#!/bin/bash
# Automated recovery test script
TEST_DIR="/var/tests/recovery"
LOG_FILE="/var/log/tuneton/recovery_test.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting automated recovery test" >> $LOG_FILE

mkdir -p $TEST_DIR

# Create test environment
docker run -d --name test-db -e POSTGRES_PASSWORD=test postgres:13 >> $LOG_FILE 2>&1

# Wait for database to start
sleep 30

# Restore test backup
gunzip < /backups/database/test_backup.sql.gz | docker exec -i test-db psql -U postgres >> $LOG_FILE 2>&1

# Verify data integrity
docker exec test-db psql -U postgres -c "SELECT COUNT(*) FROM users;" > $TEST_DIR/user_count.txt
docker exec test-db psql -U postgres -c "SELECT COUNT(*) FROM playbacks;" > $TEST_DIR/playback_count.txt

# Compare with expected values
EXPECTED_USERS=1000
EXPECTED_PLAYBACKS=5000

ACTUAL_USERS=$(cat $TEST_DIR/user_count.txt | tail -3 | head -1 | tr -d ' ')
ACTUAL_PLAYBACKS=$(cat $TEST_DIR/playback_count.txt | tail -3 | head -1 | tr -d ' ')

if [ $ACTUAL_USERS -eq $EXPECTED_USERS ] && [ $ACTUAL_PLAYBACKS -eq $EXPECTED_PLAYBACKS ]; then
    echo "[$DATE] Recovery test passed" >> $LOG_FILE
else
    echo "[$DATE] ERROR: Recovery test failed" >> $LOG_FILE
    echo "[$DATE] Expected users: $EXPECTED_USERS, Actual: $ACTUAL_USERS" >> $LOG_FILE
    echo "[$DATE] Expected playbacks: $EXPECTED_PLAYBACKS, Actual: $ACTUAL_PLAYBACKS" >> $LOG_FILE
fi

# Cleanup
docker stop test-db >> $LOG_FILE 2>&1
docker rm test-db >> $LOG_FILE 2>&1
rm -rf $TEST_DIR

echo "[$DATE] Automated recovery test completed" >> $LOG_FILE
```

## Performance Optimization

### Resource Scaling

#### Auto-scaling Configuration

```yaml
# Auto-scaling configuration
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: tuneton-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: tuneton-app
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Percent
          value: 50
          periodSeconds: 60
```

#### Database Connection Pooling

```bash
#!/bin/bash
# Database connection pool optimization script
LOG_FILE="/var/log/tuneton/connection_pool_optimization.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting connection pool optimization" >> $LOG_FILE

# Monitor current connection usage
CURRENT_CONNECTIONS=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "SELECT count(*) FROM pg_stat_activity;" | tr -d ' ')
MAX_CONNECTIONS=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "SHOW max_connections;" | tr -d ' ')

echo "[$DATE] Current connections: $CURRENT_CONNECTIONS, Max connections: $MAX_CONNECTIONS" >> $LOG_FILE

# Calculate optimal pool size
OPTIMAL_POOL_SIZE=$((MAX_CONNECTIONS * 80 / 100))

# Update application configuration
sed -i "s/DB_POOL_SIZE=.*/DB_POOL_SIZE=$OPTIMAL_POOL_SIZE/" /etc/tuneton/app.conf

# Restart application to apply changes
systemctl restart tuneton-app >> $LOG_FILE 2>&1

echo "[$DATE] Connection pool optimized to $OPTIMAL_POOL_SIZE connections" >> $LOG_FILE
```

## Security Maintenance

### Certificate Management

#### SSL Certificate Renewal

```bash
#!/bin/bash
# SSL certificate renewal script
LOG_FILE="/var/log/tuneton/cert_renewal.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting SSL certificate renewal" >> $LOG_FILE

# Check certificate expiration
EXPIRATION_DATE=$(echo | openssl s_client -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -enddate | cut -d'=' -f2)
EXPIRATION_TIMESTAMP=$(date -d "$EXPIRATION_DATE" +%s)
CURRENT_TIMESTAMP=$(date +%s)
DAYS_UNTIL_EXPIRATION=$(( (EXPIRATION_TIMESTAMP - CURRENT_TIMESTAMP) / 86400 ))

echo "[$DATE] Certificate expires in $DAYS_UNTIL_EXPIRATION days" >> $LOG_FILE

# Renew if expiring within 30 days
if [ $DAYS_UNTIL_EXPIRATION -lt 30 ]; then
    echo "[$DATE] Renewing SSL certificate" >> $LOG_FILE

    # Request new certificate
    certbot renew --quiet >> $LOG_FILE 2>&1

    if [ $? -eq 0 ]; then
        # Restart web server
        systemctl reload nginx >> $LOG_FILE 2>&1
        echo "[$DATE] SSL certificate renewed successfully" >> $LOG_FILE
    else
        echo "[$DATE] ERROR: SSL certificate renewal failed" >> $LOG_FILE
    fi
else
    echo "[$DATE] Certificate is still valid, no renewal needed" >> $LOG_FILE
fi
```

#### Security Patch Management

```bash
#!/bin/bash
# Security patch management script
LOG_FILE="/var/log/tuneton/security_patches.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting security patch management" >> $LOG_FILE

# Update package lists
apt update >> $LOG_FILE 2>&1

# Check for security updates
apt list --upgradable | grep -i security > /tmp/security_updates.txt

if [ -s /tmp/security_updates.txt ]; then
    echo "[$DATE] Security updates available:" >> $LOG_FILE
    cat /tmp/security_updates.txt >> $LOG_FILE

    # Apply security updates
    apt upgrade -y --only-upgrade >> $LOG_FILE 2>&1

    if [ $? -eq 0 ]; then
        echo "[$DATE] Security updates applied successfully" >> $LOG_FILE

        # Restart affected services
        systemctl daemon-reload
        systemctl restart tuneton-app
        systemctl restart postgresql
    else
        echo "[$DATE] ERROR: Failed to apply security updates" >> $LOG_FILE
    fi
else
    echo "[$DATE] No security updates available" >> $LOG_FILE
fi

# Clean up
rm /tmp/security_updates.txt
```

This maintenance procedures documentation provides comprehensive guidance for the ongoing maintenance of the TuneTON application, ensuring system reliability, performance, and security through systematic procedures and automated scripts.
