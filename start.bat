@echo off
REM Windows batch script to start Next.js and open browser
REM Usage: Double-click start.bat or run from command line: start.bat

echo.
echo ========================================
echo   AI Movie Recommendation System
echo   Starting Development Server...
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Node modules not found. Installing dependencies...
    call npm install
    echo.
)

REM Start the dev server and open browser
echo Starting Next.js development server...
echo This will open your browser automatically.
echo.
echo Press Ctrl+C to stop the server.
echo.

REM Use Node.js script for cross-platform browser opening
node scripts/start.js

REM If Node.js script fails, fallback to manual start
if errorlevel 1 (
    echo.
    echo Starting dev server manually...
    start /b npm run dev
    timeout /t 5 /nobreak >nul
    start http://localhost:3000
    echo.
    echo Browser opened. Server is running.
    echo Press Ctrl+C in this window to stop the server.
    pause
)

