# TuneTON - Music Streaming Platform

TuneTON is a music streaming platform built as a Telegram Web App with real-time audio editing capabilities, blockchain integration and gamification features.

## Migration from Supabase to Self-Hosted Backend

This project is currently undergoing a migration from Supabase to a self-hosted backend to improve performance, reduce costs, and increase control over the infrastructure.

### Current Status

- ✅ Self-hosted backend implementation completed
- ✅ Database schema defined for PostgreSQL
- ✅ API endpoints implemented
- ✅ Data migration script created
- ⬜ Migration testing pending
- ⬜ Production deployment pending

### Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌────────────────────┐
│   Frontend      │    │   Self-Hosted    │    │   PostgreSQL       │
│   (React/Vite)  │◄──►│   Backend        │◄──►│   Database         │
│                 │    │   (Node.js/      │    │                    │
│                 │    │   Express)       │    │                    │
└─────────────────┘    └──────────────────┘    └────────────────────┘
```

### Key Components

1. **Frontend** (`src/`):
   - React-based Telegram Web App
   - Audio player with real-time effects
   - NFT marketplace integration
   - User authentication via Telegram

2. **Self-Hosted Backend** (`server/`):
   - RESTful API built with Express.js
   - PostgreSQL database integration
   - Telegram authentication
   - Track and playback management

3. **Database**:
   - PostgreSQL for data storage
   - Schema defined in `server/database/schema.sql`

### Migration Process

1. **Setup Self-Hosted Backend**:
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Update .env with your configuration
   ```

2. **Database Setup**:
   ```bash
   # Create PostgreSQL database
   # Run schema.sql to create tables
   psql -U your_username -d your_database -f database/schema.sql
   ```

3. **Data Migration**:
   ```bash
   # Run migration script to transfer data from Supabase
   node scripts/migrate-from-supabase.js
   ```

4. **Start Backend**:
   ```bash
   npm start
   ```

5. **Update Frontend Configuration**:
   - Update `.env.production` with new API URLs
   - Replace Supabase client with self-hosted API client

### Environment Variables

#### Frontend (.env.production)
```
# API Configuration
VITE_API_BASE_URL=http://your-backend-url:3001/api

# Telegram Configuration
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Jamendo API
VITE_JAMENDO_CLIENT_ID=your_jamendo_client_id
```

#### Backend (server/.env)
```
# Server Configuration
PORT=3001

# Database Configuration
DB_HOST=your_database_host
DB_PORT=5432
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

### Testing the Migration

1. Run the self-hosted backend locally
2. Execute the data migration script
3. Update frontend to use self-hosted API
4. Test all functionality:
   - User authentication
   - Track browsing and playback
   - Playback counting
   - Audio effects

### Benefits of Self-Hosting

1. **Cost Reduction**: Eliminate Supabase subscription fees
2. **Performance**: Direct control over database and server optimization
3. **Scalability**: Ability to scale components independently
4. **Customization**: Full control over features and functionality
5. **Data Ownership**: Complete control over user data

### Rollback Plan

If issues arise during migration:

1. Revert frontend to use Supabase
2. Restore database from backup
3. Document issues and fix before retrying migration

## Monitoring Suite

A comprehensive monitoring suite has been implemented to ensure the health and performance of the TuneTON application in production.

### Components

1. **PM2 Process Monitoring** - For Node.js process management and monitoring
2. **Uptime-Kuma** - For service uptime monitoring
3. **Prometheus + Grafana** - For metrics collection and visualization
4. **ELK Stack** - For log aggregation and analysis
5. **All-in-One Dashboard** - Unified view of all monitoring components

### Setup

To deploy the monitoring suite:

1. Deploy monitoring files to your server:
   ```bash
   npm run deploy:monitoring
   ```

2. SSH into your server and run the setup scripts:
   ```bash
   cd monitoring
   chmod +x setup-all.sh
   ./setup-all.sh
   ```

3. Configure each monitoring tool according to the documentation in `monitoring/USAGE.md`

### Access Points

After deployment, the monitoring tools are accessible at:
- **All-in-One Dashboard**: http://your-server:8080
- **PM2 Dashboard**: http://your-server:9615
- **Uptime-Kuma**: http://your-server:3002
- **Grafana**: http://your-server:3003
- **Kibana**: http://your-server:5601
- **Prometheus**: http://your-server:9090

See `monitoring/README.md` for detailed documentation.

## Setting up SSH Access and Running Monitoring (ISP Manager)

If you're using ISP Manager to host your TuneTON application, you'll need to set up SSH access to run the monitoring setup scripts.

### Automated SSH Setup

This project now includes automated SSH setup tools:

1. **Test SSH Connection**:
   ```bash
   npm run test:ssh
   ```

2. **Setup Monitoring via SSH**:
   ```bash
   npm run setup:monitoring
   ```

These scripts use the SSH credentials stored in your `.env.production` file.

### 1. Setting up SSH Access through ISP Manager

Follow the detailed guide in `documentation/ISP_MANAGER_SSH_SETUP.md` which explains:
- How to configure SSH keys or password authentication in ISP Manager
- How to connect to your server via SSH
- How to run the monitoring setup scripts

### 2. Alternative Web-Based Setup

If SSH access is limited, you can use the web-based setup script:
1. Upload `scripts/web-based-setup.php` to your server
2. Access it through your web browser
3. The script will automatically set up all monitoring components
4. **Important**: Delete the script after setup for security reasons

### 3. Complete SSH Access Guide

If you're having trouble finding SSH settings in ISP Manager, refer to the comprehensive guide in `documentation/SSH_ACCESS_COMPLETE_GUIDE.md` which covers:
- Detailed steps for configuring SSH access through ISP Manager
- Alternative methods if SSH isn't available
- Troubleshooting common connection issues
- Security best practices

### 4. Diagnostic Scripts

Several diagnostic scripts are available to help you understand your current connection:
- `scripts/connection-diagnostic.sh` - Provides detailed information about your connection
- `scripts/setup-ssh-access.sh` - Helps diagnose SSH configuration
- `scripts/complete-server-setup.sh` - Sets up the entire TuneTON application

### 5. Post-Setup Configuration

After running the setup:
1. Access each monitoring tool through its respective URL
2. Configure alerts and notifications as needed
3. Set up custom dashboards for your specific metrics
4. Review security settings and update default passwords

See `documentation/ISP_MANAGER_SSH_SETUP.md` and `documentation/SSH_ACCESS_COMPLETE_GUIDE.md` for complete instructions.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.