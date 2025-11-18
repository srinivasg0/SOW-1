@echo off
echo ========================================
echo Database Setup for Render
echo ========================================
echo.
echo Paste your External Database URL from Render when prompted.
echo It should look like: postgresql://sow_user:password@host:port/dbname
echo.
set /p DB_URL="Enter External Database URL: "
echo.
echo Running database setup script...
psql "%DB_URL%" -f database\setup-complete.sql
echo.
echo Database setup complete!
pause

