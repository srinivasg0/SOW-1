#!/bin/bash

echo "Setting up SOW Database..."
echo ""

# Try to find PostgreSQL
PG_PATH=""
for version in 16 15 14 13; do
    if [ -f "/c/Program Files/PostgreSQL/$version/bin/psql.exe" ]; then
        PG_PATH="/c/Program Files/PostgreSQL/$version/bin"
        break
    fi
done

if [ -z "$PG_PATH" ]; then
    echo "ERROR: PostgreSQL not found in default locations."
    echo "Please run these commands manually:"
    echo "  createdb -U postgres sow"
    echo "  psql -U postgres -d sow -f database/setup-complete.sql"
    exit 1
fi

echo "Found PostgreSQL at: $PG_PATH"
echo ""

echo "Step 1: Creating database..."
"$PG_PATH/psql.exe" -U postgres -c "CREATE DATABASE sow;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "Database created successfully!"
else
    echo "Database might already exist, continuing..."
fi
echo ""

echo "Step 2: Setting up database schema and data..."
"$PG_PATH/psql.exe" -U postgres -d sow -f database/setup-complete.sql
if [ $? -ne 0 ]; then
    echo "ERROR setting up database. Check your PostgreSQL password."
    exit 1
fi
echo "Database setup complete!"
echo ""

echo "Step 3: Creating user account..."
cd backend
node scripts/create-user.js admin password123
cd ..

echo ""
echo "========================================"
echo "Database setup complete!"
echo ""
echo "Default login credentials:"
echo "Username: admin"
echo "Password: password123"
echo "========================================"

