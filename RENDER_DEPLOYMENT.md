# Step-by-Step Guide: Deploying to Render

This guide will walk you through deploying your full-stack application (Backend + Frontend + Database) to Render.

## Prerequisites

1. A GitHub account (or GitLab/Bitbucket)
2. Your code pushed to a Git repository
3. A Render account (sign up at https://render.com)

---

## 🚀 Quick Start: Using Render Blueprint (Recommended)

If you want to deploy everything at once, you can use the `render.yaml` file included in this project:

1. **Push your code to GitHub** (see Step 1 below)

2. **In Render Dashboard**:
   - Click **"New +"** → Select **"Blueprint"**
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`
   - Review the services (Database, Backend, Frontend)
   - Click **"Apply"**

3. **After deployment**:
   - Note your backend URL (e.g., `https://lettfaktura-backend.onrender.com`)
   - Update frontend environment variable `VITE_API_URL` with your backend URL
   - Update backend environment variable `FRONTEND_URL` with your frontend URL
   - Set up database schema (see Step 2, section 6)
   - Create admin user (see Step 4)

4. **Done!** Your app should be live.

**OR** follow the manual steps below for more control.

---

## Step 1: Push Your Code to GitHub

1. Initialize git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub

3. Push your code:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Create PostgreSQL Database on Render

1. Log in to [Render Dashboard](https://dashboard.render.com)

2. Click **"New +"** button → Select **"PostgreSQL"**

3. Configure the database:
   - **Name**: `lettfaktura-db` (or your preferred name)
   - **Database**: `sow` (or leave default)
   - **User**: Leave default (will be auto-generated)
   - **Region**: Frankfurt (Germany) - closest to Sweden, or choose closest to your users
   - **PostgreSQL Version**: 14 or higher
   - **Plan**: Free tier (or paid if needed)

4. Click **"Create Database"**

5. **IMPORTANT**: Wait for the database to be created, then:
   - Click on your database
   - Go to **"Connections"** tab
   - Copy the **"Internal Database URL"** (you'll need this for backend)
   - Also note the **"External Database URL"** (for local setup if needed)

6. **Set up the database schema**:
   - Go to **"Connect"** tab
   - Use the **"psql"** command or **"pgAdmin"** connection details
   - Run your database setup script:
     ```sql
     -- Copy and paste the contents of database/setup-complete.sql
     -- Or use psql command line:
     psql <your-external-database-url> < database/setup-complete.sql
     ```

---

## Step 3: Deploy Backend (Web Service)

1. In Render Dashboard, click **"New +"** → Select **"Web Service"**

2. Connect your GitHub repository:
   - Click **"Connect account"** if not already connected
   - Select your repository
   - Click **"Connect"**

3. Configure the backend service:
   - **Name**: `lettfaktura-backend` (or your preferred name)
   - **Region**: Frankfurt (same as your database) - closest to Sweden
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier (or paid if needed)

4. **Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=<from-database-internal-url>
   DB_PORT=5432
   DB_NAME=sow
   DB_USER=<from-database-internal-url>
   DB_PASSWORD=<from-database-internal-url>
   JWT_SECRET=<generate-a-random-secret-string>
   FRONTEND_URL=https://lettfaktura-frontend.onrender.com
   ```
   ⚠️ **Note**: You'll need to add `FRONTEND_URL` after you create the frontend service, or update it later.
   
   **How to get database values:**
   - Go to your PostgreSQL database on Render
   - Copy the **Internal Database URL** (format: `postgresql://user:password@host:port/dbname`)
   - Extract values from the URL:
     - `DB_HOST`: The hostname part
     - `DB_PORT`: Usually `5432`
     - `DB_NAME`: The database name (usually `sow` or last part of URL)
     - `DB_USER`: The username part
     - `DB_PASSWORD`: The password part
   
   **Generate JWT_SECRET:**
   ```bash
   # Run this in terminal to generate a secure random string:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. Click **"Create Web Service"**

6. Wait for deployment to complete (usually 2-5 minutes)

7. **Note the backend URL**: It will be something like `https://lettfaktura-backend.onrender.com`
   - Copy this URL - you'll need it for the frontend

---

## Step 4: Create Initial Admin User

After backend is deployed, you need to create an admin user:

1. Go to your backend service on Render
2. Click on **"Shell"** tab (or use **"Logs"** to see output)
3. Run the create-user script:
   ```bash
   cd backend
   node scripts/create-user.js admin password123
   ```
   
   **OR** use Render's Shell feature:
   - Click **"Shell"** button in your backend service
   - Navigate to backend directory
   - Run: `node scripts/create-user.js admin <your-password>`

---

## Step 5: Deploy Frontend (Static Site)

1. In Render Dashboard, click **"New +"** → Select **"Static Site"**

2. Connect your GitHub repository (same one as backend)

3. Configure the frontend:
   - **Name**: `lettfaktura-frontend` (or your preferred name)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` (Vite's default output)

4. **Environment Variables** (click "Add Environment Variable"):
   ```
   VITE_API_URL=https://lettfaktura-backend.onrender.com/api
   ```
   ⚠️ **Replace** `lettfaktura-backend.onrender.com` with your actual backend URL from Step 3

5. **IMPORTANT - Configure SPA Routing** (to fix "Not Found" errors on routes):
   - After creating the service, go to your frontend service settings
   - Scroll down to **"Redirects/Rewrites"** section
   - Click **"Add Redirect"**
   - Configure:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: `Rewrite` (or `Redirect` with status `200`)
   - Click **"Save"**
   
   ⚠️ **This is critical** - Without this, direct access to routes like `/login` will show "Not Found" errors.

6. Click **"Create Static Site"**

7. Wait for deployment to complete

8. **Note the frontend URL**: It will be something like `https://lettfaktura-frontend.onrender.com`

---

## Step 6: Update CORS Settings (If Needed)

The backend is already configured to use the `FRONTEND_URL` environment variable for CORS. If you encounter CORS errors:

1. Go to your backend service on Render
2. Add or update the `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://lettfaktura-frontend.onrender.com
   ```
3. Save and wait for the service to restart

---

## Step 7: Test Your Deployment

1. Visit your frontend URL: `https://lettfaktura-frontend.onrender.com`
2. Try logging in with:
   - Username: `admin`
   - Password: `password123` (or the password you set)
3. Test all features (login, pricelist, terms page)

---

## Troubleshooting

### Backend won't start
- Check **Logs** tab in Render dashboard
- Verify all environment variables are set correctly
- Ensure database connection string is correct (use Internal URL)

### Database connection errors
- Make sure you're using the **Internal Database URL** (not External)
- Verify database schema is set up correctly
- Check that database is in the same region as backend

### Frontend can't connect to backend
- Verify `VITE_API_URL` environment variable is set correctly
- Check backend URL is accessible (visit it in browser)
- Ensure CORS is configured properly

### "Not Found" errors on routes (e.g., `/login`, `/pricelist`)
- **This is a common SPA routing issue**
- Go to your frontend service in Render Dashboard
- Navigate to **Settings** → **Redirects/Rewrites**
- Add a redirect rule:
  - **Source**: `/*`
  - **Destination**: `/index.html`
  - **Action**: `Rewrite` (or `Redirect` with status `200`)
- Save and wait for redeployment
- The `_redirects` file in `frontend/public/` should also help, but Render dashboard configuration is more reliable

### 502 Bad Gateway
- Check backend logs for errors
- Verify backend is running (check health endpoint: `https://your-backend.onrender.com/api/health`)
- Free tier services spin down after 15 minutes of inactivity - first request may take longer

---

## Important Notes

1. **Free Tier Limitations**:
   - Services spin down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds
   - Database has limited storage (1 GB on free tier)

2. **Auto-Deploy**:
   - Render automatically deploys on every push to your main branch
   - You can disable this in service settings

3. **Environment Variables**:
   - Never commit `.env` files to Git
   - Always set sensitive values in Render dashboard

4. **Database Backups**:
   - Free tier doesn't include automatic backups
   - Consider upgrading for production use

---

## Quick Reference: Environment Variables

### Backend (.env equivalent in Render)
```
NODE_ENV=production
PORT=10000
DB_HOST=<from-internal-db-url>
DB_PORT=5432
DB_NAME=sow
DB_USER=<from-internal-db-url>
DB_PASSWORD=<from-internal-db-url>
JWT_SECRET=<your-random-secret>
FRONTEND_URL=https://lettfaktura-frontend.onrender.com
```

### Frontend (in Render)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Next Steps

- Set up custom domains (if needed)
- Configure SSL certificates (automatically handled by Render)
- Set up monitoring and alerts
- Consider upgrading to paid plans for better performance

---

**Need Help?** Check Render's documentation: https://render.com/docs

