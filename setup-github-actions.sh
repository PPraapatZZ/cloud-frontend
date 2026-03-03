#!/bin/bash
# Quick setup script for GitHub Actions deployment
# Usage: ./setup-github-actions.sh YOUR_PROJECT_ID YOUR_GITHUB_USERNAME

PROJECT_ID=${1:-"YOUR_PROJECT_ID"}
GITHUB_USERNAME=${2:-"YOUR_USERNAME"}

if [ "$PROJECT_ID" = "YOUR_PROJECT_ID" ]; then
    echo "Usage: ./setup-github-actions.sh YOUR_GCP_PROJECT_ID YOUR_GITHUB_USERNAME"
    exit 1
fi

echo "🚀 GitHub Actions + Cloud Run Setup"
echo "===================================="
echo ""
echo "Project ID: $PROJECT_ID"
echo "GitHub User: $GITHUB_USERNAME"
echo ""

# Create service account
echo "📝 Creating service account..."
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions" \
  --project=$PROJECT_ID 2>/dev/null || echo "⚠️  Service account may already exist"

# Grant roles
echo "🔐 Granting permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/run.admin \
  --quiet 2>/dev/null

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/storage.admin \
  --quiet 2>/dev/null

# Enable APIs
echo "📡 Enabling required APIs..."
gcloud services enable iamcredentials.googleapis.com \
  cloudresourcemanager.googleapis.com \
  sts.googleapis.com \
  serviceusage.googleapis.com \
  containerregistry.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  --project=$PROJECT_ID \
  --quiet 2>/dev/null

# Create Workload Identity
echo "🔑 Setting up Workload Identity..."
gcloud iam workload-identity-pools create github \
  --project=$PROJECT_ID \
  --location=global \
  --display-name=github-pool \
  --quiet 2>/dev/null || echo "⚠️  Pool may already exist"

POOL_ID=$(gcloud iam workload-identity-pools describe github \
  --project=$PROJECT_ID \
  --location=global \
  --format='value(name)' 2>/dev/null)

gcloud iam workload-identity-pools providers create-oidc github \
  --project=$PROJECT_ID \
  --location=global \
  --workload-identity-pool=github \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,assertion.aud=assertion.aud" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-condition="assertion.aud == 'sts.amazonaws.com'" \
  --quiet 2>/dev/null || echo "⚠️  Provider may already exist"

PROVIDER_ID=$(gcloud iam workload-identity-pools providers describe github \
  --project=$PROJECT_ID \
  --location=global \
  --workload-identity-pool=github \
  --format='value(name)' 2>/dev/null)

# Grant Workload Identity permissions
echo "👤 Configuring Workload Identity..."
gcloud iam service-accounts add-iam-policy-binding \
  github-actions@$PROJECT_ID.iam.gserviceaccount.com \
  --project=$PROJECT_ID \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/$POOL_ID/attribute.repository/$GITHUB_USERNAME/ce-cloud-frontend" \
  --quiet 2>/dev/null

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to: https://github.com/$GITHUB_USERNAME/ce-cloud-frontend/settings/secrets/actions"
echo "2. Add these secrets:"
echo ""
echo "   Secret Name: GCP_PROJECT_ID"
echo "   Secret Value: $PROJECT_ID"
echo ""
echo "   Secret Name: GCP_WORKLOAD_IDENTITY_PROVIDER"
echo "   Secret Value: $PROVIDER_ID"
echo ""
echo "   Secret Name: GCP_SERVICE_ACCOUNT"
echo "   Secret Value: github-actions@$PROJECT_ID.iam.gserviceaccount.com"
echo ""
echo "3. Then push your code to GitHub!"
echo ""
