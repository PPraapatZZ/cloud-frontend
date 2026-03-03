# CE Cloud Frontend - Deployment Guide

## 📋 Prerequisites
- Google Cloud Account with free credits ✅
- Docker installed locally (optional for local testing)
- `gcloud` CLI installed
- Node.js 20+ (for local development)

---

## 🚀 Deployment to Google Cloud Run

### Step 1: Install Google Cloud CLI
```bash
# Windows
choco install google-cloud-sdk

# Or download from:
# https://cloud.google.com/sdk/docs/install
```

### Step 2: Initialize gcloud and authenticate
```bash
gcloud init
gcloud auth login
```

### Step 3: Set your GCP project
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region asia-southeast1  # or your preferred region
```

### Step 4: Enable required APIs
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 5: Deploy to Cloud Run
```bash
# From the project root directory
gcloud run deploy ce-cloud-frontend \
  --source . \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --timeout 3600
```

### Step 6: Get the service URL
```bash
gcloud run services describe ce-cloud-frontend --region asia-southeast1
```

---

## 🔗 Connecting to Backend

Once backend is ready, update the Cloud Run environment variables:

```bash
gcloud run services update ce-cloud-frontend \
  --region asia-southeast1 \
  --update-env-vars VITE_API_URL=https://your-backend-url.com
```

Or via Google Cloud Console:
1. Go to **Cloud Run** → **ce-cloud-frontend**
2. Click **Edit & Deploy New Revision**
3. Add environment variables:
   - `VITE_API_URL`: Your backend API endpoint
   - `VITE_KUBERNETES_ENDPOINT`: K8s cluster endpoint
   - `VITE_OPENSTACK_ENDPOINT`: OpenStack endpoint

---

## 🏗️ Architecture for Production

### Option 1: Separate Services (Recommended for scalability)
```
┌─────────────────────────────────────────┐
│         Google Cloud Platform           │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐   ┌──────────────┐  │
│  │ Cloud Run    │   │ Cloud Run    │  │
│  │ (Frontend)   │───│ (Backend)    │  │
│  │ React        │   │ Node/Python  │  │
│  └──────────────┘   └──────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Cloud SQL (optional)             │  │
│  │ PostgreSQL/MySQL                 │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### Option 2: Combined VM (For simplicity)
```
┌─────────────────────────────────────────┐
│    Compute Engine VM (n1-standard-1)    │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐                      │
│  │ Port 3000    │ Frontend             │
│  │ (React)      │                      │
│  └──────────────┘                      │
│                                         │
│  ┌──────────────┐                      │
│  │ Port 5000    │ Backend              │
│  │ (API)        │                      │
│  └──────────────┘                      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📊 Recommended Instance Specs

**For Frontend (Cloud Run):**
- Memory: 512 MB
- CPU: 1 (shared)
- Region: asia-southeast1 (สสว)
- Auto-scaling: On
- Estimated cost: ~$2-5/month (within free quota)

**For Backend (if deployed separately):**
- Machine type: e2-micro or e2-small
- Memory: 1-2 GB
- CPU: 1-2 vCPU
- Region: asia-southeast1
- Cost: ~$10-20/month

---

## 🔐 Environment Variables

Frontend (.env):
```
VITE_API_URL=https://your-backend-api.com
VITE_API_TIMEOUT=30000
```

Backend (Server-side):
- Database connection string
- Kubernetes API endpoint
- OpenStack credentials
- JWT secret
- etc.

---

## ✅ Verification Checklist

- [x] Frontend deployed to Cloud Run
- [ ] Backend deployed (wait for backend team)
- [ ] API endpoints configured
- [ ] CORS settings correct
- [ ] Environment variables set
- [ ] Health checks passing
- [ ] Logs monitoring configured

---

## 📚 Useful Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Run Deploying from Source](https://cloud.google.com/run/docs/building/containers-quickstart)
- [gcloud CLI Reference](https://cloud.google.com/cli/docs)
- [Google Cloud Pricing](https://cloud.google.com/pricing)

---

## 🆘 Common Issues

**Issue**: `Permission denied while trying to connect to Docker daemon`
- **Solution**: Start Docker Desktop or use `gcloud run deploy` without Docker

**Issue**: Container exits immediately
- **Solution**: Check logs with `gcloud run logs read ce-cloud-frontend`

**Issue**: CORS errors on frontend
- **Solution**: Backend must set CORS headers allowing frontend domain

**Issue**: API calls timeout
- **Solution**: Increase timeout or check backend connectivity

---

## 📞 Support

For issues with:
- **Frontend**: Check [Vite docs](https://vitejs.dev/)
- **Cloud Run**: Check [GCP docs](https://cloud.google.com/run/docs)
- **General**: Contact infrastructure team
