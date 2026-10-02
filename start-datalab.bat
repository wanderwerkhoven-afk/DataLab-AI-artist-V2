@echo off
setlocal
cd /d "%~dp0"
title DataLab AI Artist V2

echo ========================================
echo   DataLab AI Artist V2 - Local launcher
echo ========================================

where python >nul 2>nul || (echo Python not found. Install Python 3.11 first.& pause & exit /b 1)
where npm >nul 2>nul || (echo Node.js/npm not found. Install Node.js first.& pause & exit /b 1)

if not exist "web\\node_modules" (
  echo Installing frontend dependencies...
  pushd web
  call npm install || (popd & pause & exit /b 1)
  popd
)

echo Starting AI backend on http://127.0.0.1:5000 ...
start "DataLab AI Backend" cmd /k "cd /d %~dp0src && python run.py"

echo Starting web app on http://localhost:3000 ...
start "DataLab Web" cmd /k "cd /d %~dp0web && npm run dev"

echo Waiting for services...
timeout /t 8 /nobreak >nul
start "" "http://localhost:3000"

echo DataLab AI Artist started.
exit /b 0
