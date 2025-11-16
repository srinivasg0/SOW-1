@echo off
echo Setting up SOW Database...
echo.

REM Try to find PostgreSQL installation
set PG_PATH=
if exist "C:\Program Files\PostgreSQL\18\bin\psql.exe" set PG_PATH=C:\Program Files\PostgreSQL\18\bin
if exist "C:\Program Files\PostgreSQL\17\bin\psql.exe" set PG_PATH=C:\Program Files\PostgreSQL\17\bin
if exist "C:\Program Files\PostgreSQL\16\bin\psql.exe" set PG_PATH=C:\Program Files\PostgreSQL\16\bin
if exist "C:\Program Files\PostgreSQL\15\bin\psql.exe" set PG_PATH=C:\Program Files\PostgreSQL\15\bin
if exist "C:\Program Files\PostgreSQL\14\bin\psql.exe" set PG_PATH=C:\Program Files\PostgreSQL\14\bin
if exist "C:\Program Files\PostgreSQL\13\bin\psql.exe" set PG_PATH=C:\Program Files\PostgreSQL\13\bin

if "%PG_PATH%"=="" (
    echo ERROR: PostgreSQL not found in default locations.
    echo Please run these commands manually with full path to psql.exe
    echo.
    pause
    exit /b 1
)

echo Found PostgreSQL at: %PG_PATH%
echo.

echo Step 1: Creating database...
"%PG_PATH%\psql.exe" -U postgres -c "CREATE DATABASE sow;" 2>nul
if errorlevel 1 (
    echo Database might already exist, continuing...
) else (
    echo Database created successfully!
)
echo.

echo Step 2: Setting up database schema and data...
"%PG_PATH%\psql.exe" -U postgres -d sow -f database\setup-complete.sql
if errorlevel 1 (
    echo ERROR setting up database. Check your PostgreSQL password.
    pause
    exit /b 1
)
echo Database setup complete!
echo.

echo Step 3: Creating user account...
cd backend
node scripts\create-user.js admin password123
cd ..

echo.
echo ========================================
echo Database setup complete!
echo.
echo Default login credentials:
echo Username: admin
echo Password: password123
echo ========================================
echo.
pause

