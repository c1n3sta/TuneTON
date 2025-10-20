# Development Environment Setup Guide

## Overview

This document provides comprehensive instructions for setting up the development environment for the TuneTON project. It covers all necessary tools, dependencies, and configuration steps required to begin development on any supported platform.

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- **RAM**: 8GB minimum (16GB recommended)
- **Disk Space**: 10GB free space
- **Processor**: Modern CPU with at least 4 cores

### Recommended Specifications

- **Operating System**: Windows 11, macOS 12+, or Ubuntu 20.04+
- **RAM**: 16GB or more
- **Disk Space**: 20GB free space (SSD recommended)
- **Processor**: 8-core CPU or better

## Prerequisites Installation

### 1. Node.js and npm

#### Installation Options

1. **Direct Download**: [nodejs.org](https://nodejs.org/)
2. **Package Manager**: Using nvm, fnm, or system package manager
3. **Version Manager**: Recommended for version control

#### Required Versions

- **Node.js**: 18.x LTS (Latest LTS version recommended)
- **npm**: 8.x or higher

#### Installation Verification

```bash
node --version
npm --version
```

### 2. Rust and WASM Toolchain

#### Installation

```bash
# Install rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add wasm32 target
rustup target add wasm32-unknown-unknown
```

#### Required Components

- **Rust**: 1.70 or higher
- **Cargo**: Bundled with Rust
- **wasm32-unknown-unknown**: Target for WebAssembly compilation

#### Verification

```bash
rustc --version
cargo --version
rustup target list | grep wasm32
```

### 3. PHP

#### Required Version

- **PHP**: 8.0 or higher

#### Installation

- **Windows**: [XAMPP](https://www.apachefriends.org/index.html) or [PHP for Windows](https://windows.php.net/download/)
- **macOS**: [Homebrew](https://brew.sh/) - `brew install php`
- **Linux**: Package manager - `sudo apt install php8.1`

#### Verification

```bash
php --version
```

### 4. Git

#### Required Version

- **Git**: 2.30 or higher

#### Installation

- **Windows**: [Git for Windows](https://git-scm.com/download/win)
- **macOS**: [Homebrew](https://brew.sh/) - `brew install git`
- **Linux**: Package manager - `sudo apt install git`

#### Verification

```bash
git --version
```

### 5. Supabase CLI

#### Installation

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows (using Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

#### Verification

```bash
supabase --version
```

## Project Setup

### 1. Repository Cloning

```bash
# Clone the repository
git clone https://github.com/your-username/tuneton.git

# Navigate to project directory
cd tuneton
```

### 2. Dependency Installation

```bash
# Install Node.js dependencies
npm install

# Install Rust dependencies (handled by build process)
# No separate command needed
```

### 3. Environment Configuration

#### Create Environment Files

```bash
# Create main environment file
cp .env.example .env

# Create Supabase environment file
cp supabase/.env.example supabase/.env
```

#### Required Environment Variables

**Main .env file**:

```env
# Telegram Configuration
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
VITE_APP_URL=http://localhost:3000

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Jamendo API
JAMENDO_CLIENT_ID=your_jamendo_client_id

# Development Settings
NODE_ENV=development
```

**Supabase .env file**:

```env
# Supabase Project Configuration
PROJECT_REF=your_project_reference
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

### 4. Database Setup

#### Local Development

```bash
# Start Supabase local development
supabase start

# Apply database migrations
supabase db reset
```

#### Database Schema

The database schema is automatically applied through Supabase migrations located in [supabase/migrations/](file:///c%3A/Users/user/tuneTON_3.0/supabase/migrations/).

### 5. WASM Module Setup

#### Initial Build

```bash
# Navigate to WASM directory
cd src/wasm

# Build WASM module
npm run build
```

#### Development Workflow

For development with automatic rebuilding:

```bash
# Watch mode for WASM development
npm run dev
```

For more detailed information about the WASM implementation, see [WASM_IMPLEMENTATION.md](file:///c%3A/Users/user/tuneTON_3.0/documentation/core-architecture/WASM_IMPLEMENTATION.md).

## Development Workflows

### Frontend Development

#### Starting Development Server

```bash
# Start Vite development server
npm run dev
```

#### Build Process

```bash
# Development build
npm run build

# Production build
npm run build:prod
```

#### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check
```

### Backend Development

#### Node.js Server

```bash
# Start backend server
npm run dev:server

# Start both frontend and backend
npm run dev:full
```

#### PHP Development

For PHP development, use the built-in PHP server:

```bash
# Start PHP development server
php -S localhost:8000 -t public/
```

### Supabase Development

#### Function Development

```bash
# Start Supabase local development
supabase start

# Deploy functions locally
supabase functions serve

# Deploy specific function
supabase functions deploy telegram-auth --project-ref your_project_ref
```

#### Database Development

```bash
# Reset database to fresh state
supabase db reset

# Apply new migrations
supabase db push

# Generate types from database schema
supabase gen types typescript --project-id your_project_ref > src/types/supabase.ts
```

## IDE and Editor Setup

### Recommended IDEs

1. **Visual Studio Code** (Primary recommendation)
2. **WebStorm**
3. **IntelliJ IDEA Ultimate**

### VS Code Extensions

#### Essential Extensions

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript Importer**: Automatic import management
- **GitLens**: Enhanced Git capabilities
- **Auto Rename Tag**: HTML tag renaming
- **Bracket Pair Colorizer**: Visual bracket matching
- **Path Intellisense**: Intelligent path completion
- **Tailwind CSS IntelliSense**: Tailwind CSS support

#### Rust Development

- **rust-analyzer**: Rust language support
- **Crates**: Cargo.toml dependency management

#### Supabase Development

- **Supabase**: Official Supabase extension

### Configuration Files

#### VS Code Settings (.vscode/settings.json)

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

#### Workspace Configuration (.vscode/tuneton.code-workspace)

```json
{
  "folders": [
    {
      "path": "."
    }
  ],
  "settings": {
    "typescript.tsdk": "node_modules/typescript/lib"
  }
}
```

## Development Scripts

### Package.json Scripts Overview

#### Frontend Scripts

- `dev`: Start Vite development server
- `build`: Build for production
- `build:prod`: Production build with optimizations
- `preview`: Preview production build
- `lint`: Run ESLint
- `format`: Format code with Prettier
- `test`: Run test suite
- `type-check`: Check TypeScript types

#### Backend Scripts

- `dev:server`: Start backend development server
- `dev:full`: Start both frontend and backend

#### Supabase Scripts

- `supabase:start`: Start Supabase local development
- `supabase:stop`: Stop Supabase local development
- `supabase:reset`: Reset Supabase database

#### WASM Scripts

- `wasm:build`: Build WASM module
- `wasm:dev`: Build WASM module in watch mode

#### Utility Scripts

- `clean`: Clean build artifacts
- `postinstall`: Post-installation setup

## Debugging Setup

### Browser Debugging

- **Chrome DevTools**: Primary debugging environment
- **Firefox Developer Tools**: Alternative debugging environment
- **Safari Web Inspector**: For Safari-specific issues

### Node.js Debugging

```bash
# Debug backend server
npm run dev:server -- --inspect
```

### Rust/WASM Debugging

- **wasm-bindgen**: For debugging WASM modules
- **console_error_panic_hook**: For better error messages

For detailed information about the WASM implementation and debugging, see [WASM_IMPLEMENTATION.md](file:///c%3A/Users/user/tuneTON_3.0/documentation/core-architecture/WASM_IMPLEMENTATION.md).

### Supabase Debugging

```bash
# View Supabase logs
supabase logs

# View function logs
supabase functions logs
```

## Testing Environment

### Unit Testing

- **Framework**: Vitest
- **Library**: React Testing Library
- **Configuration**: [vitest.config.ts](file:///c%3A/Users/user/tuneTON_3.0/vitest.config.ts)

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- src/components/MyComponent.test.tsx

# Coverage report
npm run test:coverage
```

### Test Structure

```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── integration/
└── components/
    └── MyComponent.test.tsx
```

## Performance Monitoring

### Development Performance

- **Hot Module Replacement**: Enabled by default in Vite
- **Fast Refresh**: React Fast Refresh for component updates
- **Bundle Analysis**: Webpack Bundle Analyzer integration

### Profiling Tools

- **React DevTools**: Component performance profiling
- **Chrome Performance Tab**: General performance analysis
- **Lighthouse**: Web performance auditing

## Troubleshooting Common Issues

### Installation Problems

1. **Node.js version conflicts**:

   ```bash
   # Use nvm to manage versions
   nvm install 18
   nvm use 18
   ```

2. **Permission errors**:
   ```bash
   # Fix npm permissions
   sudo chown -R $(whoami) ~/.npm
   ```

### Build Issues

1. **WASM compilation failures**:

   ```bash
   # Ensure Rust targets are installed
   rustup target add wasm32-unknown-unknown
   ```

2. **Dependency conflicts**:
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

### Runtime Issues

1. **Environment variables not loading**:
   - Verify .env file location
   - Check variable prefixes (VITE\_\* for frontend)

2. **Database connection errors**:
   ```bash
   # Restart Supabase
   supabase stop
   supabase start
   ```

## Platform-Specific Considerations

### Windows

- **Terminal**: Use Git Bash or Windows Terminal
- **Path Issues**: Be aware of path separator differences
- **Line Endings**: Configure Git to handle line endings properly

### macOS

- **Homebrew**: Recommended for package management
- **Xcode Command Line Tools**: Required for some builds
- **Gatekeeper**: May need to allow unsigned applications

### Linux

- **Package Managers**: Use apt, yum, or pacman as appropriate
- **Permissions**: Ensure proper file permissions
- **Dependencies**: Install build-essential and development tools

## Security Best Practices

### Development Security

- **Environment Variables**: Never commit sensitive data
- **API Keys**: Use development keys for local development
- **HTTPS**: Use HTTPS for local development when possible

### Code Security

- **Dependency Auditing**: Regularly check for vulnerabilities
  ```bash
  npm audit
  ```
- **Static Analysis**: Use ESLint security plugins

## Version Control Workflow

### Git Configuration

```bash
# Set user information
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Set default branch
git config init.defaultBranch main
```

### Branching Strategy

- **main**: Production-ready code
- **develop**: Development branch
- \*_feature/_: Feature branches
- \*_hotfix/_: Hotfix branches
- \*_release/_: Release branches

### Commit Guidelines

- **Conventional Commits**: Follow conventional commit format
- **Atomic Commits**: Small, focused changes
- **Meaningful Messages**: Clear, descriptive commit messages

## Continuous Integration

### Local CI Simulation

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm test

# Build check
npm run build
```

### Pre-commit Hooks

- **Husky**: Git hooks management
- **Lint-staged**: Run linters on staged files
- **Commitlint**: Enforce commit message format

## Additional Documentation

For more detailed information about specific components of the TuneTON system, please refer to the following documentation files:

- **System Architecture**: [SYSTEM_ARCHITECTURE.md](file:///c%3A/Users/user/tuneTON_3.0/documentation/core-architecture/SYSTEM_ARCHITECTURE.md)
- **Audio Engine**: [AUDIO_ENGINE_SPECIFICATION.md](file:///c%3A/Users/user/tuneTON_3.0/documentation/core-architecture/AUDIO_ENGINE_SPECIFICATION.md)
- **Backend Services**: [BACKEND_SERVICES.md](file:///c%3A/Users/user/tuneTON_3.0/documentation/core-architecture/BACKEND_SERVICES.md)
- **Telegram Integration**: [TELEGRAM_INTEGRATION.md](file:///c%3A/Users/user/tuneTON_3.0/documentation/core-architecture/TELEGRAM_INTEGRATION.md)
- **WASM Implementation**: [WASM_IMPLEMENTATION.md](file:///c%3A/Users/user/tuneTON_3.0/documentation/core-architecture/WASM_IMPLEMENTATION.md)
- **API Specification**: [API_SPECIFICATION.md](file:///c%3A/Users/user/tuneTON_3.0/documentation/api/API_SPECIFICATION.md)

This guide provides a comprehensive overview of setting up and working with the TuneTON development environment, ensuring all developers can quickly get started and be productive on the project.
