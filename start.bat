@echo off
echo ========================================
echo    NextChat - Starting Application
echo ========================================
echo.

:: Check if node_modules exists in backend
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo.
)

:: Check if node_modules exists in frontend
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo.
)

echo Starting NextChat...
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:5173
echo.
echo Press Ctrl+C to stop the servers
echo.

:: Start both servers
start "NextChat Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak > nul
start "NextChat Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo    NextChat is starting...
echo    Please wait for both servers to load
echo ========================================
echo.
echo Open your browser and go to:
echo http://localhost:5173
echo.

pause
