# Build and Deployment Documentation

## Overview

This document provides comprehensive instructions for building, testing, and deploying the TuneTON application across different environments. It covers the complete build pipeline, deployment strategies, and operational procedures for maintaining the application in production.

## Build Process

### Frontend Build

#### Build Configuration

The frontend build process is managed by Vite with configuration in [vite.config.ts](file:///c%3A/Users/user/tuneTON_3.0/vite.config.ts).

#### Build Commands

```bash
# Development build
npm run build

# Production build with optimizations
npm run build:prod

# Preview production build locally
npm run preview
```

#### Build Output

The build process generates files in the `dist/` directory:

```
dist/
├── assets/
│   ├── js/           # JavaScript bundles
│   ├── css/          # CSS bundles
│   └── images/       # Optimized images
├── index.html        # Main HTML file
├── manifest.webmanifest  # PWA manifest
├── sw.js             # Service worker
└── workbox-*.js      # Workbox library
```

#### Build Optimizations

1. **Code Splitting**: Automatic code splitting for optimal loading
2. **Tree Shaking**: Removal of unused code
3. **Minification**: JavaScript and CSS minification
4. **Asset Compression**: Gzip/Brotli compression
5. **Image Optimization**: Automatic image optimization
6. **Prefetching**: Strategic resource prefetching

### WASM Module Build

#### Build Process

The WASM module is built using Rust and wasm-pack:

```bash
# Navigate to WASM directory
cd src/wasm

# Build for development
npm run build

# Build for production
npm run build:prod
```

#### Output Files

- **pkg/tuneton_wasm_bg.wasm**: Compiled WebAssembly module
- **pkg/tuneton_wasm.js**: JavaScript bindings
- **pkg/package.json**: Package metadata

#### Optimization Flags

- **Development**: Debug symbols, no optimization
- **Production**: Size optimization (`-O`), dead code elimination

### Backend Build

#### Node.js Backend

The Node.js backend is built as part of the overall application:

```bash
# Build backend (handled by main build)
npm run build
```

#### PHP Backend

The PHP backend requires no build process - files are deployed directly.

### Supabase Functions Build

#### Function Deployment

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy telegram-auth
```

#### Build Process

Supabase handles the build process automatically during deployment.

## Testing Strategy

### Test Environment Setup

#### Unit Testing

- **Framework**: Vitest
- **Library**: React Testing Library
- **Coverage**: Istanbul coverage reports

#### Integration Testing

- **Tools**: Supertest for API testing
- **Scope**: End-to-end component integration
- **Database**: Test database instances

#### Performance Testing

- **Tools**: Lighthouse, WebPageTest
- **Metrics**: Load time, interaction latency
- **Scenarios**: Various network conditions

### Test Execution

#### Local Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test suite
npm test -- src/components/MyComponent.test.tsx

# Generate coverage report
npm run test:coverage
```

#### CI Testing

In continuous integration environments:

```bash
# Run tests with coverage
npm test -- --coverage

# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

### Test Categories

#### Unit Tests

- Component functionality
- Utility functions
- Hook behavior
- Service layer logic

#### Integration Tests

- API endpoint testing
- Database operations
- Authentication flows
- External service integration

#### End-to-End Tests

- User journey testing
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility compliance

## Deployment Architecture

### Production Environment

#### Hosting Structure

```
Frontend: Static file hosting (CDN)
Backend: Containerized services
Database: Managed PostgreSQL (Supabase)
WASM: Bundled with frontend
```

#### Deployment Targets

1. **Frontend**: CDN (AWS S3 + CloudFront, Netlify, Vercel)
2. **Backend API**: Container platform (Docker + Kubernetes)
3. **Database**: Supabase cloud
4. **Functions**: Supabase functions
5. **Assets**: CDN distribution

### Staging Environment

#### Purpose

- Pre-production testing
- Feature validation
- Performance benchmarking
- User acceptance testing

#### Configuration

- Separate database instance
- Isolated backend services
- Production-like data (anonymized)
- Full feature parity

### Development Environment

#### Purpose

- Local development
- Feature implementation
- Unit testing
- Debugging

#### Configuration

- Local Supabase development
- Development API endpoints
- Mock data where appropriate
- Hot reloading

## Deployment Process

### Frontend Deployment

#### Manual Deployment

```bash
# Build for production
npm run build:prod

# Deploy to hosting platform
# (Specific commands depend on chosen platform)
```

#### Automated Deployment

Using GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:prod
      - run: # Deployment commands
```

#### Deployment Verification

1. **Build Success**: Verify build completes without errors
2. **Asset Upload**: Confirm all assets uploaded correctly
3. **Service Worker**: Validate service worker registration
4. **Performance**: Check Lighthouse scores
5. **Functionality**: Manual verification of key features

### Backend Deployment

#### Node.js Service

```bash
# Build Docker image
docker build -t tuneton-backend .

# Push to container registry
docker push tuneton-backend:latest

# Deploy to container platform
# (Kubernetes, ECS, etc.)
```

#### PHP Service

```bash
# Deploy PHP files to hosting
# (SCP, Git deployment, etc.)
```

#### Supabase Functions

```bash
# Deploy functions to Supabase
supabase functions deploy --project-ref your_project_ref
```

### Database Deployment

#### Schema Migrations

```bash
# Apply migrations to production
supabase db push

# Reset staging database
supabase db reset --project-ref staging_ref
```

#### Data Migration

For data migrations, use Supabase's migration tools or custom scripts.

### Environment Configuration

#### Production Environment Variables

```env
# Frontend
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_TELEGRAM_BOT_TOKEN=your_production_token
VITE_APP_URL=https://yourdomain.com

# Backend
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JAMENDO_CLIENT_ID=your_production_client_id
NODE_ENV=production
```

#### Staging Environment Variables

Similar to production but with staging-specific values.

## CI/CD Pipeline

### GitHub Actions Workflow

#### Main Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:prod
      - uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: dist/

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/download-artifact@v3
        with:
          name: build-artifacts
          path: dist/
      - run: # Deployment commands
```

### Pipeline Stages

#### 1. Code Quality

- Linting with ESLint
- Type checking with TypeScript
- Security scanning
- Code complexity analysis

#### 2. Testing

- Unit tests execution
- Integration tests
- Performance tests
- Accessibility tests

#### 3. Building

- Frontend build
- WASM module compilation
- Backend packaging
- Artifact generation

#### 4. Deployment

- Environment-specific deployment
- Health checks
- Rollback procedures
- Notification systems

## Monitoring and Observability

### Application Monitoring

#### Frontend Monitoring

- **Performance**: Load times, interaction latency
- **Errors**: JavaScript errors, unhandled exceptions
- **Usage**: Feature adoption, user paths
- **Devices**: Browser, OS, device statistics

#### Backend Monitoring

- **API Performance**: Response times, throughput
- **Database**: Query performance, connection pools
- **Resources**: CPU, memory, disk usage
- **Errors**: Application errors, system errors

### Logging Strategy

#### Log Levels

- **Debug**: Detailed diagnostic information
- **Info**: General operational information
- **Warn**: Warning conditions
- **Error**: Error conditions

#### Log Structure

```json
{
  "timestamp": "2023-01-01T00:00:00Z",
  "level": "info",
  "service": "frontend",
  "message": "User logged in",
  "userId": "12345",
  "correlationId": "abc-def-ghi"
}
```

#### Log Storage

- **Development**: Console output
- **Production**: Centralized logging service (ELK, Splunk, etc.)

### Error Tracking

#### Error Reporting

- **Frontend**: Sentry, Bugsnag
- **Backend**: Sentry, custom error handlers
- **Functions**: Supabase function logs

#### Alerting

- **Thresholds**: Response time, error rate
- **Channels**: Email, Slack, SMS
- **Escalation**: Tiered alerting policies

## Security Deployment

### Security Scanning

#### Dependency Scanning

```bash
# Audit dependencies
npm audit

# Fix vulnerabilities
npm audit fix
```

#### Static Analysis

- **SAST**: SonarQube, CodeQL
- **DAST**: OWASP ZAP, Burp Suite

#### Container Scanning

For containerized deployments:

```bash
# Scan Docker images
docker scan tuneton-backend:latest
```

### Security Headers

#### HTTP Headers

```http
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
```

#### CORS Configuration

```javascript
// Backend CORS settings
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true
}));
```

## Rollback Procedures

### Automated Rollback

#### Deployment Rollback

```bash
# Rollback to previous version
# (Platform-specific commands)

