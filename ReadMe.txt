================================================================================
                     TASKFLOW - DOCKERIZED WEB APPLICATION
================================================================================

PROJECT: Dockerized Task Manager with Node.js, React, MySQL, Redis
COURSE: Web Programming with NodeJS - 502070
SEMESTER: 2, 2024-2025

================================================================================
                              PREREQUISITES
================================================================================

- Docker Engine 20.10+
- Docker Compose v2.0+
- 4GB RAM minimum (8GB recommended)
- Ports available: 3000, 3306, 6379, 8080

================================================================================
                         QUICK START (DOCKER COMPOSE)
================================================================================

1. Clone repository:
   git clone https://github.com/iannwendy/nodemidterm.git
   cd nodemidterm

2. Start all services:
   docker compose up -d --build

3. Wait for services to be healthy (30-60 seconds)

4. Access application:
   - Frontend: http://localhost:8080
   - API (via Nginx LB): http://localhost:3000

5. Check service status:
   docker compose ps

6. View logs:
   docker compose logs -f

7. Stop services:
   docker compose down

================================================================================
                         DOCKER SWARM DEPLOYMENT
================================================================================

1. Initialize Docker Swarm:
   docker swarm init

2. Build required images:
   docker build -t taskflow-backend:latest ./backend
   docker build -t taskflow-frontend:latest ./frontend
   docker build -t taskflow-worker:latest ./worker

3. Deploy stack:
   docker stack deploy -c docker-stack.yml taskflow

4. Check services:
   docker stack services taskflow

5. Scale services:
   docker service scale taskflow_backend=5
   docker service scale taskflow_frontend=3

6. Remove stack:
   docker stack rm taskflow

================================================================================
                         KUBERNETES DEPLOYMENT
================================================================================

1. Apply Kubernetes manifests:
   kubectl apply -f kubernetes/deployment.yaml

2. Check deployments:
   kubectl get all -n taskflow

3. Check pods:
   kubectl get pods -n taskflow -w

4. Access services:
   kubectl get svc -n taskflow

5. Scale deployment:
   kubectl scale deployment backend --replicas=5 -n taskflow

6. Delete all:
   kubectl delete -f kubernetes/deployment.yaml

================================================================================
                              SERVICES
================================================================================

| Service   | Port  | Description                    | Replicas |
|-----------|-------|--------------------------------|----------|
| frontend  | 8080  | React SPA (Nginx)             | 1        |
| nginx     | 3000  | Load Balancer                  | 1        |
| backend1  | 3000  | Node.js API                    | 1        |
| backend2  | 3000  | Node.js API (replica)          | 1        |
| backend3  | 3000  | Node.js API (replica)          | 1        |
| database  | 3306  | MySQL 8                        | 1        |
| redis     | 6379  | Message Broker                 | 1        |
| worker1   | -     | Async Task Processor           | 1        |
| worker2   | -     | Async Task Processor           | 1        |

================================================================================
                            API ENDPOINTS
================================================================================

Health Check:
   GET http://localhost:3000/health

Tasks API:
   GET    /api/tasks         - Get all tasks
   GET    /api/tasks/:id     - Get single task
   POST   /api/tasks         - Create task
   PUT    /api/tasks/:id     - Update task
   DELETE /api/tasks/:id     - Delete task

Stats API:
   GET    /api/stats         - Get dashboard statistics

================================================================================
                           EXAMPLE REQUESTS
================================================================================

# Create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Complete Docker Setup","status":"todo","priority":"high"}'

# Get all tasks
curl http://localhost:3000/api/tasks

# Update task
curl -X PUT http://localhost:3000/api/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'

# Delete task
curl -X DELETE http://localhost:3000/api/tasks/{id}

================================================================================
                          LOAD BALANCING
================================================================================

Nginx distributes requests to backend replicas using "least_conn" algorithm.
Each request goes through:
   Client -> Nginx (LB) -> Backend (1/2/3) -> MySQL/Redis

Worker services process async tasks via Redis queue:
   Backend -> Redis (publish) -> Worker (consume)

================================================================================
                          ENVIRONMENT VARIABLES
================================================================================

Create .env file:

   DB_NAME=taskflow
   DB_USER=taskflow
   DB_PASSWORD=taskflow123
   DB_HOST=database
   DB_PORT=3306
   CORS_ORIGIN=*
   REDIS_HOST=redis
   REDIS_PORT=6379

================================================================================
                             TESTING
================================================================================

Run E2E tests:
   node backend/tests/e2e.test.js

Run tests inside container:
   docker compose exec backend node tests/e2e.test.js

================================================================================
                        PROJECT STRUCTURE
================================================================================

nodemidterm/
├── frontend/              React application
│   ├── src/
│   │   ├── components/   UI components
│   │   ├── context/      React context
│   │   ├── hooks/        Custom hooks
│   │   └── api/          API client
│   ├── Dockerfile
│   └── package.json
├── backend/               Node.js API
│   ├── src/
│   │   ├── config/       Database & Redis config
│   │   ├── routes/       API routes
│   │   └── index.js      Entry point
│   ├── Dockerfile
│   └── package.json
├── worker/                Async worker
│   ├── src/
│   │   └── worker.js
│   ├── Dockerfile
│   └── package.json
├── nginx/                 Load balancer config
│   └── nginx.conf
├── database/              Database initialization
│   └── init.sql
├── kubernetes/            K8s manifests
│   └── deployment.yaml
├── docker-compose.yml     Docker Compose (Level 1+2)
├── docker-stack.yml       Docker Swarm (Level 3)
└── ReadMe.txt            This file

================================================================================
                              LEVELS
================================================================================

LEVEL 1 - Basic Docker Setup
   - Frontend (React) + Backend (Node.js) + Database (MySQL)
   - Docker Compose orchestration
   - Status: COMPLETE

LEVEL 2 - Advanced Features
   - Load balancing with Nginx (3 backend replicas)
   - Redis message broker for async processing
   - Worker service for background tasks
   - Status: COMPLETE

LEVEL 3 - Container Orchestration
   - Docker Swarm stack definition
   - Kubernetes manifests with HPA
   - Status: CONFIGS READY (manual deployment required)

================================================================================
                               NOTES
================================================================================

1. First startup may take 30-60 seconds for database initialization
2. Database auto-creates 'taskflow' database and 'tasks' table
3. All containers must be healthy before full functionality
4. Docker Swarm requires images to be available locally or in a registry
5. Kubernetes deployment requires kubectl configured cluster

================================================================================
                              CREDITS
================================================================================

Developed for: Web Programming with NodeJS - 502070
Instructor: Mai Van Manh
University: [Your University Name]
Year: 2024-2025

================================================================================
