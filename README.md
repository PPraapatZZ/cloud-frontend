# CE Cloud - Frontend

**CE Cloud** is a Heterogeneous Cloud Management System designed to streamline cloud resource provisioning across **Kubernetes (k8s)** and **OpenStack** platforms.

## ✨ Features

✅ **Create Cloud Groups** - Organize instances by project or workload type
✅ **Create Instances** - Provision computing resources with custom CPU, RAM, and GPU
✅ **Smart Platform Selection**:
  - GPU enabled → Deploy on **Kubernetes (k8s)**
  - CPU/RAM only → Deploy on **OpenStack**
✅ **Inspect Resources** - View detailed information about deployed instances
✅ **Real-time Status** - Monitor instance status and metrics

## 🎯 Checklist Status

| Goal | Front-End | Back-End | Status |
|------|-----------|----------|--------|
| User(s) can create "Group"s | ✅ | - | Done |
| User(s) can create instance inside a Group | ✅ | - | Done |
| User(s) can inspect created instance(s) | ✅ | - | Done |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│          CE Cloud Frontend (React Vite)          │
│  ───────────────────────────────────────────────  │
│  • Group Management (Create, Delete, List)      │
│  • Instance Creation with Resource Selection    │
│  • Real-time Status Monitoring                  │
│  • Responsive UI (Tailwind CSS)                 │
└─────────────────┬───────────────────────────────┘
                  │
                  │ HTTP/REST API
                  │
┌─────────────────▼───────────────────────────────┐
│        CE Cloud Backend (TBD)                   │
│  ───────────────────────────────────────────────  │
│  • Kubernetes Integration (gophercloud)         │
│  • OpenStack Integration (Gophercloud SDK)      │
│  • Data Streaming (Rsync)                       │
│  • Object Storage (MinIO)                       │
└─────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Build & Run

```bash
# Build Docker image
docker build -t ce-cloud-frontend:latest .

# Run container
docker run -p 3000:3000 ce-cloud-frontend:latest
```

### Deploy to Google Cloud Run

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

## 📦 Project Structure

```
ce-cloud-frontend/
├── src/
│   ├── App.jsx          # Main application component
│   └── main.jsx         # React entry point
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── server.js            # Express server for production
├── package.json         # Dependencies
├── Dockerfile           # Docker configuration
├── .env.example         # Environment variables template
├── DEPLOYMENT.md        # Deployment guide
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file:
```env
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=30000
VITE_KUBERNETES_ENDPOINT=https://kubernetes.example.com
VITE_OPENSTACK_ENDPOINT=http://openstack.example.com
```

## 🎨 UI Components

- **Badge**: Status indicators (k8s, OpenStack, Running, Pending, etc.)
- **Modal**: For creating groups and instances
- **Input**: Form fields for user input
- **Select**: Dropdown for resource selection (CPU, RAM, GPU)
- **Btn**: Primary, secondary, danger variants
- **Sidebar**: Navigation for groups
- **MainContent**: Dynamic view based on selection

## 🔐 Security Considerations

- [ ] Add authentication (OAuth/JWT) - awaiting backend
- [ ] Validate user inputs on frontend
- [ ] Use HTTPS in production
- [ ] Implement CSRF protection
- [ ] Set proper CORS headers on backend

## 📊 Data Flow

1. **Create Group**
   - User fills form → Validates input → Creates group locally
   - (Backend: Store in database)

2. **Create Instance**
   - User selects CPU, RAM, GPU → Platform auto-selected
   - Instance created in group
   - (Backend: Route to k8s or OpenStack)

3. **View Instances**
   - Click on group → Display instance table
   - Show status, platform, resource details
   - (Backend: Fetch real-time data)

## 🧪 Testing

Currently using **mock data** for demonstration. When backend is ready:

1. Update `VITE_API_URL` to backend endpoint
2. Replace mock data fetching with API calls
3. Add error handling and loading states

## 📈 Future Enhancements

- [ ] Edit instance details
- [ ] Start/Stop/Delete instances
- [ ] Resource usage monitoring (charts/graphs)
- [ ] Billing information
- [ ] User authentication & authorization
- [ ] Audit logging
- [ ] Advanced filtering & search
- [ ] Batch operations

## 🤝 Integration with Backend

Once backend is deployed:

1. Get backend API endpoint
2. Update `VITE_API_URL` in Cloud Run environment variables
3. Replace `mockGroups` data with API calls
4. Implement error handling for failed requests

Example API endpoints (to be confirmed with backend team):
```
GET  /api/v1/groups
POST /api/v1/groups
GET  /api/v1/groups/:id
DELETE /api/v1/groups/:id
GET  /api/v1/groups/:id/instances
POST /api/v1/groups/:id/instances
DELETE /api/v1/instances/:id
```

## 📝 Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Server**: Express (production)
- **Deployment**: Google Cloud Run
- **Container**: Docker

## 📄 License

KMITL Computer Engineering Project

## 👥 Team

- **Frontend Developer**: นาย ... (You)
- **Backend Developer**: TBD
- **Advisor**: ผศ. อัครเดช วัชระภูพงษ์
- **Co-Advisor**: รศ.ดร. อรฉัตร จิตต์โสภักตร์

## 📞 Support

For questions or issues:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Review component comments in code
3. Contact team members or advisors
