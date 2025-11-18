@echo off
echo ========================================
echo Render Database Setup (Simple)
echo ========================================
echo.
echo Step 1: Copy your External Database URL from Render
echo (Go to lettfaktura-db -> Connect -> External tab)
echo.
set /p DB_URL="Paste External Database URL here: "
echo.
echo Step 2: Setting up database schema...
psql "%DB_URL%" -f database\setup-complete.sql
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Database setup failed!
    pause
    exit /b 1
)
echo.
echo Database schema setup complete!
echo.
echo Step 3: Creating admin user...
echo.
set /p USERNAME="Enter username (default: admin): "
if "%USERNAME%"=="" set USERNAME=admin
set /p PASSWORD="Enter password (default: password123): "
if "%PASSWORD%"=="" set PASSWORD=password123
echo.
echo Creating user "%USERNAME%"...
set NODE_PATH=backend\node_modules
node create-admin-user.js "%DB_URL%" "%USERNAME%" "%PASSWORD%"
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo Username: %USERNAME%
echo Password: %PASSWORD%
echo.
pause

