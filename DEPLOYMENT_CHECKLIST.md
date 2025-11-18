# Render Deployment Checklist

Use this checklist to ensure you don't miss any steps during deployment.

## Pre-Deployment

- [ ] Code is pushed to GitHub/GitLab/Bitbucket
- [ ] Render account created
- [ ] GitHub account connected to Render

## Database Setup

- [ ] PostgreSQL database created on Render
- [ ] Database schema imported (run `setup-complete.sql`)
- [ ] Internal Database URL copied
- [ ] Database credentials noted

## Backend Deployment

- [ ] Web Service created
- [ ] Repository connected
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Environment variables set:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `DB_HOST` (from database)
  - [ ] `DB_PORT=5432`
  - [ ] `DB_NAME=sow`
  - [ ] `DB_USER` (from database)
  - [ ] `DB_PASSWORD` (from database)
  - [ ] `JWT_SECRET` (generated)
  - [ ] `FRONTEND_URL` (set after frontend is deployed)
- [ ] Backend deployed successfully
- [ ] Backend URL noted
- [ ] Health check works: `https://your-backend.onrender.com/api/health`

## Admin User Creation

- [ ] Admin user created using `scripts/create-user.js`
- [ ] Credentials saved securely

## Frontend Deployment

- [ ] Static Site created
- [ ] Repository connected
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `dist`
- [ ] Environment variable set:
  - [ ] `VITE_API_URL=https://your-backend.onrender.com/api`
- [ ] Frontend deployed successfully
- [ ] Frontend URL noted

## Post-Deployment

- [ ] Backend `FRONTEND_URL` updated with frontend URL
- [ ] Frontend tested:
  - [ ] Login page loads
  - [ ] Can log in with admin credentials
  - [ ] Pricelist page works
  - [ ] Terms page works
  - [ ] Translations work (EN/SV)
- [ ] CORS working (no errors in browser console)
- [ ] All API endpoints responding

## Optional

- [ ] Custom domain configured (if needed)
- [ ] Monitoring/alerts set up
- [ ] Database backups configured (if on paid plan)

---

**Quick Test URLs:**
- Backend Health: `https://your-backend.onrender.com/api/health`
- Frontend: `https://your-frontend.onrender.com`
- Login: Use admin credentials you created

