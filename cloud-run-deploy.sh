#!/bin/bash

# CE Cloud Frontend - Google Cloud Run Deployment Script
# Usage: ./cloud-run-deploy.sh

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 CE Cloud Frontend - Google Cloud Run Deployment${NC}"
echo "=================================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI not found. Please install it first.${NC}"
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check if authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${YELLOW}🔐 Authenticating with Google Cloud...${NC}"
    gcloud auth login
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ No GCP project configured.${NC}"
    echo "Run: gcloud init"
    exit 1
fi

echo -e "${GREEN}✓ Project: $PROJECT_ID${NC}"

# Ask for region
echo ""
echo -e "${YELLOW}📍 Select region:${NC}"
echo "1) asia-southeast1 (Bangkok) - Recommended for KMITL"
echo "2) us-central1 (USA)"
echo "3) europe-west1 (Europe)"
read -p "Enter choice (1-3): " REGION_CHOICE

case $REGION_CHOICE in
    1) REGION="asia-southeast1" ;;
    2) REGION="us-central1" ;;
    3) REGION="europe-west1" ;;
    *) 
        echo -e "${RED}Invalid choice. Using asia-southeast1.${NC}"
        REGION="asia-southeast1"
        ;;
esac

echo -e "${GREEN}✓ Region: $REGION${NC}"

# Enable required APIs
echo ""
echo -e "${YELLOW}🔧 Enabling required APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com \
    run.googleapis.com \
    containerregistry.googleapis.com \
    --project=$PROJECT_ID

echo -e "${GREEN}✓ APIs enabled${NC}"

# Service configuration
SERVICE_NAME="ce-cloud-frontend"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo ""
echo -e "${YELLOW}📦 Building and deploying...${NC}"
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
echo "Image: $IMAGE_NAME"
echo ""

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --timeout 3600 \
    --project=$PROJECT_ID \
    --set-env-vars="NODE_ENV=production"

# Get service URL
echo ""
echo -e "${YELLOW}🔗 Getting service URL...${NC}"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
    --region=$REGION \
    --format='value(status.url)' \
    --project=$PROJECT_ID)

echo ""
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo "=================================================="
echo -e "${GREEN}Service URL: $SERVICE_URL${NC}"
echo ""
echo "Next steps:"
echo "1. Open: $SERVICE_URL"
echo "2. Test the application"
echo "3. When backend is ready, update API endpoint:"
echo ""
echo "   gcloud run services update $SERVICE_NAME \\"
echo "       --region=$REGION \\"
echo "       --update-env-vars=VITE_API_URL=https://your-backend-api.com"
echo ""
echo "Architecture tip:"
echo "- Frontend: Cloud Run (auto-scaling, serverless)"
echo "- Backend: Can be deployed separately (your team)"
echo "- They communicate via HTTP/REST API"
echo ""
echo "For more info, see: DEPLOYMENT.md"
