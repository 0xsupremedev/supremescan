# Start Docker Desktop if not running
Write-Host "Checking Docker status..." -ForegroundColor Yellow

$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker Desktop is not running. Starting..." -ForegroundColor Yellow
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Write-Host "Waiting for Docker to start (please wait 60 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 60
}

# Remove existing container if exists
Write-Host "`nRemoving old container (if exists)..." -ForegroundColor Yellow
docker rm -f supremescan-db 2>$null

# Create PostgreSQL container
Write-Host "`nCreating PostgreSQL container..." -ForegroundColor Green
docker run --name supremescan-db `
  -e POSTGRES_PASSWORD=supremescan123 `
  -e POSTGRES_USER=supremescan_user `
  -e POSTGRES_DB=supremescan `
  -p 5432:5432 `
  -d postgres:16-alpine

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Failed to create Docker container!" -ForegroundColor Red
    Write-Host "Please make sure Docker Desktop is running." -ForegroundColor Yellow
    Write-Host "Open Docker Desktop from Start Menu and wait for it to fully start." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✅ Container created! Waiting for PostgreSQL to initialize (15 seconds)..." -ForegroundColor Green
Start-Sleep -Seconds 15

# Test connection
Write-Host "`nTesting database connection..." -ForegroundColor Yellow
$testResult = docker exec supremescan-db psql -U supremescan_user -d supremescan -c "SELECT NOW();" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database is ready!" -ForegroundColor Green
} else {
    Write-Host "⏳ Database still initializing. Waiting 10 more seconds..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}

# Run migrations
Write-Host "`nRunning migrations..." -ForegroundColor Green

Write-Host "  - Running 001_extensions_rules.sql..." -ForegroundColor Cyan
Get-Content migrations\001_extensions_rules.sql | docker exec -i supremescan-db psql -U supremescan_user -d supremescan 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) { Write-Host "    ✅ Migration 001 complete" -ForegroundColor Green }

Write-Host "  - Running 002_projects_scans.sql..." -ForegroundColor Cyan
Get-Content migrations\002_projects_scans.sql | docker exec -i supremescan-db psql -U supremescan_user -d supremescan 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) { Write-Host "    ✅ Migration 002 complete" -ForegroundColor Green }

Write-Host "  - Running 003_users_github.sql..." -ForegroundColor Cyan
Get-Content migrations\003_users_github.sql | docker exec -i supremescan-db psql -U supremescan_user -d supremescan 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) { Write-Host "    ✅ Migration 003 complete" -ForegroundColor Green }

# Generate encryption key
Write-Host "`nGenerating encryption key..." -ForegroundColor Yellow
$encryptionKey = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ Database Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nAdd these lines to your .env file:" -ForegroundColor Yellow
Write-Host ""
Write-Host "SUPREMESCAN_DB_URL=postgresql://supremescan_user:supremescan123@localhost:5432/supremescan" -ForegroundColor White
Write-Host "ENCRYPTION_KEY=$encryptionKey" -ForegroundColor White
Write-Host ""
Write-Host "Testing connection..." -ForegroundColor Yellow
Write-Host ""

# Test with node script
node test-database.js

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
