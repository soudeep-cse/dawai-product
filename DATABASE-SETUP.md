# 🗄️ Database Setup Guide

## Prerequisites

You need PostgreSQL installed. Choose one of these options:

### Option 1: Local PostgreSQL (Self-Hosted)

**Windows:**
1. Download PostgreSQL 14+ from https://www.postgresql.org/download/windows/
2. Install with these settings:
   - Port: 5432 (default)
   - Superuser password: `password` (or your choice)
3. Verify installation:
   ```bash
   psql --version
   ```

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Option 2: Cloud Database (Recommended for Production)

- **Supabase** (PostgreSQL): https://supabase.com (Free tier available)
- **Neon**: https://neon.tech (PostgreSQL, free tier)
- **Railway**: https://railway.app (PostgreSQL)
- **Vercel Postgres**: https://vercel.com/storage/postgres

---

## Setup Steps

### 1. Create Local Database

If using local PostgreSQL:

```bash
# Windows: Open Command Prompt or PowerShell as Administrator
psql -U postgres

# Then run:
CREATE DATABASE dawai;
\q
```

Or use PostgreSQL GUI (pgAdmin):
1. Open pgAdmin (usually installed with PostgreSQL)
2. Create new database named `dawai`

### 2. Get Connection String

**For local PostgreSQL:**
```
postgresql://postgres:password@localhost:5432/dawai
```

Change `password` if you set a different superuser password during installation.

**For cloud services:**
1. Log in to your service
2. Copy the connection string
3. Should look like: `postgresql://user:password@host:5432/database`

### 3. Update `.env` File

Replace the DATABASE_URL in `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/dawai"
```

### 4. Run Migration

```bash
cd E:\Soudeep-Urgent\dawai-website
npx prisma migrate dev --name init
```

This will:
- Create all tables in your database
- Generate Prisma client
- Run seed data

### 5. Verify Database

Option A: Using Prisma Studio (GUI):
```bash
npm run db:studio
```
Opens http://localhost:5555 in your browser

Option B: Using psql:
```bash
psql -U postgres -d dawai
\dt  # List all tables
\q   # Quit
```

---

## 🌱 Seed Initial Data

The migration automatically seeds:
- ✅ Admin user (`admin@dawai.com` / password: `admin123`)
- ✅ 6 categories
- ✅ 4 delivery zones
- ✅ 2 sample medicines

---

## 🐛 Troubleshooting

### "Connection refused" error
- PostgreSQL not running?
  ```bash
  # Windows: Check Services or Task Manager
  # macOS: brew services start postgresql@15
  ```
- Wrong password? Check .env DATABASE_URL
- Wrong port? Default is 5432

### "Database does not exist" error
```bash
psql -U postgres -c "CREATE DATABASE dawai;"
```

### "Permission denied" error
- Ensure superuser password is correct in DATABASE_URL
- Try resetting PostgreSQL password:
  ```bash
  psql -U postgres  # If prompt for password, try 'password' or 'postgres'
  ALTER ROLE postgres WITH PASSWORD 'password';
  ```

### Start fresh (WARNING: Deletes all data)
```bash
npx prisma migrate reset
```

### Can't connect to cloud database?
- Verify connection string is correct
- Check firewall/IP whitelist in cloud service
- Try connecting via: `psql [connection-string]`

---

## Next Steps

Once database is set up:

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Access admin panel:
   ```
   http://localhost:3000/admin/login
   Email: admin@dawai.com
   Password: admin123
   ```

4. View database (optional):
   ```bash
   npm run db:studio
   ```

---

## 📝 Important Notes

- **Default Admin Password**: admin123 (Change in production!)
- **Database**: PostgreSQL 14+ required
- **Node.js**: v18+ required
- **Keep .env file safe**: Never commit to Git!

---

Done! Your database is ready for Phases 2-9. 🚀
