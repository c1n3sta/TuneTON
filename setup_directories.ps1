# Create base directories
$services = @("api-gateway", "auth-service", "user-service", "track-service", "audio-processing-service", "playlist-service", "streaming-service")

# Create service directories
foreach ($service in $services) {
    $servicePath = "services\$service"
    Write-Host "Creating directory structure for $service..."
    
    # Create main service directory
    New-Item -ItemType Directory -Force -Path $servicePath | Out-Null
    
    # Create subdirectories
    @("src", "config", "tests", "src\controllers", "src\routes", "src\middlewares", "src\services", "src\models") | ForEach-Object {
        $dirPath = Join-Path $servicePath $_
        New-Item -ItemType Directory -Force -Path $dirPath | Out-Null
    }
    
    # Create basic files
    @("Dockerfile", "package.json", "tsconfig.json", "README.md") | ForEach-Object {
        $filePath = Join-Path $servicePath $_
        if (-not (Test-Path $filePath)) {
            New-Item -ItemType File -Path $filePath | Out-Null
        }
    }
}

# Create k8s directories
@("k8s\dev", "k8s\prod", "monitoring", "scripts", "docs") | ForEach-Object {
    New-Item -ItemType Directory -Force -Path $_ | Out-Null
}

Write-Host "Directory structure created successfully!"
