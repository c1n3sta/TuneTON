# TuneTON - Music Streaming Platform

TuneTON is a music streaming platform built as a Telegram Web App with real-time audio editing capabilities, blockchain integration, and gamification features.

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

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.