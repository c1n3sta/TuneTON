@echo off
setlocal

echo =========================================
echo TuneTON Monitoring Suite Setup
echo =========================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not installed. Please install Docker to proceed.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js to proceed.
    exit /b 1
)

echo All prerequisites found. Starting setup...

REM Setup PM2
echo.
echo -----------------------------------------
echo Setting up PM2 Process Monitoring...
echo -----------------------------------------
cd pm2
if exist setup.sh (
    bash setup.sh
) else (
    echo PM2 setup script not found.
)
cd ..

REM Setup Uptime-Kuma
echo.
echo -----------------------------------------
echo Setting up Uptime-Kuma...
echo -----------------------------------------
cd uptime-kuma
if exist setup.sh (
    bash setup.sh
) else (
    echo Uptime-Kuma setup script not found.
)
cd ..

REM Setup Prometheus and Grafana
echo.
echo -----------------------------------------
echo Setting up Prometheus and Grafana...
echo -----------------------------------------
cd prometheus-grafana
if exist setup.sh (
    bash setup.sh
) else (
    echo Prometheus/Grafana setup script not found.
)
cd ..

REM Setup ELK Stack
echo.
echo -----------------------------------------
echo Setting up ELK Stack...
echo -----------------------------------------
cd elk-stack
if exist setup.sh (
    bash setup.sh
) else (
    echo ELK Stack setup script not found.
)
cd ..

REM Setup Dashboard
echo.
echo -----------------------------------------
echo Setting up Monitoring Dashboard...
echo -----------------------------------------
cd dashboards
if exist setup.sh (
    echo Dashboard setup complete. Run 'npm install -g http-server' and then 'npx http-server -p 8080' to serve the dashboard.
) else (
    echo Dashboard setup script not found.
)
cd ..

echo.
echo =========================================
echo Setup Complete!
echo =========================================
echo.
echo Monitoring services are now running:
echo   PM2 Dashboard: http://localhost:9615
echo   Uptime-Kuma: http://localhost:3002
echo   Grafana: http://localhost:3003 (admin/admin)
echo   Kibana: http://localhost:5601
echo   Prometheus: http://localhost:9090
echo.
echo To serve the all-in-one dashboard:
echo   cd monitoring/dashboards
echo   npx http-server -p 8080
echo   Then visit: http://localhost:8080
echo.
echo Note: Some services may take a minute to fully initialize.