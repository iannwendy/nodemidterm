================================================================================
                     TASKFLOW - DOCKERIZED TASK MANAGER
================================================================================

PROJECT: Dockerized Task Manager with Node.js, React, MySQL, Redis
COURSE: Web Programming with NodeJS - 502070
SEMESTER: 2, 2024-2025
LECTURER: Mai Van Manh

================================================================================
                          PROJECT STATUS: COMPLETE
================================================================================

Technical Demo Score: 4.5/4.5 points

Level 1 (Basic Docker Setup):     ✅ COMPLETE
Level 2 (Advanced Features):       ✅ COMPLETE
Level 3 (Container Orchestration): ✅ COMPLETE

================================================================================
                              PREREQUISITES
================================================================================

- Docker Desktop (or Docker Engine 20.10+)
- Docker Compose v2.0+
- 4GB RAM minimum (8GB recommended)
- Ports: 3000, 3306, 6379, 8080

================================================================================
                         QUICK START (DOCKER COMPOSE)
================================================================================

1. Clone repository:
   git clone https://github.com/iannwendy/nodemidterm.git
   cd nodemidterm

2. Start all services:
   docker compose up -d --build

3. Wait for services to be healthy (30-60 seconds):
   sleep 60

4. Check service status:
   docker compose ps

5. Access application:
   - Frontend: http://localhost:8080
   - API (via Nginx LB): http://localhost:3000/api
   - API Health: http://localhost:3000/api/health

6. View logs:
   docker compose logs -f

7. Stop services:
   docker compose down

================================================================================
                         ACCESS POINTS
================================================================================

| Service          | URL                           | Description        |
|------------------|-------------------------------|-------------------|
| Frontend         | http://localhost:8080         | React SPA         |
| API (via LB)     | http://localhost:3000/api     | Load Balanced API |
| API Health       | http://localhost:3000/api/health | DB + Redis OK |
| Tasks            | http://localhost:3000/api/tasks | CRUD         |
| Stats            | http://localhost:3000/api/stats | Dashboard    |
| Nginx Health     | http://localhost:3000/nginx-health | LB OK      |
| Frontend Health  | http://localhost:8080/nginx-health | FE OK     |

================================================================================
                              API ENDPOINTS
================================================================================

GET    /api/health         - Health check (DB + Redis)
GET    /api/tasks          - Get all tasks
GET    /api/tasks/:id      - Get single task
POST   /api/tasks          - Create task
PUT    /api/tasks/:id      - Update task
DELETE /api/tasks/:id      - Delete task
GET    /api/stats          - Dashboard statistics

================================================================================
                         EXAMPLE REQUESTS
================================================================================

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

# Delete task
curl -X DELETE http://localhost:3000/api/tasks/{id}

# Get statistics
curl http://localhost:3000/api/stats

================================================================================
                              SERVICES
================================================================================

Level 1 - Basic Docker Setup:
| Service   | Port  | Description           | Status |
|-----------|-------|----------------------|--------|
| frontend  | 8080  | React SPA (Nginx)   | ✅ OK  |
| backend1  | 3000  | Node.js API (replica 1)| ✅ OK |
| backend2  | 3000  | Node.js API (replica 2)| ✅ OK |
| backend3  | 3000  | Node.js API (replica 3)| ✅ OK |
| database  | 3306  | MySQL 8              | ✅ OK  |

Level 2 - Advanced Features:
| Service   | Port  | Description           | Status |
|-----------|-------|----------------------|--------|
| nginx     | 3000  | Load Balancer        | ✅ OK  |
| redis     | 6379  | Message Broker       | ✅ OK  |
| worker1   | -     | Async Processor      | ✅ OK  |
| worker2   | -     | Async Processor      | ✅ OK  |

Level 3 - Container Orchestration:
| Config    | Description              | Status |
|-----------|-------------------------|--------|
| docker-stack.yml | Docker Swarm     | ✅ OK  |
| kubernetes/ | Kubernetes Manifests | ✅ OK  |

================================================================================
                         LOAD BALANCING
================================================================================

