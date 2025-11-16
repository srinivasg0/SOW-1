# Step-by-Step Setup Instructions

## Step 1: Install PostgreSQL (if not already installed)
- Download from: https://www.postgresql.org/download/windows/
- During installation, remember the password you set for the `postgres` user
- Make sure PostgreSQL service is running

## Step 2: Create Database

Open a new terminal/command prompt and run:

```bash
# Create the database
createdb sow

# Or if that doesn't work, use psql:
psql -U postgres
# Then in psql prompt:
CREATE DATABASE sow;
\q
```

## Step 3: Run Database Setup

```bash
# Run complete setup (creates tables, indexes, and populates with initial data)
psql -U postgres -d sow -f database/setup-complete.sql
```

## Step 4: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 5: Configure Backend Environment

1. Copy the example env file:
   - In Windows: Copy `backend\.env.example` to `backend\.env`
   - Or create `backend\.env` manually

2. Edit `backend\.env` with your database info:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sow
   DB_USER=postgres
   DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long_change_this
   JWT_EXPIRES_IN=24h
   PORT=3001
   NODE_ENV=development
   ```

## Step 6: Create User Account

```bash
cd backend
node scripts/create-user.js admin password123
```

This creates a user with:
- Username: `admin`
- Password: `password123`

## Step 7: Install Frontend Dependencies

```bash
cd frontend
npm install
```

## Step 8: Start the Application

You need TWO terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
You should see: "Server running on port 3001"

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
You should see: "Local: http://localhost:3000"

## Step 9: Test the Application

1. Open browser: http://localhost:3000
2. You should see the login page
3. Login with:
   - Username: `admin`
   - Password: `password123`
4. After login, you'll be redirected to the pricelist
5. Test editing fields - they should auto-save after 1 second

## Troubleshooting

**Database connection error:**
- Check PostgreSQL is running
- Verify DB_PASSWORD in `.env` matches your PostgreSQL password
- Check DB_HOST and DB_PORT are correct

**Port already in use:**
- Change PORT in `backend/.env` to a different number (e.g., 3002)
- Update `frontend/vite.config.js` proxy target to match

**Module not found:**
- Make sure you ran `npm install` in both backend and frontend folders
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

