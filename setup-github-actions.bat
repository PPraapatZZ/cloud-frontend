@echo off
REM Quick setup script for GitHub Actions deployment (Windows)
REM Usage: setup-github-actions.bat YOUR_PROJECT_ID YOUR_GITHUB_USERNAME

setlocal enabledelayedexpansion

set PROJECT_ID=%1
set GITHUB_USERNAME=%2

if "%PROJECT_ID%"=="" (
    echo Usage: setup-github-actions.bat YOUR_GCP_PROJECT_ID YOUR_GITHUB_USERNAME
    pause
    exit /b 1
)

echo.
echo =====================================
echo GitHub Actions + Cloud Run Setup
echo =====================================
echo.
echo Project ID: %PROJECT_ID%
echo GitHub User: %GITHUB_USERNAME%
echo.

REM Create service account
echo Creating service account...
gcloud iam service-accounts create github-actions ^
  --display-name="GitHub Actions" ^
  --project=%PROJECT_ID% 2>nul

REM Grant roles
echo Granting permissions...
gcloud projects add-iam-policy-binding %PROJECT_ID% ^
  --member=serviceAccount:github-actions@%PROJECT_ID%.iam.gserviceaccount.com ^
  --role=roles/run.admin ^
  --quiet 2>nul

gcloud projects add-iam-policy-binding %PROJECT_ID% ^
  --member=serviceAccount:github-actions@%PROJECT_ID%.iam.gserviceaccount.com ^
  --role=roles/storage.admin ^
  --quiet 2>nul

REM Enable APIs
echo Enabling required APIs...
gcloud services enable iamcredentials.googleapis.com ^
  cloudresourcemanager.googleapis.com ^
  sts.googleapis.com ^
  serviceusage.googleapis.com ^
  containerregistry.googleapis.com ^
  run.googleapis.com ^
  cloudbuild.googleapis.com ^
  --project=%PROJECT_ID% ^
  --quiet 2>nul

REM Create Workload Identity Pool
echo Setting up Workload Identity...
gcloud iam workload-identity-pools create github ^
  --project=%PROJECT_ID% ^
  --location=global ^
  --display-name=github-pool ^
  --quiet 2>nul

REM Get Pool ID
for /f "tokens=*" %%i in ('gcloud iam workload-identity-pools describe github ^
  --project=%PROJECT_ID% ^
  --location=global ^
  --format="value(name)" 2^>nul') do set POOL_ID=%%i

REM Create Workload Identity Provider
gcloud iam workload-identity-pools providers create-oidc github ^
  --project=%PROJECT_ID% ^
  --location=global ^
  --workload-identity-pool=github ^
  --display-name="GitHub Provider" ^
  --attribute-mapping="google.subject=assertion.sub,assertion.aud=assertion.aud" ^
  --issuer-uri="https://token.actions.githubusercontent.com" ^
  --attribute-condition="assertion.aud == 'sts.amazonaws.com'" ^
  --quiet 2>nul

REM Get Provider ID
for /f "tokens=*" %%i in ('gcloud iam workload-identity-pools providers describe github ^
  --project=%PROJECT_ID% ^
  --location=global ^
  --workload-identity-pool=github ^
  --format="value(name)" 2^>nul') do set PROVIDER_ID=%%i

REM Grant Workload Identity permissions
echo Configuring Workload Identity...
gcloud iam service-accounts add-iam-policy-binding ^
  github-actions@%PROJECT_ID%.iam.gserviceaccount.com ^
  --project=%PROJECT_ID% ^
  --role=roles/iam.workloadIdentityUser ^
  --member="principalSet://iam.googleapis.com/!POOL_ID!/attribute.repository/%GITHUB_USERNAME%/ce-cloud-frontend" ^
  --quiet 2>nul

echo.
echo =====================================
echo Setup complete!
echo =====================================
echo.
echo Next steps:
echo 1. Go to: https://github.com/%GITHUB_USERNAME%/ce-cloud-frontend/settings/secrets/actions
echo 2. Add these secrets:
echo.
echo    Secret Name: GCP_PROJECT_ID
echo    Secret Value: %PROJECT_ID%
echo.
echo    Secret Name: GCP_WORKLOAD_IDENTITY_PROVIDER
echo    Secret Value: %PROVIDER_ID%
echo.
echo    Secret Name: GCP_SERVICE_ACCOUNT
echo    Secret Value: github-actions@%PROJECT_ID%.iam.gserviceaccount.com
echo.
echo 3. Initialize git and push to GitHub!
echo.
pause
