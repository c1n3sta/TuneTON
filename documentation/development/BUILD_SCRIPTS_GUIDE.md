# TuneTON Build Scripts Guide

## Overview

This document explains the different build scripts available for TuneTON and how to use them for development and production environments.

## Build Scripts

### Development Builds

Development builds include all features, debugging tools, and source maps for easier development and testing.

#### `npm run build:dev` or `npm run build:development`

- Creates a development build with all features enabled
- Includes source maps for debugging
- Copies all files from the public directory
- Suitable for testing and development environments

#### `npm run dev` or `npm run start`

- Starts the development server with hot reloading
- Automatically rebuilds on file changes
- Includes all development features

### Production Builds

Production builds are optimized for performance and include only essential files needed for the application to run.

#### `npm run build:prod` or `npm run build:production`

- Creates a minimal production build
- Excludes development-only files and debugging tools
- Optimizes code for performance
- Removes console logs and debug information
- Includes only essential API files

#### `npm run build:minimal`

- Creates the most minimal build possible
- Strips out all non-essential features
- Optimized for the smallest bundle size
- Suitable for deployment to production servers

### Analysis Builds

Analysis builds help identify bundle size issues and optimization opportunities.

#### `npm run build:analyze`

- Creates a production build with bundle analysis
- Generates a detailed report of bundle contents
- Opens the analysis report automatically
- Helps identify optimization opportunities

#### `npm run build:check`

- Runs TypeScript type checking
- Creates a development build for testing
- Useful for CI/CD pipelines

## File Inclusion Policy

### Production Build (Minimal)

Only includes essential files:

- Compiled JavaScript/CSS bundles
- Essential API files (`tracks.php`, `playback.php`)
- `.htaccess` configuration
- Essential assets (icons, images)
- PWA manifest and service worker

Excludes:

- Audio files (should be served separately)
- Development-only assets
- Source maps
- Debugging tools
- Test files

### Development Build (Full)

Includes all files:

- All API files
- All assets
- Source maps
- Development tools
- Test files
- Documentation

## Environment-Specific Configurations

### Production Environment

- `NODE_ENV=production`
- Code minification enabled
- Console logs removed
- Source maps disabled
- Bundle splitting optimized
- PWA enabled

### Development Environment

- `NODE_ENV=development`
- Code minification disabled
- Console logs preserved
- Source maps enabled
- Hot reloading enabled
- Debugging tools included

## Usage Examples

### For Local Development

```bash
# Start development server
npm run dev

# Create development build for testing
npm run build:dev
```

### For Production Deployment

```bash
# Create optimized production build
npm run build:prod

# Create minimal production build
npm run build:minimal

# Analyze bundle size
npm run build:analyze
```

### For CI/CD Pipelines

```bash
# Check types and create development build
npm run build:check

# Run tests
npm run test

# Check code formatting
npm run format:check
```

## Customization

### Adding New Build Scripts

To add new build scripts, modify the `scripts` section in `package.json`:

```json
{
  "scripts": {
    "build:custom": "your-custom-build-command"
  }
}
```

### Modifying Build Configuration

The build configuration is defined in `vite.config.ts`. You can modify:

- Output directory
- Bundle splitting strategy
- Minification settings
- Source map options
- Environment-specific configurations

## Best Practices

### For Development

1. Use `npm run dev` for active development
2. Run `npm run build:dev` to test the development build
3. Use `npm run build:analyze` to identify optimization opportunities

### For Production

1. Always use `npm run build:prod` for production deployments
2. Test the production build locally before deployment
3. Use `npm run build:minimal` for the smallest bundle size
4. Verify that all essential features work in the production build

### For CI/CD

1. Run `npm run build:check` to verify the build
2. Run `npm run test` to ensure all tests pass
3. Run `npm run lint` to check code quality
4. Run `npm run format:check` to verify code formatting

## Troubleshooting

### Build Failures

1. Check the error message for specific details
2. Run `npm run type-check` to identify TypeScript issues
3. Run `npm run lint` to identify code quality issues
4. Ensure all dependencies are installed with `npm install`

### Performance Issues

1. Use `npm run build:analyze` to identify large dependencies
2. Check bundle splitting configuration
3. Optimize image assets
4. Remove unused code

### Deployment Issues

1. Verify that all essential files are included
2. Check that API endpoints are working
3. Test PWA functionality
4. Verify browser compatibility

## File Structure After Build

### Production Build (`dist/`)

```
dist/
├── assets/
│   ├── js/
│   ├── css/
│   └── images/
├── api/
│   ├── tracks.php
│   └── playback.php
├── .htaccess
├── index.html
├── manifest.webmanifest
├── build-info.json
└── sw.js (service worker)
```

### Development Build (`dist/`)

```
dist/
├── assets/
│   ├── js/
│   ├── css/
│   └── images/
├── audio/
├── api/
│   ├── tracks.php
│   └── playback.php
├── data/
├── .htaccess
├── index.html
├── manifest.webmanifest
├── build-info.json
└── sw.js (service worker)
```

## Notes

1. Audio files are intentionally excluded from production builds to reduce bundle size
2. Audio files should be served from a separate CDN or storage service
3. The build process automatically generates a `build-info.json` file with build metadata
4. Source maps are automatically disabled in production builds
5. Console logs are automatically removed in production builds
