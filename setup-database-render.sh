#!/bin/bash
echo "========================================"
echo "Database Setup for Render"
echo "========================================"
echo ""
echo "Paste your External Database URL from Render when prompted."
echo "It should look like: postgresql://sow_user:password@host:port/dbname"
echo ""
read -p "Enter External Database URL: " DB_URL
echo ""
echo "Running database setup script..."
psql "$DB_URL" -f database/setup-complete.sql
echo ""
echo "Database setup complete!"

