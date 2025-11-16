# Deployment Guide

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

## Deployment Steps

### 1. Database Setup

The application uses PostgreSQL. You can deploy PostgreSQL in several ways:

#### Option A: Managed PostgreSQL (Recommended)
- **Render.com**: Use their managed PostgreSQL service
- **Heroku**: Use Heroku Postgres addon
- **AWS RDS**: Use Amazon RDS for PostgreSQL
- **DigitalOcean**: Use Managed Databases

#### Option B: Self-Hosted PostgreSQL
- Install PostgreSQL on your server
- Create database and user
- Configure firewall rules

### 2. Database Initialization

Once PostgreSQL is set up, run the setup script:

```bash
# Create database
createdb -U postgres lettfaktura_sop

# Or if using a different user:
psql -U your_user -c "CREATE DATABASE lettfaktura_sop;"

# Run complete setup (creates tables, indexes, and populates with initial data)
psql -U postgres -d lettfaktura_sop -f database/setup-complete.sql
```

**Note**: The `setup-complete.sql` file contains:
- All table schemas (users, translations, products)
- Indexes for performance
- Initial translations (Swedish and English)
- Sample products (25 items)

### 3. Backend Deployment

#### Environment Variables

Create a `.env` file in the `backend` directory:

```env
DB_HOST=your_postgres_host
DB_PORT=5432
DB_NAME=lettfaktura_sop
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRES_IN=24h
PORT=3001
NODE_ENV=production
```

#### Deploy Backend

**Option A: Render.com**
1. Connect your Git repository
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add environment variables in Render dashboard

**Option B: Linux VM**
```bash
cd backend
npm install --production
npm start
```

**Option C: PM2 (Process Manager)**
```bash
npm install -g pm2
cd backend
pm2 start server.js --name lettfaktura-backend
pm2 save
pm2 startup
```

### 4. Frontend Deployment

#### Build Frontend

```bash
cd frontend
npm install
npm run build
```

This creates a `dist` folder with production-ready files.

#### Deploy Frontend

**Option A: Static Hosting (Vercel, Netlify, etc.)**
1. Connect your Git repository
2. Set build command: `cd frontend && npm install && npm run build`
3. Set publish directory: `frontend/dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url.com`

**Option B: Serve with Backend**
- Copy `frontend/dist` contents to backend `public` folder
- Express will serve static files

**Option C: Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Create Initial User

After deployment, create the first user:

```bash
cd backend
node scripts/create-user.js admin password123
```

**Important**: Change the default password after first login!

### 6. Update Frontend API URL

If your backend is on a different domain, update the API URL:

**Option A: Environment Variable**
Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-url.com
```

**Option B: Update `frontend/src/api/client.js`**
Change the base URL to your production backend URL.

### 7. SSL/HTTPS Setup

For production, use HTTPS:

- **Let's Encrypt**: Free SSL certificates
- **Cloudflare**: Free SSL with CDN
- **Managed hosting**: Most platforms provide SSL automatically

## Deployment Checklist

- [ ] PostgreSQL database created and accessible
- [ ] Database schema initialized (`setup-complete.sql` run)
- [ ] Backend environment variables configured
- [ ] Backend deployed and running
- [ ] Frontend built (`npm run build`)
- [ ] Frontend deployed
- [ ] API URL updated in frontend
- [ ] Initial user created
- [ ] SSL/HTTPS configured
- [ ] Firewall rules configured (if self-hosting)
- [ ] Domain name configured (if using custom domain)
- [ ] Monitoring/logging set up

## Troubleshooting

**Database Connection Issues**
- Verify DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- Check firewall rules allow PostgreSQL port (5432)
- Verify database exists and user has permissions

**Backend Not Starting**
- Check Node.js version (v18+)
- Verify all environment variables are set
- Check logs for specific error messages

**Frontend API Errors**
- Verify VITE_API_URL is correct
- Check CORS settings in backend
- Verify backend is accessible from frontend domain

## Production Best Practices

1. **Security**
   - Use strong JWT_SECRET (32+ characters, random)
   - Change default admin password
   - Enable HTTPS only
   - Set secure cookie flags
   - Implement rate limiting

2. **Performance**
   - Enable database connection pooling
   - Use CDN for static assets
   - Enable gzip compression
   - Set up caching headers

3. **Monitoring**
   - Set up error logging (e.g., Sentry)
   - Monitor database performance
   - Set up uptime monitoring
   - Configure backup strategy

4. **Backups**
   - Regular database backups
   - Store backups off-site
   - Test restore procedures

