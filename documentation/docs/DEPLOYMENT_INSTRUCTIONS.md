# Deployment Instructions

## Automatic Deployment

To deploy the latest build to production:

```bash
npm run deploy:prod
```

This command will:
1. Create a new production build
2. Upload the files to the production server via FTP

## Manual Deployment

If you need to deploy manually:

1. Create a production build:
   ```bash
   npm run build:prod
   ```

2. Upload files using the deployment script:
   ```bash
   npm run deploy
   ```

## FTP Configuration

The FTP settings are stored in:
- `u3220060_tuneton_qoder.ftp_settings` - FileZilla configuration
- `ftp-commands.txt` - FTP commands for automated upload

## Deployment Package

The `deploy-package` directory contains the files that are uploaded to the production server:
- All files from the dist folder
- API files
- Assets
- Audio files (for development only)

Note: Audio files should be served separately in production or uploaded to a CDN.

## Troubleshooting

If deployment fails:

1. Check that the FTP credentials in ftp-commands.txt are correct
2. Verify that you can connect to the FTP server manually
3. Ensure you have write permissions to the target directory
4. Check that the dist folder was built successfully
5. Make sure there are no firewall issues blocking FTP connections

## Manual FTP Upload

If automated deployment fails, you can manually upload files:

1. Connect to FTP server using FileZilla or another FTP client
2. Upload all files from the `dist` directory to the server root
3. Make sure to preserve the directory structure

## Rollback

To rollback to a previous version:

1. Download the previous build from backup
2. Upload it to the server using the same process