# TaskFlow - Dockerized Task Manager

A production-ready Dockerized web application demonstrating modern containerization with Node.js, React, MySQL, Redis, and advanced orchestration.

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
│       │                            ┌─────────────────┐          │
│       │                            │     Redis       │          │
│       │                            │  (Broker/Queue) │          │
│       │                            └────────┬────────┘          │
│       │                                     │                   │
│       │                                     ▼                   │
│       │                            ┌─────────────────┐          │
│       │                            │     Worker      │          │
│       │                            │ (Async Process) │          │
│       │                            └─────────────────┘          │
│       │                                      │                   │
│       ▼                                      ▼                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      MySQL Database                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Features

### Level 1 - Basic Docker Setup
- [x] Frontend (React + Vite + Tailwind)
- [x] Backend (Node.js + Express + MySQL)
- [x] MySQL Database with auto-initialization
- [x] Docker Compose orchestration

### Level 2 - Advanced Features
- [x] Load balancing with Nginx (3 backend replicas)
- [x] Redis message broker for async processing
- [x] Worker service for background tasks
- [x] Service decoupling via message queue

### Level 3 - Container Orchestration
- [x] Docker Swarm stack definition
- [x] Kubernetes manifests with HPA
- [x] Horizontal pod autoscaling
- [x] Ingress configuration

## Quick Start

### Prerequisites
- Docker & Docker Compose v2+
- Node.js 18+ (for local development)
- MySQL 8 (for local development)

### Run with Docker Compose

```bash
# Clone and navigate
cd /path/to/nodemidterm

# Start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Check service health
docker compose ps
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:8080 |
| API (via Nginx) | http://localhost:3000 |
| MySQL | localhost:3306 |
| Redis | localhost:6379 |

### Local Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get single task |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api/stats | Get dashboard stats |

### Example Requests

```bash
# Create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","status":"todo","priority":"high"}'

# Get all tasks
curl http://localhost:3000/api/tasks

# Update task
curl -X PUT http://localhost:3000/api/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'
```

## Docker Swarm Deployment

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-stack.yml taskflow

# Scale services
docker service scale taskflow_backend=5

# View services
docker service ls

# Remove stack
docker stack rm taskflow
```

## Testing

```bash
# Run E2E tests
node backend/tests/e2e.test.js

# Run with Docker
docker compose exec backend node tests/e2e.test.js
```

## Environment Variables

Create a `.env` file:

```env
DB_NAME=taskflow
DB_USER=taskflow
DB_PASSWORD=taskflow123
DB_HOST=database
DB_PORT=3306
CORS_ORIGIN=*
REDIS_HOST=redis
REDIS_PORT=6379
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
│   ├── Dockerfile
│   └── package.json
├── backend/              # Node.js API
│   ├── src/
│   │   ├── config/       # Database & Redis config
│   │   ├── routes/      # API routes
│   │   └── index.js      # Entry point
│   ├── Dockerfile
│   └── package.json
├── worker/               # Async worker
│   ├── src/
│   │   └── worker.js
│   ├── Dockerfile
│   └── package.json
├── nginx/                # Load balancer config
│   └── nginx.conf
├── database/             # Database initialization
│   └── init.sql
├── kubernetes/           # K8s manifests
│   └── deployment.yaml
├── docker-compose.yml    # Docker Compose config
├── docker-stack.yml      # Docker Swarm stack
└── README.md
```

## License

MIT - Educational Project
