@echo off
echo ========================================
echo Render Database Setup
echo ========================================
echo.
echo Step 1: Setting up database schema...
echo.
set /p DB_URL="Paste your External Database URL from Render: "
echo.
echo Running database setup...
psql "%DB_URL%" -f database\setup-complete.sql
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Database setup failed!
    echo Make sure you copied the FULL External Database URL from Render.
    pause
    exit /b 1
)
echo.
echo ========================================
echo Database setup complete!
echo ========================================
echo.
echo Step 2: Creating admin user...
echo.
set /p USERNAME="Enter username (default: admin): "
if "%USERNAME%"=="" set USERNAME=admin
set /p PASSWORD="Enter password (default: password123): "
if "%PASSWORD%"=="" set PASSWORD=password123
echo.
echo Creating user...
set NODE_PATH=backend\node_modules
node create-admin-user.js "%DB_URL%" "%USERNAME%" "%PASSWORD%"
echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo Your credentials:
echo Username: %USERNAME%
echo Password: %PASSWORD%
echo.
pause

