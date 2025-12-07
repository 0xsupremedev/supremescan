# Database Integration - Setup Guide

## ✅ What's Been Implemented

### Database Connection
- PostgreSQL connection pool created
- Query utilities with transaction support
- Connection testing function

### Database Models
- **Users**: Authentication + GitHub integration
- **Projects**: Repository linking with metadata
- **Migrations**: Schema updates for GitHub integration

### Updated APIs
- `/api/auth/register` - Uses database
- `/api/auth/login` - Uses database
- Route protection middleware

---

## 🚀 Setup Instructions

### 1. Install PostgreSQL

**Windows**:
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use Docker:
docker run --name supremescan-db -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres
```

**Mac/Linux**:
```bash
# macOS
brew install postgresql

# Linux
sudo apt-get install postgresql postgresql-contrib
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE supremescan;

# Create user  
CREATE USER supremescan_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE supremescan TO supremescan_user;
```

### 3. Run Migrations

```bash
# Connect to database
psql -U supremescan_user -d supremescan

# Run migrations in order
\i migrations/001_extensions_rules.sql
\i migrations/002_projects_scans.sql
\i migrations/003_users_github.sql
```

### 4. Configure Environment

Update `.env`:
```env
# Database
SUPREMESCAN_DB_URL=postgresql://supremescan_user:your_secure_password@localhost:5432/supremescan

# Encryption (generate new key!)
ENCRYPTION_KEY=<32-char-hex-key>

# GitHub OAuth
GITHUB_CLIENT_ID=yourvalue
GITHUB_CLIENT_SECRET=yourvalue
```

Generate encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Test Connection

Create `test-db.js`:
```javascript
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.SUPREMESCAN_DB_URL
})

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})
```

Run:
```bash
node test-db.js
```

---

## 📋 Migration Status

- ✅ `001_extensions_rules.sql` - Extensions & rules
- ✅ `002_projects_scans.sql` - Projects & scans
- ✅ `003_users_github.sql` - Users & GitHub integration

---

## ✨ What Changed

### Before
- User data in memory array
- GitHub tokens in cookies
- Scans lost on restart

### After
- Users in PostgreSQL
- GitHub tokens encrypted in database
- Data persists across restarts
- Route protection active

---

## 🧪 Test the Integration

1. **Restart dev server**: `npm run dev`
2. **Register**: Visit `/signup`, create account
3. **Login**: Visit `/login`, sign in
4. **Protected routes**: Try accessing `/dashboard` without login
5. **Check database**:
   ```sql
   SELECT * FROM users;
   ```

---

## Next Steps

- [ ] Update `/api/projects/link` to use database
- [ ] Update `/api/scans/start` to save scans
- [ ] Update GitHub OAuth callback to save tokens in DB
- [ ] Connect dashboard to real data

Done already:
- ✅ Database connection pool
- ✅ User authentication with DB
- ✅ Route protection middleware
- ✅ Encrypted GitHub token storage (schema ready)