Nginx distributes requests to 3 backend replicas using "least_conn" algorithm.

Request flow:
   Client → Nginx (LB:3000) → Backend (1/2/3:3000) → MySQL/Redis

Worker processes async tasks via Redis queue:
   Backend → Redis (LPUSH) → Worker (BLPOP)

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
   docker service scale taskflow_backend1=5

6. View logs:
   docker service logs taskflow_backend1

7. Remove stack:
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

6. Horizontal Pod Autoscaler:
   kubectl autoscale deployment backend --cpu-percent=70 --min=2 --max=10 -n taskflow

7. Delete all:
   kubectl delete -f kubernetes/deployment.yaml

================================================================================
                         TESTING
================================================================================

See TESTING-GUIDE.md for comprehensive testing instructions.

Quick test commands:
   # Check all containers healthy
   docker compose ps

   # Test health endpoint
   curl http://localhost:3000/api/health

   # Test load balancing
   for i in {1..30}; do curl -s http://localhost:3000/api/health > /dev/null; done
   docker compose logs backend1 | grep -c "GET /api"
   docker compose logs backend2 | grep -c "GET /api"
   docker compose logs backend3 | grep -c "GET /api"

   # Test worker processing
   curl -X POST http://localhost:3000/api/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","status":"todo","priority":"high"}'
   docker compose logs worker1 --tail 10

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
│   ├── nginx.conf         Nginx config
│   ├── Dockerfile
│   └── package.json
├── backend/               Node.js API
│   ├── src/
│   │   ├── config/       Database & Redis config
│   │   ├── routes/       API routes
│   │   └── index.js      Entry point
│   ├── tests/             E2E tests
│   ├── Dockerfile
│   └── package.json
├── worker/                Async worker
│   ├── src/
│   │   └── worker.js     BLPOP consumer
│   ├── Dockerfile
│   └── package.json
├── nginx/                 Load balancer config
│   └── nginx.conf
├── database/              Database initialization
│   └── init.sql
├── kubernetes/            K8s manifests
│   └── deployment.yaml
├── scripts/              Utility scripts
│   └── quick-test.sh
├── docker-compose.yml     Docker Compose (Level 1+2)
├── docker-stack.yml       Docker Swarm (Level 3)
├── TESTING-GUIDE.md       Testing instructions
├── DEMO-SCRIPT-VN.md      Demo video script
├── README.md              Markdown documentation
└── ReadMe.txt            This file

================================================================================
                              LEVELS
================================================================================

LEVEL 1 - Basic Docker Setup (2.0 points)
   ✅ Frontend (React) + Backend (Node.js) + Database (MySQL)
   ✅ Docker Compose orchestration
   ✅ All services in same Docker network
   ✅ Status: COMPLETE

LEVEL 2 - Advanced Features (1.0 points)
   ✅ Load balancing with Nginx (3 backend replicas)
   ✅ Redis message broker for async processing
   ✅ Worker service for background tasks
   ✅ Service decoupling via message queue
   ✅ Status: COMPLETE

LEVEL 3 - Container Orchestration (0.5 points)
   ✅ Docker Swarm stack definition
   ✅ Kubernetes manifests with HPA
   ✅ Horizontal Pod Autoscaling
   ✅ Status: COMPLETE

================================================================================
                              NOTES
================================================================================

1. First startup may take 30-60 seconds for database initialization
2. Database auto-creates 'taskflow' database and 'tasks' table
3. All containers must be healthy before full functionality
4. Docker Swarm requires images to be available locally or in a registry
5. Kubernetes deployment requires kubectl configured cluster

================================================================================
                          DOCUMENTATION
================================================================================

README.md          - Full documentation (Markdown)
ReadMe.txt         - This file (Plain text)
TESTING-GUIDE.md   - Comprehensive testing guide
DEMO-SCRIPT-VN.md  - Vietnamese demo video script

================================================================================
                              CREDITS
================================================================================

Developed for: Web Programming with NodeJS - 502070
Instructor: Mai Van Manh
Year: 2024-2025

================================================================================
