@echo off
echo Starting Rune Application...
echo.

echo Starting Backend Server...
start "Rune Backend" cmd /k "cd server && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Rune Frontend" cmd /k "cd client && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