# Example for Kubernetes
kubectl rollout undo deployment/tuneton-frontend
```

#### Database Rollback

```bash
# Revert database migration
supabase db revert
```

### Manual Rollback

#### Frontend Rollback

1. Identify previous working version
2. Restore from backup or previous deployment
3. Update DNS/CNAME records if necessary
4. Verify functionality

#### Backend Rollback

1. Deploy previous container image
2. Restore database from backup if needed
3. Update configuration if required
4. Validate service health

## Performance Optimization

### Frontend Optimization

#### Bundle Analysis

```bash
# Analyze bundle size
npm run build:prod -- --analyze
```

#### Performance Budgets

- **JavaScript**: < 200KB gzipped
- **CSS**: < 50KB gzipped
- **Images**: Optimized with WebP where possible
- **Fonts**: Subset and optimized

#### Caching Strategy

- **Static Assets**: Long-term caching with hash-based filenames
- **API Responses**: Appropriate cache headers
- **Service Worker**: Cache-first strategy for core assets

### Backend Optimization

#### Database Optimization

- **Indexing**: Proper database indexes
- **Query Optimization**: Efficient queries
- **Connection Pooling**: Optimal pool sizes
- **Caching**: Redis or similar for frequent queries

#### API Optimization

- **Response Compression**: Gzip/Brotli
- **Pagination**: For large dataset responses
- **Rate Limiting**: Prevent abuse
- **Caching**: CDN for static content

## Disaster Recovery

### Backup Strategy

#### Code Backup

- **Git Repository**: Primary source control
- **Multiple Remotes**: GitHub, GitLab, Bitbucket
- **Regular Sync**: Automated synchronization

#### Data Backup

- **Database**: Automated daily backups
- **Assets**: Versioned storage with redundancy
- **Configuration**: Encrypted backup storage

### Recovery Procedures

#### Full System Recovery

1. Restore code from repository
2. Deploy latest stable version
3. Restore database from backup
4. Restore assets and configuration
5. Validate system functionality

#### Partial Recovery

1. Identify affected components
2. Restore specific services
3. Validate integration
4. Monitor for issues

## Compliance and Auditing

### Regulatory Compliance

#### Data Protection

- **GDPR**: Data subject rights implementation
- **CCPA**: California privacy rights
- **PII Handling**: Secure processing of personal data

#### Security Standards

- **OWASP**: Implementation of security best practices
- **ISO 27001**: Information security management
- **SOC 2**: Security, availability, processing integrity

### Audit Trails

#### User Activity

- **Authentication Logs**: Login attempts, success/failure
- **User Actions**: Track important user activities
- **Administrative Actions**: System configuration changes

#### System Activity

- **Deployment Logs**: Version deployments, rollbacks
- **System Events**: Service restarts, maintenance
- **Security Events**: Intrusion attempts, anomalies

This document provides a comprehensive guide to building, testing, and deploying the TuneTON application, ensuring reliable and secure delivery of the platform to users.
