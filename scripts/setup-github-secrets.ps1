# GitHub Secrets Setup Helper for PowerShell
# Usage: .\scripts\setup-github-secrets.ps1 -Mode Interactive

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('Interactive', 'FromFile', 'List', 'Generate')]
    [string]$Mode = "Interactive",

    [Parameter(Mandatory=$false)]
    [string]$FilePath = ".env.secrets",

    [Parameter(Mandatory=$false)]
    [string]$Repository = ""
)

# Color output
function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

# Check GitHub CLI
function Test-GitHubCLI {
    try {
        $ghVersion = gh --version 2>$null
        if ($?) {
            Write-Success "GitHub CLI found: $ghVersion"
            return $true
        }
    }
    catch {
        Write-Error-Custom "GitHub CLI not found"
        Write-Host "Install from: https://cli.github.com" -ForegroundColor Yellow
        return $false
    }
}

# Set secret
function Set-GitHubSecret {
    param(
        [string]$Name,
        [string]$Value,
        [string]$Repo
    )

    if ([string]::IsNullOrWhiteSpace($Value)) {
        Write-Warning-Custom "Skipping $Name - empty value"
        return
    }

    try {
        if ([string]::IsNullOrWhiteSpace($Repo)) {
            $Value | gh secret set $Name
        }
        else {
            $Value | gh secret set $Name --repo $Repo
        }
        Write-Success "Set secret: $Name"
    }
    catch {
        Write-Error-Custom "Failed to set secret: $Name"
    }
}

# Interactive setup
function Start-InteractiveSetup {
    Write-Host ""
    Write-Info "GitHub Secrets Setup Wizard"
    Write-Host ""

    # Database
    $mongoUri = Read-Host "MongoDB Production URI"
    $mongoReplSet = Read-Host "MongoDB Replica Set (optional, press Enter to skip)"

    # JWT
    $jwtProd = Read-Host "JWT Secret (Production)"
    $jwtStaging = Read-Host "JWT Secret (Staging)"
    $refreshProd = Read-Host "Refresh Token Secret (Production)"
    $refreshStaging = Read-Host "Refresh Token Secret (Staging)"

    # OpenAI
    $openaiProd = Read-Host "OpenAI API Key (Production)"
    $openaiStaging = Read-Host "OpenAI API Key (Staging)"

    # AWS
    $awsKey = Read-Host "AWS Access Key ID"
    $awsSecret = Read-Host "AWS Secret Access Key"
    $awsRegion = Read-Host "AWS Region (default: us-east-1)"
    if ([string]::IsNullOrWhiteSpace($awsRegion)) { $awsRegion = "us-east-1" }
    $awsBucket = Read-Host "AWS Backup Bucket"

    # Monitoring
    $sentryProd = Read-Host "Sentry DSN (Production, optional)"
    $sentryStaging = Read-Host "Sentry DSN (Staging, optional)"
    $datadog = Read-Host "Datadog API Key (optional)"

    # Codecov & Scanning
    $codecov = Read-Host "Codecov Token"
    $snyk = Read-Host "Snyk Token"

    Write-Host ""
    Write-Info "Setting secrets..."

    Set-GitHubSecret -Name "MONGODB_PROD_URI" -Value $mongoUri -Repo $Repository
    if (-not [string]::IsNullOrWhiteSpace($mongoReplSet)) {
        Set-GitHubSecret -Name "MONGODB_REPLICA_SET" -Value $mongoReplSet -Repo $Repository
    }
    Set-GitHubSecret -Name "JWT_SECRET_PROD" -Value $jwtProd -Repo $Repository
    Set-GitHubSecret -Name "JWT_SECRET_STAGING" -Value $jwtStaging -Repo $Repository
    Set-GitHubSecret -Name "REFRESH_TOKEN_SECRET_PROD" -Value $refreshProd -Repo $Repository
    Set-GitHubSecret -Name "REFRESH_TOKEN_SECRET_STAGING" -Value $refreshStaging -Repo $Repository
    Set-GitHubSecret -Name "OPENAI_API_KEY_PROD" -Value $openaiProd -Repo $Repository
    Set-GitHubSecret -Name "OPENAI_API_KEY_STAGING" -Value $openaiStaging -Repo $Repository
    Set-GitHubSecret -Name "AWS_ACCESS_KEY_ID" -Value $awsKey -Repo $Repository
    Set-GitHubSecret -Name "AWS_SECRET_ACCESS_KEY" -Value $awsSecret -Repo $Repository
    Set-GitHubSecret -Name "AWS_REGION" -Value $awsRegion -Repo $Repository
    Set-GitHubSecret -Name "AWS_BACKUP_BUCKET" -Value $awsBucket -Repo $Repository
    if (-not [string]::IsNullOrWhiteSpace($sentryProd)) {
        Set-GitHubSecret -Name "SENTRY_DSN_PROD" -Value $sentryProd -Repo $Repository
    }
    if (-not [string]::IsNullOrWhiteSpace($sentryStaging)) {
        Set-GitHubSecret -Name "SENTRY_DSN_STAGING" -Value $sentryStaging -Repo $Repository
    }
    if (-not [string]::IsNullOrWhiteSpace($datadog)) {
        Set-GitHubSecret -Name "DATADOG_API_KEY" -Value $datadog -Repo $Repository
    }
    Set-GitHubSecret -Name "CODECOV_TOKEN" -Value $codecov -Repo $Repository
    Set-GitHubSecret -Name "SNYK_TOKEN" -Value $snyk -Repo $Repository

    Write-Success "All secrets configured!"
}

