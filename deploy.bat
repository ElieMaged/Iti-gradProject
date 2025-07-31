@echo off
setlocal enabledelayedexpansion

REM Comprehensive Deployment Script for Windows
REM Supports multiple deployment platforms

echo 🚀 Starting deployment process...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ [ERROR] Node.js is not installed. Please install Node.js 18 or higher.
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2,3 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% LSS 18 (
    echo ❌ [ERROR] Node.js version 18 or higher is required. Current version: 
    node --version
    exit /b 1
)
echo ✅ [SUCCESS] Node.js version: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ [ERROR] npm is not installed.
    exit /b 1
)
echo ✅ [SUCCESS] npm version: 
npm --version

REM Install dependencies
echo 📦 [INFO] Installing dependencies...
call npm ci --production=false
if %errorlevel% neq 0 (
    echo ❌ [ERROR] Failed to install dependencies.
    exit /b 1
)
echo ✅ [SUCCESS] Dependencies installed successfully

REM Build the project
echo 🔨 [INFO] Building project for production...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ [ERROR] Build failed!
    exit /b 1
)
echo ✅ [SUCCESS] Build completed successfully!

REM Check if dist directory exists and has content
if not exist "dist" (
    echo ❌ [ERROR] Build output not found!
    exit /b 1
)
if not exist "dist\*" (
    echo ❌ [ERROR] Build output is empty!
    exit /b 1
)
echo ✅ [SUCCESS] Build output verified in dist/

REM Ask user which platform to deploy to
echo.
echo 📋 [INFO] Choose deployment platform:
echo 1) Firebase
echo 2) Netlify
echo 3) Vercel
echo 4) All platforms
echo 5) Build only (no deployment)
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto deploy_firebase
if "%choice%"=="2" goto deploy_netlify
if "%choice%"=="3" goto deploy_vercel
if "%choice%"=="4" goto deploy_all
if "%choice%"=="5" goto build_only
echo ❌ [ERROR] Invalid choice. Exiting.
exit /b 1

:deploy_firebase
echo 🌐 [INFO] Deploying to Firebase...
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ [WARNING] Firebase CLI not found. Install with: npm install -g firebase-tools
    goto :eof
)
call firebase deploy --only hosting
if %errorlevel% equ 0 (
    echo ✅ [SUCCESS] Firebase deployment completed!
) else (
    echo ❌ [ERROR] Firebase deployment failed!
)
goto :eof

:deploy_netlify
echo 🌐 [INFO] Deploying to Netlify...
netlify --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ [WARNING] Netlify CLI not found. Install with: npm install -g netlify-cli
    goto :eof
)
call netlify deploy --prod --dir=dist
if %errorlevel% equ 0 (
    echo ✅ [SUCCESS] Netlify deployment completed!
) else (
    echo ❌ [ERROR] Netlify deployment failed!
)
goto :eof

:deploy_vercel
echo 🌐 [INFO] Deploying to Vercel...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ [WARNING] Vercel CLI not found. Install with: npm install -g vercel
    goto :eof
)
call vercel --prod
if %errorlevel% equ 0 (
    echo ✅ [SUCCESS] Vercel deployment completed!
) else (
    echo ❌ [ERROR] Vercel deployment failed!
)
goto :eof

:deploy_all
echo 🌐 [INFO] Deploying to all platforms...
call :deploy_firebase
call :deploy_netlify
call :deploy_vercel
goto :eof

:build_only
echo ✅ [SUCCESS] Build completed. Manual deployment required.
goto :eof

:eof
echo 🎉 [SUCCESS] Deployment process completed!
pause 