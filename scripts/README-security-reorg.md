# Backend Security Reorganization

This directory contains scripts to reorganize your TuneTON backend files according to security best practices, moving them from a web-accessible directory to an isolated application directory.

## Why This Matters

Storing backend code in a web-accessible directory poses security risks:
- Sensitive files (like `.env`) could be accessed directly via HTTP
- Server-side code is closer to the web root
- Increased attack surface due to misconfigured servers

Moving to an isolated directory improves security by:
- Isolating backend code from publicly accessible files
- Reducing attack surface
- Providing better control over what gets exposed to the web
- Following standard security recommendations

## Scripts Included

1. `reorganize-backend-security.js` - Provides manual instructions for reorganization
2. `secure-backend-deployment.js` - Template for automated FTP deployment (requires additional dependencies)
3. `secure-backend-reorg.sh` - Shell script to run directly on the server

## How to Use

### Option 1: Manual Reorganization (Recommended)

1. SSH into your server:
   ```bash
   ssh u3220060@server290.hosting.reg.ru
   ```

2. Upload the shell script to your server using FTP or copy-paste it directly:
   ```bash
   nano secure-backend-reorg.sh
   # Paste the contents and save
   chmod +x secure-backend-reorg.sh
   ```

3. Run the script:
   ```bash
   ./secure-backend-reorg.sh
   ```

### Option 2: Following Manual Instructions

1. SSH into your server:
   ```bash
   ssh u3220060@server290.hosting.reg.ru
   ```

2. Execute these commands manually:
   ```bash
   # Create the isolated backend directory
   mkdir -p /tuneton/backend
   
   # Copy files from web-accessible directory to isolated directory
   cp -r /www/tuneton.space/backend/* /tuneton/backend/
   
   # Set proper permissions for security
   find /tuneton/backend -type d -exec chmod 755 {} \;
   find /tuneton/backend -type f -exec chmod 644 {} \;
   chmod 600 /tuneton/backend/.env*
   
   # Verify the copy was successful
   ls -la /tuneton/backend/
   ```

## After Reorganization

1. **Test your application** to ensure everything works correctly

2. **Configure your web server** to proxy requests to port 3001 where the backend application will run

3. **Remove the web-accessible copy** (only after confirming everything works):
   ```bash
   rm -rf /www/tuneton.space/backend/
   ```

## Security Benefits

- Isolates backend code from web-accessible directories
- Reduces attack surface by limiting direct file access
- Improves permission control over sensitive files
- Follows security best practices for web applications

## Notes

- Remember to update any deployment scripts to use the new location
- Ensure your web server is configured to proxy requests to the backend
- Always test thoroughly before removing the old directory