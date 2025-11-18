# Quick Setup Guide for Render (No Shell Access)

Since Render's free tier doesn't support shell access, follow these steps to set up your database and create an admin user locally.

## Step 1: Get Your External Database URL

1. Go to your Render Dashboard
2. Click on your database: `lettfaktura-db`
3. Go to the **"Connect"** tab
4. Click on **"External"** tab
5. **Copy the External Database URL** (click the copy icon)
   - It looks like: `postgresql://sow_user:password@host:port/dbname`

## Step 2: Set Up Database Schema

**Option A: Using the batch script (Windows)**
```bash
# Double-click setup-render-db.bat
# Or run in terminal:
setup-render-db.bat
```

**Option B: Using psql directly**
```bash
# Replace <YOUR_EXTERNAL_DB_URL> with the URL you copied
psql "<YOUR_EXTERNAL_DB_URL>" -f database/setup-complete.sql
```

**Option C: Using pgAdmin**
1. Open pgAdmin
2. Right-click "Servers" → "Create" → "Server"
3. In "Connection" tab, enter details from your External Database URL:
   - Host: from URL
   - Port: from URL (usually 5432)
   - Database: from URL
   - Username: `sow_user`
   - Password: from URL
4. Connect, then right-click database → "Query Tool"
5. Open `database/setup-complete.sql` and run it

## Step 3: Create Admin User

After the database is set up, create an admin user:

**Option A: Using the batch script (Windows)**
```bash
# If you used setup-render-db.bat, it will prompt you for username/password
# Or run separately:
cd backend
node ../create-admin-user.js "<YOUR_EXTERNAL_DB_URL>" admin password123
```

**Option B: Using SQL directly**
```bash
# Connect to database and run:
psql "<YOUR_EXTERNAL_DB_URL>"
```

Then in psql, run this SQL (replace `your_password` with your desired password):
```sql
-- First, you need to hash the password. Use this Node.js one-liner:
-- node -e "const bcrypt=require('bcryptjs');bcrypt.hash('your_password',10).then(h=>console.log(h))"
-- Then insert the hashed password:

INSERT INTO users (username, password_hash) 
VALUES ('admin', '<hashed_password_from_above>')
ON CONFLICT (username) 
DO UPDATE SET password_hash = EXCLUDED.password_hash;
```

**Easier: Use the Node.js script**
```bash
cd backend
node ../create-admin-user.js "<YOUR_EXTERNAL_DB_URL>" admin your_password
```

## Step 4: Configure Environment Variables in Render

### Frontend Environment Variables:
1. Go to `lettfaktura-frontend` service
2. Go to **Environment** tab
3. Add:
   ```
   VITE_API_URL=https://lettfaktura-backend.onrender.com/api
   ```
   (Replace with your actual backend URL)

### Backend Environment Variables:
1. Go to `lettfaktura-backend` service  
2. Go to **Environment** tab
3. Add:
   ```
   FRONTEND_URL=https://lettfaktura-frontend.onrender.com
   ```
   (Replace with your actual frontend URL)

## Step 5: Configure SPA Routing (Fix "Not Found" Errors)

1. Go to `lettfaktura-frontend` service
2. Go to **Settings**
3. Find **"Redirects/Rewrites"** section
4. Click **"Add Redirect"**:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite` (or `Redirect` with status `200`)
5. Save

## Step 6: Test Your Application

- Frontend: `https://lettfaktura-frontend.onrender.com`
- Backend Health: `https://lettfaktura-backend.onrender.com/api/health`
- Login with your admin credentials

---

## Troubleshooting

**Database connection errors:**
- Make sure you're using the **External Database URL** (not Internal)
- The URL should include the full connection string with password

**Can't create user:**
- Make sure database schema is set up first (Step 2)
- Check that `users` table exists
- Verify you're using the correct External Database URL

**"Not Found" on routes:**
- Make sure you configured redirects/rewrites (Step 5)
- This is critical for React Router to work

