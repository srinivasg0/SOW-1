# SOW Mini App

A full-stack mini application demonstrating FE, BE, and deployment skills.

## Project Structure

```
.
├── frontend/          # React + Vite frontend
├── backend/           # Node.js backend
├── database/          # Database schema and migrations
└── README.md
```

## Tech Stack

- **Frontend**: Vite.js + React.js, Vanilla CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Language**: JavaScript (not TypeScript)

## Features

1. **Login Page**: Responsive design, JWT authentication, multi-language (EN/SV)
2. **Terms Page**: Mobile portrait, multi-language (EN/SV)
3. **Pricelist Page**: Responsive design, editable fields, 20+ products

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

### Installation

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Set up database:
```bash
# Create database
createdb sow

# Run complete setup (schema + data)
psql -U postgres -d sow -f database/setup-complete.sql
```

4. Configure environment variables:
```bash
# Backend .env
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials and JWT_SECRET
```

5. Create user:
```bash
cd backend
node scripts/create-user.js admin password123
```

6. Start development servers:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Default Credentials

- Username: `admin`
- Password: `password123`

## API Endpoints

### Auth
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token

### Translations
- `GET /api/translations/:page/:language` - Get translations

### Products (Protected)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product

## Deployment

Deploy to Linux VM or Render.com

## Database Schema

See `database/setup-complete.sql` for full schema design and initial data.

