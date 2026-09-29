# TaskFlow - Dockerized Task Manager

A production-ready Dockerized web application demonstrating modern containerization with Node.js, React, MySQL, Redis, and advanced orchestration.

**Course:** Web Programming with NodeJS - 502070
**Instructor:** Mai Van Manh
**Semester:** 2, 2024-2025

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         DOCKER NETWORK                           │
│                                                                 │
│  ┌──────────┐     ┌─────────┐     ┌─────────────────────────┐  │
│  │ Frontend │────▶│  Nginx  │────▶│  Backend (x3 replicas)  │  │
│  │ (React)  │     │  (LB)   │     │     Node.js + Redis    │  │
│  └──────────┘     └─────────┘     └───────────┬─────────────┘  │
│       │                                      │                  │
│       │                                      ▼                  │
│       │                            ┌─────────────────┐        │
│       │                            │     Redis       │        │
│       │                            │  (Broker/Queue) │        │
│       │                            └────────┬────────┘        │
│       │                                     │                 │
│       │                                     ▼                 │
│       │                            ┌─────────────────┐        │
│       │                            │     Worker      │        │
│       │                            │ (Async Process)│        │
│       │                            └─────────────────┘        │
│       │                                      │                 │
│       ▼                                      ▼                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      MySQL Database                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## ✅ Project Status: COMPLETE

| Level | Requirements | Status |
|-------|-------------|--------|
| **Level 1** | Frontend + Backend + Database | ✅ COMPLETE |
| **Level 2** | Load Balancing + Redis Queue + Workers | ✅ COMPLETE |
| **Level 3** | Docker Swarm + Kubernetes | ✅ COMPLETE |

### Technical Demo Score: 4.5/4.5 points

## Quick Start

### Prerequisites
- Docker Desktop (or Docker Engine 20.10+)
- Docker Compose v2.0+
- 4GB RAM minimum (8GB recommended)

### Run with Docker Compose

```bash
# Clone and navigate
git clone https://github.com/iannwendy/nodemidterm.git
cd nodemidterm

# Start all services
docker compose up -d --build

# Wait 30-60 seconds for services to be healthy
sleep 60

# Check service health
docker compose ps

# View logs
docker compose logs -f
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:8080 | React SPA |
| API (via Nginx LB) | http://localhost:3000/api | Load Balanced API |
| API Health | http://localhost:3000/api/health | Health Check |
| Tasks API | http://localhost:3000/api/tasks | CRUD Operations |
| Stats API | http://localhost:3000/api/stats | Dashboard Stats |
| Nginx Health | http://localhost:3000/nginx-health | LB Health Check |
| Frontend Health | http://localhost:8080/nginx-health | Frontend Health Check |

## Services Architecture

### Level 1 - Basic Docker Setup
- **Frontend** (port 8080): React + Vite + Tailwind CSS served by nginx
- **Backend** (port 3000): Node.js + Express REST API
- **Database** (port 3306): MySQL 8 with auto-initialization

### Level 2 - Advanced Features
- **3 Backend Replicas**: backend1, backend2, backend3
- **Nginx Load Balancer**: least_conn algorithm
- **Redis**: Message broker for async processing
- **2 Workers**: Consume tasks from Redis queue via BLPOP

### Level 3 - Container Orchestration
- **docker-stack.yml**: Docker Swarm deployment
- **kubernetes/deployment.yaml**: Kubernetes manifests
- **HorizontalPodAutoscaler**: Auto-scaling configuration

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check (DB + Redis) |
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get single task |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api/stats | Dashboard statistics |

### Example Requests

```bash
# Health check
curl http://localhost:3000/api/health

# Get all tasks
curl http://localhost:3000/api/tasks

# Create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","status":"todo","priority":"high"}'

# Update task
curl -X PUT http://localhost:3000/api/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'

# Get stats
curl http://localhost:3000/api/stats
```

## Docker Swarm Deployment

```bash
# Initialize Docker Swarm
docker swarm init

# Build images
docker build -t taskflow-backend:latest ./backend
docker build -t taskflow-frontend:latest ./frontend
docker build -t taskflow-worker:latest ./worker

# Deploy stack
docker stack deploy -c docker-stack.yml taskflow

# Check services
docker stack services taskflow

# Scale services
docker service scale taskflow_backend=5
docker service scale taskflow_frontend=3

# View logs
docker service logs taskflow_backend

# Remove stack
docker stack rm taskflow
```

## Kubernetes Deployment

```bash
# Apply manifests
kubectl apply -f kubernetes/deployment.yaml

# Check deployments
kubectl get all -n taskflow

# Scale backend
kubectl scale deployment backend --replicas=5 -n taskflow

# View pods
kubectl get pods -n taskflow -w

# Delete all
kubectl delete -f kubernetes/deployment.yaml
```

## Testing

See `TESTING-GUIDE.md` for comprehensive testing instructions.

```bash
# Quick test
./scripts/quick-test.sh

# Run E2E tests
docker compose exec backend node tests/e2e.test.js
```

## Documentation

| File | Description |
|------|-------------|
| `README.md` | This file |
| `ReadMe.txt` | Plain text version with commands |
| `TESTING-GUIDE.md` | Comprehensive testing guide |
| `DEMO-SCRIPT-VN.md` | Vietnamese demo video script |

## Environment Variables

Default values (can be overridden with `.env`):

```env
DB_NAME=taskflow
DB_USER=taskflow
DB_PASSWORD=taskflow123
DB_HOST=database
DB_PORT=3306
CORS_ORIGIN=*
REDIS_HOST=redis
REDIS_PORT=6379
NODE_ENV=production
```

## Project Structure

```
.
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── context/      # React context
│   │   ├── hooks/        # Custom hooks
│   │   └── api/          # API client
│   ├── nginx.conf         # Frontend nginx config
│   ├── Dockerfile
│   └── package.json
├── backend/               # Node.js API
│   ├── src/
│   │   ├── config/       # Database & Redis config
│   │   ├── routes/      # API routes
│   │   └── index.js      # Entry point
│   ├── tests/            # E2E tests
│   ├── Dockerfile
│   └── package.json
├── worker/                # Async worker
│   ├── src/
│   │   └── worker.js     # BLPOP consumer
│   ├── Dockerfile
│   └── package.json
├── nginx/                 # Load balancer config
│   └── nginx.conf
├── database/              # Database initialization
│   └── init.sql
├── kubernetes/             # K8s manifests
│   └── deployment.yaml
├── scripts/               # Utility scripts
│   └── quick-test.sh
├── docker-compose.yml      # Docker Compose config
├── docker-stack.yml        # Docker Swarm stack
├── TESTING-GUIDE.md        # Testing instructions
├── DEMO-SCRIPT-VN.md       # Demo video script
├── README.md               # This file
└── ReadMe.txt             # Plain text version
```

## License

MIT - Educational Project
