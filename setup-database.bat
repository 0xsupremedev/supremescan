@echo off
echo ====================================
echo SupremeScan Database Setup
echo ====================================
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo PostgreSQL not found in PATH!
    echo.
    echo Please install PostgreSQL from:
    echo https://www.postgresql.org/download/windows/
    echo.
    echo Or use Docker:
    echo docker run --name supremescan-db -e POSTGRES_PASSWORD=supremescan123 -p 5432:5432 -d postgres
    pause
    exit /b 1
)

echo Step 1: Creating database...
echo.

REM Set PostgreSQL connection details
set PGPASSWORD=postgres
set PGUSER=postgres
set PGHOST=localhost
set PGPORT=5432

REM Create database
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -c "CREATE DATABASE supremescan;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Database 'supremescan' created
) else (
    echo Database 'supremescan' may already exist or check your PostgreSQL installation
)

echo.
echo Step 2: Creating user...
echo.

REM Create user
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -c "CREATE USER supremescan_user WITH PASSWORD 'supremescan_password';" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ User 'supremescan_user' created
) else (
    echo User 'supremescan_user' may already exist
)

echo.
echo Step 3: Granting privileges...
echo.

psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -c "GRANT ALL PRIVILEGES ON DATABASE supremescan TO supremescan_user;" >nul
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d supremescan -c "GRANT ALL ON SCHEMA public TO supremescan_user;" >nul
echo ✓ Privileges granted

echo.
echo Step 4: Running migrations...
echo.

set PGPASSWORD=supremescan_password
set PGUSER=supremescan_user
set PGDATABASE=supremescan

echo Running migration 001_extensions_rules.sql...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -f migrations\001_extensions_rules.sql >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ Migration 001 completed
) else (
    echo ✗ Migration 001 failed or already applied
)

echo Running migration 002_projects_scans.sql...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -f migrations\002_projects_scans.sql >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ Migration 002 completed
) else (
    echo ✗ Migration 002 failed or already applied
)

echo Running migration 003_users_github.sql...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -f migrations\003_users_github.sql >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ Migration 003 completed
) else (
    echo ✗ Migration 003 failed or already applied
)

echo.
echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo Database Connection String:
echo postgresql://supremescan_user:supremescan_password@localhost:5432/supremescan
echo.
echo Add this to your .env file:
echo SUPREMESCAN_DB_URL=postgresql://supremescan_user:supremescan_password@localhost:5432/supremescan
echo.
echo Also add ENCRYPTION_KEY (generate with):
echo node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
echo.
pause
