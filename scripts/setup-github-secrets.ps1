# This script helps set up GitHub secrets needed for the CI/CD pipeline
# Run this script in the repository root directory

# Check if gh CLI is installed
try {
    $ghVersion = gh --version
    Write-Host "GitHub CLI is installed: $ghVersion" -ForegroundColor Green
} catch {
    Write-Host "GitHub CLI is not installed. Please install it from https://cli.github.com/" -ForegroundColor Red
    exit 1
}

# Check if user is logged in
try {
    $user = gh api user
    Write-Host "Logged in as: $($user.login)" -ForegroundColor Green
} catch {
    Write-Host "Please log in to GitHub CLI using 'gh auth login'" -ForegroundColor Red
    exit 1
}

# Get repository name
$repo = (gh repo view --json nameWithOwner -q ".nameWithOwner")
if (-not $repo) {
    $repo = Read-Host "Enter repository name (owner/repo):"
}

# Function to set a secret
function Set-GitHubSecret {
    param (
        [string]$SecretName,
        [string]$Description,
        [switch]$IsFile
    )
    
    Write-Host "`n=== $SecretName ===" -ForegroundColor Cyan
    Write-Host $Description -ForegroundColor Gray
    
    if ($IsFile) {
        $filePath = Read-Host "Enter path to file containing $SecretName"
        if (Test-Path $filePath) {
            gh secret set $SecretName --repo $repo < $filePath
            Write-Host "$SecretName set from file" -ForegroundColor Green
        } else {
            Write-Host "File not found: $filePath" -ForegroundColor Red
        }
    } else {
        $value = Read-Host -AsSecureString "Enter value for $SecretName"
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($value)
        $plainValue = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
        
        # Using environment variable to pass the secret
        $env:TEMP_SECRET = $plainValue
        $plainValue | gh secret set $SecretName --repo $repo
        $env:TEMP_SECRET = $null
        
        Write-Host "$SecretName set" -ForegroundColor Green
    }
}

# Set up Kubernetes config
Set-GitHubSecret -SecretName "KUBE_CONFIG" -Description "Kubernetes configuration file (kubeconfig) for deployment" -IsFile

# Set up Docker registry credentials
$setDockerCreds = Read-Host "Set up Docker registry credentials? (y/n)"
if ($setDockerCreds -eq 'y') {
    Set-GitHubSecret -SecretName "DOCKER_USERNAME" -Description "Docker registry username"
    Set-GitHubSecret -SecretName "DOCKER_PASSWORD" -Description "Docker registry password or token"
}

# Set up application secrets
$setAppSecrets = Read-Host "Set up application secrets? (y/n)"
if ($setAppSecrets -eq 'y') {
    Set-GitHubSecret -SecretName "JWT_SECRET" -Description "JWT secret key for authentication"
    Set-GitHubSecret -SecretName "TELEGRAM_BOT_TOKEN" -Description "Telegram bot token for authentication"
    Set-GitHubSecret -SecretName "DATABASE_URL" -Description "Main database connection string"
    Set-GitHubSecret -SecretName "RABBITMQ_URL" -Description "RabbitMQ connection URL"
}

Write-Host "`n=== GitHub Secrets Setup Complete ===" -ForegroundColor Green
Write-Host "The following secrets have been configured:" -ForegroundColor White
gh secret list --repo $repo
