# 🚀 GitHub Actions + Cloud Run Deployment Setup

## Overview
This guide shows how to setup automated CI/CD using GitHub Actions to deploy to Google Cloud Run.

**Workflow:**
```
Push to GitHub → GitHub Actions Runs → Build Docker Image → 
Deploy to Cloud Run → Live in ~2 minutes! 🎉
```

---

## 📋 Prerequisites

- [x] GitHub Account
- [x] Google Cloud Project (with free credits)
- [x] Docker (Cloud Build handles this)
- [x] Git installed locally
- [ ] Project pushed to GitHub (we'll do this)

---

## 🔧 Step 1: Create GitHub Repository

### 1.1 Create New Repo on GitHub
1. Go to https://github.com/new
2. Repository name: `ce-cloud-frontend`
3. Description: "CE Cloud - Heterogeneous Cloud Manager Frontend"
4. Public or Private (both work for Actions)
5. Click **Create repository**

**Copy your repo URL**: `https://github.com/YOUR_USERNAME/ce-cloud-frontend.git`

---

## 🔐 Step 2: Setup Google Cloud Authentication

### 2.1 Create Service Account
```bash
# Set your GCP project ID (replace YOUR_PROJECT_ID)
export PROJECT_ID="your-project-id"

# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions" \
  --project=$PROJECT_ID

# Grant Cloud Run permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/run.admin

# Grant Container Registry permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/storage.admin
```

### 2.2 Enable Workload Identity Federation
```bash
# Enable required APIs
gcloud services enable iamcredentials.googleapis.com \
  cloudresourcemanager.googleapis.com \
  sts.googleapis.com \
  serviceusage.googleapis.com \
  --project=$PROJECT_ID

# Create Workload Identity Pool
gcloud iam workload-identity-pools create github \
  --project=$PROJECT_ID \
  --location=global \
  --display-name=github-pool

# Get Pool ID
WORKLOAD_IDENTITY_POOL_ID=$(gcloud iam workload-identity-pools describe github \
  --project=$PROJECT_ID \
  --location=global \
  --format='value(name)')

echo "Pool ID: $WORKLOAD_IDENTITY_POOL_ID"

# Create Workload Identity Provider
gcloud iam workload-identity-pools providers create-oidc github \
  --project=$PROJECT_ID \
  --location=global \
  --workload-identity-pool=github \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,assertion.aud=assertion.aud" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-condition="assertion.aud == 'sts.amazonaws.com'"

# Get Provider ID
PROVIDER_ID=$(gcloud iam workload-identity-pools providers describe github \
  --project=$PROJECT_ID \
  --location=global \
  --workload-identity-pool=github \
  --format='value(name)')

echo "Provider ID: $PROVIDER_ID"
```

### 2.3 Create Service Account Key & Grant Permissions
```bash
# Create key for GitHub
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@$PROJECT_ID.iam.gserviceaccount.com

# Alternative: Use Workload Identity (recommended)
# Grant the service account the ability to impersonate itself
gcloud iam service-accounts add-iam-policy-binding \
  github-actions@$PROJECT_ID.iam.gserviceaccount.com \
  --project=$PROJECT_ID \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/$WORKLOAD_IDENTITY_POOL_ID/attribute.repository/YOUR_USERNAME/ce-cloud-frontend"
```

---

## 🔑 Step 3: Add GitHub Secrets

1. Go to your GitHub repo
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

### Required Secrets:
```
GCP_PROJECT_ID = your-gcp-project-id
GCP_WORKLOAD_IDENTITY_PROVIDER = {PROVIDER_ID from step 2.2}
GCP_SERVICE_ACCOUNT = github-actions@{PROJECT_ID}.iam.gserviceaccount.com
```

**Or (if using key.json method):**
```
GCP_SA_KEY = (contents of key.json, base64 encoded)
```

---

## 📝 Step 4: Initialize Git & Push to GitHub

### 4.1 Configure Git User
```bash
git config --global user.email "YOUR_EMAIL@example.com"
git config --global user.name "Your Name"
```

### 4.2 Initialize & Commit
```bash
cd c:\Users\pea64\Desktop\Demo

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: CE Cloud Frontend with GitHub Actions"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/ce-cloud-frontend.git

# Push to GitHub (main branch)
git branch -M main
git push -u origin main
```

---

## 🚀 Step 5: Verify Deployment

### 5.1 Check GitHub Actions
1. Go to your repo on GitHub
2. Click **Actions** tab
3. Watch the workflow run:
   - ✅ Checkout code
   - ✅ Setup Node.js
   - ✅ Install dependencies
   - ✅ Build frontend
   - ✅ Authenticate to Google Cloud
   - ✅ Build Docker image
   - ✅ Push to Container Registry
   - ✅ Deploy to Cloud Run

### 5.2 Get Service URL
```bash
gcloud run services describe ce-cloud-frontend \
  --region asia-southeast1 \
  --format='value(status.url)'
```

---

## 🔄 Continuous Deployment (CD)

### Now Every Time You:
```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main
```

### GitHub Actions Automatically:
1. **Builds** new Docker image
2. **Pushes** to Google Container Registry
3. **Deploys** to Cloud Run
4. **Live** in ~2 minutes!

---

## 📊 Monitoring Deployments

### View Workflows
```bash
# List recent deployments
gcloud run deployments list --region asia-southeast1

# View real-time logs
gcloud run logs read ce-cloud-frontend --region asia-southeast1 --limit 100

# Set up Monitoring
# Go to Cloud Console → Cloud Run → ce-cloud-frontend → Metrics
```

### GitHub Actions Logs
1. Go to repo → **Actions**
2. Click any workflow
3. View step-by-step logs
4. See Errors/Warnings

---

## 🐛 Troubleshooting

### Issue: "Error: gcloud not found"
**Solution**: Check GCP_PROJECT_ID secret is set

### Issue: "Docker push failed"
**Solution**: Check service account has `roles/storage.admin`

### Issue: "Cloud Run deployment failed"
**Solution**: Check service account has `roles/run.admin`

### Issue: "Workload Identity failed"
**Solution**: Verify provider URI and attribute mapping

---

## 🔒 Security Best Practices

✅ **Use Workload Identity** (no key files)
✅ **Least Privilege** (only needed roles)
✅ **GitHub Environments** (for different stages)
✅ **Secrets** (never hardcode credentials)
✅ **Branch Protection** (require reviews before deploy)

---

## 📚 Useful Commands

```bash
# View all service accounts
gcloud iam service-accounts list

# View service account permissions
gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:github-actions*"

# Revoke service account (if needed)
gcloud iam service-accounts delete github-actions@$PROJECT_ID.iam.gserviceaccount.com

# View Cloud Run services
gcloud run services list --region asia-southeast1

# Update environment variables
gcloud run services update ce-cloud-frontend \
  --region asia-southeast1 \
  --update-env-vars VITE_API_URL=https://your-backend-api.com
```

---

## ✨ Next Steps

1. ✅ Setup Google Cloud Service Account
2. ✅ Add GitHub Secrets
3. ✅ Push repo to GitHub
4. ✅ Watch first deployment
5. ⏳ Setup backend API (when ready)
6. ⏳ Update `VITE_API_URL` environment variable
7. ⏳ Add more tests to workflow
8. ⏳ Setup notifications (Slack, email)

---

## 📞 Support

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Workload Identity Federation](https://cloud.google.com/docs/authentication/workload-identity-federation)
- [gcloud CLI Reference](https://cloud.google.com/cli/docs)
