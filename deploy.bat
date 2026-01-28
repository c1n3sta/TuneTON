@echo off
echo Starting deployment process...

REM Step 1: Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo npm install failed, trying with yarn...
        yarn install
        if errorlevel 1 (
            echo Both npm and yarn install failed
            pause
            exit /b 1
        )
    )
) else (
    echo Dependencies already installed.
)

REM Step 2: Build the project
echo Building project...
npm run build
if errorlevel 1 (
    echo Build failed
    pause
    exit /b 1
)

REM Step 3: Deploy via FTP
echo Starting FTP deployment...
node simple-ftp-deploy.js
if errorlevel 1 (
    echo FTP deployment failed
    pause
    exit /b 1
)

echo.
echo ✅ Deployment completed successfully!
echo 🚀 The new build has been uploaded to the production server.
pause