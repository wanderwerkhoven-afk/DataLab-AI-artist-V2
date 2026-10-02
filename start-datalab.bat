@echo off
setlocal
cd /d "%~dp0"
title DataLab AI Artist V2

echo ========================================
echo   DataLab AI Artist V2 - Local launcher
echo ========================================

where py >nul 2>nul || (echo Python launcher not found. Install Python 3.11 first.& pause & exit /b 1)
py -3.11 --version >nul 2>nul || (echo Python 3.11 is required. Install Python 3.11 and try again.& pause & exit /b 1)
where npm >nul 2>nul || (echo Node.js/npm not found. Install Node.js first.& pause & exit /b 1)
where cl >nul 2>nul || (
  echo Microsoft C++ Build Tools are required by InsightFace.
  echo Install "Desktop development with C++" in Visual Studio Build Tools,
  echo then run this launcher again.
  start "" "https://visualstudio.microsoft.com/visual-cpp-build-tools/"
  pause
  exit /b 1
)

if not exist ".venv\\Scripts\\python.exe" (
  echo Creating Python 3.11 virtual environment...
  py -3.11 -m venv .venv || (pause & exit /b 1)
)

if not exist ".venv\\.datalab-installed" (
  echo Installing AI dependencies. This can take several minutes...
  ".venv\\Scripts\\python.exe" -m pip install --upgrade pip setuptools wheel || (pause & exit /b 1)
  ".venv\\Scripts\\python.exe" -m pip install -r src\\requirements.txt || (pause & exit /b 1)
  type nul > ".venv\\.datalab-installed"
)

if not exist "src\\models\\sd15\\ip-adapter-faceid-plusv2_sd15.bin" (
  echo Downloading AI models...
  pushd src
  "..\\.venv\\Scripts\\python.exe" download.py || (popd & pause & exit /b 1)
  popd
)

if not exist "web\\node_modules" (
  echo Installing frontend dependencies...
  pushd web
  call npm install || (popd & pause & exit /b 1)
  popd
)

echo Starting AI backend on http://127.0.0.1:5000 ...
start "DataLab AI Backend" cmd /k "cd /d %~dp0src && ..\\.venv\\Scripts\\python.exe run.py"

echo Starting web app on http://localhost:3000 ...
start "DataLab Web" cmd /k "cd /d %~dp0web && npm run dev"

timeout /t 8 /nobreak >nul
start "" "http://localhost:3000"
exit /b 0
