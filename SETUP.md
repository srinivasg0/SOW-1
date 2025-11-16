# Setup Guide

## Quick Start

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb sow

# Run complete setup (creates tables, indexes, and populates with initial data)
psql -U postgres -d sow -f database/setup-complete.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Edit .env with your database credentials:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=sow
# DB_USER=postgres
# DB_PASSWORD=your_password
# JWT_SECRET=your_super_secret_jwt_key_min_32_chars
# PORT=3001

# Create user (username: admin, password: password123)
node scripts/create-user.js admin password123

# Start backend server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

### 4. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Login: admin / password123

## Features Implemented

✅ **Login Page**
- Responsive design (mobile, tablet, desktop)
- Hamburger menu (mobile)
- Multi-language (Swedish/English) from database
- JWT authentication
- Background image, logo, flags from provided URLs
- Password visibility toggle

✅ **Terms Page**
- Mobile portrait optimized
- Multi-language support
- Placeholder text (ready for actual content)

✅ **Pricelist Page**
- Responsive with different columns per breakpoint:
  - Desktop: All 7 columns
  - Tablet/Landscape: 5 columns (Article No, Product/Service, Price, Unit, In Stock)
  - Mobile Portrait: 2 columns (Product/Service, Price)
- 25 products (more than required 20)
- Editable fields with auto-save to database
- Search functionality
- Action buttons (New Product, Print, Advanced)

## Database Schema

- **users**: Authentication (username, password_hash)
- **translations**: Multi-language content (key, language, value, page)
- **products**: Pricelist data (article_no, name, description, in_price, price, unit, in_stock, vat_rate, account)

## API Endpoints

### Public
- `POST /api/auth/login` - Login
- `GET /api/translations/:page/:language` - Get translations

### Protected (require JWT token)
- `GET /api/products` - Get all products
- `PUT /api/products/:id` - Update product

## Tech Stack

- **Frontend**: React 18.2.0, Vite 5.0.8, React Router 6.20.0, Axios 1.6.2
- **Backend**: Node.js, Express 4.18.2, PostgreSQL (pg 8.11.3)
- **Auth**: JWT (jsonwebtoken 9.0.2), bcryptjs 2.4.3
- **Styling**: Vanilla CSS
- **Language**: JavaScript (ES6 modules)

## Next Steps for Deployment

1. Set up GitLab repository
2. Configure production environment variables
3. Deploy to Linux VM or Render.com
4. Update API URLs in frontend
5. Build frontend: `npm run build`
6. Set up reverse proxy (nginx) if needed

