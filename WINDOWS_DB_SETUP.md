# Windows Database Setup - Complete Guide

## Current Status
- ✅ Docker is installed
- ⚠️ Docker Desktop is not running

## Quick Setup Steps

### Step 1: Start Docker Desktop
```powershell
# Manually start Docker Desktop from Start Menu
# Or run this command:
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Wait 30-60 seconds for Docker to start
```

### Step 2: Create PostgreSQL Container
```powershell
docker run --name supremescan-db `
  -e POSTGRES_PASSWORD=supremescan123 `
  -e POSTGRES_USER=supremescan_user `
  -e POSTGRES_DB=supremescan `
  -p 5432:5432 `
  -d postgres:16-alpine
```

### Step 3: Wait for PostgreSQL to Start (10 seconds)
```powershell
Start-Sleep -Seconds 10
```

### Step 4: Run Migrations
```powershell
# Install pg npm package globally if needed
npm install -g pg

# Or use Docker exec to run SQL
docker exec -i supremescan-db psql -U supremescan_user -d supremescan < migrations/001_extensions_rules.sql
docker exec -i supremescan-db psql -U supremescan_user -d supremescan < migrations/002_projects_scans.sql
docker exec -i supremescan-db psql -U supremescan_user -d supremescan < migrations/003_users_github.sql
```

### Step 5: Update .env
```env
SUPREMESCAN_DB_URL=postgresql://supremescan_user:supremescan123@localhost:5432/supremescan
ENCRYPTION_KEY=<generate with node command below>
```

Generate encryption key:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 6: Test Connection
```powershell
node test-database.js
```

---

## All-in-One PowerShell Script

Save as `setup-db.ps1` and run:

```powershell
# Start Docker Desktop if not running
Write-Host "Starting Docker Desktop..." -ForegroundColor Yellow
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
Write-Host "Waiting for Docker to start (60 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

# Remove existing container if exists
docker rm -f supremescan-db 2>$null

# Create PostgreSQL container
Write-Host "`nCreating PostgreSQL container..." -ForegroundColor Green
docker run --name supremescan-db `
  -e POSTGRES_PASSWORD=supremescan123 `
  -e POSTGRES_USER=supremescan_user `
  -e POSTGRES_DB=supremescan `
  -p 5432:5432 `
  -d postgres:16-alpine

Write-Host "Waiting for PostgreSQL to initialize (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Run migrations
Write-Host "`nRunning migrations..." -ForegroundColor Green
Get-Content migrations\001_extensions_rules.sql | docker exec -i supremescan-db psql -U supremescan_user -d supremescan
Get-Content migrations\002_projects_scans.sql | docker exec -i supremescan-db psql -U supremescan_user -d supremescan
Get-Content migrations\003_users_github.sql | docker exec -i supremescan-db psql -U supremescan_user -d supremescan

# Generate encryption key
$encryptionKey = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Write-Host "`n✅ Database setup complete!" -ForegroundColor Green
Write-Host "`nAdd these to your .env file:" -ForegroundColor Cyan
Write-Host "SUPREMESCAN_DB_URL=postgresql://supremescan_user:supremescan123@localhost:5432/supremescan"
Write-Host "ENCRYPTION_KEY=$encryptionKey"

# Test connection
Write-Host "`nTesting connection..." -ForegroundColor Yellow
node test-database.js
```

---

## Troubleshooting

### "Docker Desktop is not running"
1. Open Start Menu
2. Search for "Docker Desktop"
3. Click to start it
4. Wait for the whale icon in system tray to stop animating
5. Run the setup commands again

### "Port 5432 already in use"
```powershell
# Remove existing container
docker rm -f supremescan-db

# Or find what's using port 5432
netstat -ano | findstr :5432
```

### "Container already exists"
```powershell
# Remove and recreate
docker rm -f supremescan-db
# Then run the docker run command again
```

---

## Manual Alternative (No Docker)

If Docker doesn't work, download PostgreSQL installer:
1. Visit: https://www.postgresql.org/download/windows/
2. Download PostgreSQL 16 installer
3. Run installer with these settings:
   - Password: `supremescan123`
   - Port: `5432`
   - Default locale
4. After install, add to PATH:
   `C:\Program Files\PostgreSQL\16\bin`
5. Run migrations manually with psql
