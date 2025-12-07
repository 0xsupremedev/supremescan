# Quick Database Setup (Manual Steps)

## Option 1: Quick Docker Setup (Recommended)

```bash
# Pull and run PostgreSQL in Docker
docker run --name supremescan-db \
  -e POSTGRES_PASSWORD=supremescan123 \
  -e POSTGRES_USER=supremescan_user \
  -e POSTGRES_DB=supremescan \
  -p 5432:5432 \
  -d postgres

# Test connection
docker exec -it supremescan-db psql -U supremescan_user -d supremescan -c "SELECT NOW();"
```

## Option 2: Install PostgreSQL Locally

1. **Download**: https://www.postgresql.org/download/windows/
2. **Install** with default settings
3. **Remember the postgres password** you set during installation

## Run Migrations

```powershell
# Set environment variable for password
$env:PGPASSWORD="supremescan123"

# Connect and run migrations
psql -U supremescan_user -d supremescan -h localhost -p 5432 -f migrations/001_extensions_rules.sql
psql -U supremescan_user -d supremescan -h localhost -p 5432 -f migrations/002_projects_scans.sql
psql -U supremescan_user -d supremescan -h localhost -p 5432 -f migrations/003_users_github.sql
```

## Update .env

Add to your `.env` file:

```env
# Database
SUPREMESCAN_DB_URL=postgresql://supremescan_user:supremescan123@localhost:5432/supremescan

# Encryption Key (generate one below)
ENCRYPTION_KEY=<run command below to generate>
```

Generate encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Test Connection

```bash
node test-database.js
```

## If You Get Errors

### "psql: command not found"
Add PostgresQL bin to PATH:
```
C:\Program Files\PostgreSQL\16\bin
```

### "database does not exist"
```powershell
# Connect as postgres user
psql -U postgres

# Create database
CREATE DATABASE supremescan;
CREATE USER supremescan_user WITH PASSWORD 'supremescan123';
GRANT ALL PRIVILEGES ON DATABASE supremescan TO supremescan_user;
\q
```

### "connection refused"
- Make sure PostgreSQL service is running
- Check Windows Services → postgresql-x64-16

## Verify Setup

```bash
# Test with node script
node test-database.js

# Should show:
# ✅ Database connected
# 📋 Tables found: users, projects, scans, etc.
```

---

## Super Quick (If You Have Docker)

```bash
# All-in-one
docker run --name supremescan-db -e POSTGRES_PASSWORD=supremescan123 -e POSTGRES_USER=supremescan_user -e POSTGRES_DB=supremescan -p 5432:5432 -d postgres && sleep 5 && psql -U supremescan_user -d supremescan -h localhost -f migrations/001_extensions_rules.sql && psql -U supremescan_user -d supremescan -h localhost -f migrations/002_projects_scans.sql && psql -U supremescan_user -d supremescan -h localhost -f migrations/003_users_github.sql
```

Then add to `.env`:
```
SUPREMESCAN_DB_URL=postgresql://supremescan_user:supremescan123@localhost:5432/supremescan
```