# Load from file
function Load-FromFile {
    param([string]$FilePath)

    if (-not (Test-Path $FilePath)) {
        Write-Error-Custom "File not found: $FilePath"
        exit 1
    }

    Write-Info "Loading secrets from $FilePath..."

    $content = Get-Content $FilePath
    foreach ($line in $content) {
        # Skip comments and empty lines
        if ($line.StartsWith("#") -or [string]::IsNullOrWhiteSpace($line)) {
            continue
        }

        $parts = $line -split "=", 2
        if ($parts.Count -eq 2) {
            $key = $parts[0].Trim()
            $value = $parts[1].Trim().Trim('"').Trim("'")
            Set-GitHubSecret -Name $key -Value $value -Repo $Repository
        }
    }

    Write-Success "Loaded all secrets from $FilePath"
}

# List secrets
function Show-Secrets {
    Write-Info "Listing all GitHub Secrets..."
    gh secret list
}

# Generate template
function New-SecretsTemplate {
    $template = @"
# GitHub Secrets Template
# Copy this file to .env.secrets and fill in your values
# WARNING: DO NOT COMMIT .env.secrets to Git

# Database Configuration
MONGODB_PROD_URI=mongodb+srv://user:password@cluster.mongodb.net/taxmate?retryWrites=true&w=majority
MONGODB_REPLICA_SET=rs0

# JWT & Authentication
JWT_SECRET_PROD=your-secret-jwt-key-min-32-chars
JWT_SECRET_STAGING=your-staging-jwt-key-min-32-chars
REFRESH_TOKEN_SECRET_PROD=your-refresh-token-secret
REFRESH_TOKEN_SECRET_STAGING=your-staging-refresh-token

# OpenAI
OPENAI_API_KEY_PROD=sk-xxx
OPENAI_API_KEY_STAGING=sk-xxx
OPENAI_ORG_ID=org-xxx

# AWS Configuration
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_BACKUP_BUCKET=taxmate-backups
AWS_PROD_ACCESS_KEY=AKIA...
AWS_PROD_SECRET_KEY=...

# Monitoring & Error Tracking
SENTRY_DSN_PROD=https://xxx@o123456.ingest.sentry.io/123456
SENTRY_DSN_STAGING=https://xxx@o123456.ingest.sentry.io/123456
DATADOG_API_KEY=xxx
DATADOG_APP_KEY=xxx
NEW_RELIC_LICENSE_KEY=xxx

# Testing & Quality
CODECOV_TOKEN=xxx
SNYK_TOKEN=xxx
SONAR_TOKEN=xxx

# Email
SENDGRID_API_KEY_PROD=SG.xxx
SENDGRID_API_KEY_STAGING=SG.xxx
"@

    $template | Out-File -FilePath ".env.secrets.template" -Encoding UTF8
    Write-Success "Generated .env.secrets.template"
    Write-Warning-Custom "Edit .env.secrets.template with your actual values"
    Write-Warning-Custom "Then run: .\scripts\setup-github-secrets.ps1 -Mode FromFile -FilePath .env.secrets.template"
}

# Display help
function Show-Help {
    $help = @"
GitHub Secrets Setup Helper for PowerShell

Usage: .\scripts\setup-github-secrets.ps1 [OPTIONS]

OPTIONS:
    -Mode Interactive    Interactive setup wizard (default)
    -Mode FromFile      Load secrets from file
    -Mode List          List all configured secrets
    -Mode Generate      Generate template .env.secrets file
    -FilePath FILE      Path to secrets file (default: .env.secrets)
    -Repository REPO    Target repository

EXAMPLES:
    # Interactive setup
    .\scripts\setup-github-secrets.ps1 -Mode Interactive

    # Load from file
    .\scripts\setup-github-secrets.ps1 -Mode FromFile -FilePath .env.secrets

    # List secrets
    .\scripts\setup-github-secrets.ps1 -Mode List

    # Generate template
    .\scripts\setup-github-secrets.ps1 -Mode Generate

"@
    Write-Host $help
}

# Main
if (-not (Test-GitHubCLI)) {
    exit 1
}

switch ($Mode) {
    "Interactive" {
        Start-InteractiveSetup
        break
    }
    "FromFile" {
        Load-FromFile -FilePath $FilePath
        break
    }
    "List" {
        Show-Secrets
        break
    }
    "Generate" {
        New-SecretsTemplate
        break
    }
    default {
        Show-Help
    }
}
