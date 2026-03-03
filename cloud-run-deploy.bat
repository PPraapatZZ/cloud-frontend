@echo off
REM CE Cloud Frontend - Google Cloud Run Deployment (Windows)
REM Usage: cloud-run-deploy.bat

setlocal enabledelayedexpansion

echo.
echo ===============================================
echo CE Cloud Frontend - Google Cloud Run Deploy
echo ===============================================
echo.

REM Check if gcloud is installed
where gcloud >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: gcloud CLI not found
    echo Please install it from: https://cloud.google.com/sdk/docs/install
    pause
    exit /b 1
)

REM Check authentication
gcloud auth list --filter=status:ACTIVE --format="value(account)" >nul 2>nul
if %errorlevel% neq 0 (
    echo Authenticating with Google Cloud...
    call gcloud auth login
)

REM Get project ID
for /f "tokens=*" %%i in ('gcloud config get-value project 2^>nul') do set PROJECT_ID=%%i

if "%PROJECT_ID%"=="" (
    echo Error: No GCP project configured
    echo Run: gcloud init
    pause
    exit /b 1
)

echo Project ID: %PROJECT_ID%
echo.

REM Select region
echo Select region:
echo 1) asia-southeast1 (Bangkok) - Recommended
echo 2) us-central1 (USA)
echo 3) europe-west1 (Europe)
set /p REGION_CHOICE="Enter choice (1-3): "

if "%REGION_CHOICE%"=="1" (
    set REGION=asia-southeast1
) else if "%REGION_CHOICE%"=="2" (
    set REGION=us-central1
) else if "%REGION_CHOICE%"=="3" (
    set REGION=europe-west1
) else (
    echo Invalid choice, using asia-southeast1
    set REGION=asia-southeast1
)

echo Region: %REGION%
echo.

REM Enable APIs
echo Enabling required APIs...
call gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com --project=%PROJECT_ID%
echo APIs enabled
echo.

REM Service configuration
set SERVICE_NAME=ce-cloud-frontend
set IMAGE_NAME=gcr.io/%PROJECT_ID%/%SERVICE_NAME%

echo Building and deploying...
echo Service: %SERVICE_NAME%
echo Region: %REGION%
echo Image: %IMAGE_NAME%
echo.

REM Deploy to Cloud Run
call gcloud run deploy %SERVICE_NAME% ^
    --source . ^
    --platform managed ^
    --region %REGION% ^
    --allow-unauthenticated ^
    --memory 512Mi ^
    --cpu 1 ^
    --timeout 3600 ^
    --project=%PROJECT_ID% ^
    --set-env-vars="NODE_ENV=production"

REM Get service URL
echo.
echo Getting service URL...
for /f "tokens=*" %%i in ('gcloud run services describe %SERVICE_NAME% --region=%REGION% --format="value(status.url)" --project=%PROJECT_ID% 2^>nul') do set SERVICE_URL=%%i

echo.
echo ===============================================
echo Deployment successful!
echo ===============================================
echo.
echo Service URL: %SERVICE_URL%
echo.
echo Next steps:
echo 1. Open: %SERVICE_URL%
echo 2. Test the application
echo 3. When backend is ready, update API endpoint:
echo.
echo    gcloud run services update %SERVICE_NAME% ^
echo        --region=%REGION% ^
echo        --update-env-vars VITE_API_URL=https://your-backend-api.com
echo.
echo For more info, see: DEPLOYMENT.md
echo.
pause
