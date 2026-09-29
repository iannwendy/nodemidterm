# TaskFlow - Full Testing Guide
## Dockerized Node.js Web Application - Web Programming with NodeJS 502070

---

## 📋 Prerequisites

Before testing, ensure:
- [ ] Docker Desktop is running
- [ ] All containers are built and running: `docker compose up -d --build`
- [ ] Docker context is correct: `docker context use desktop-linux`

**Start all services:**
```bash
docker context use desktop-linux
docker compose up -d --build
docker compose ps  # Should show all 9 services as "healthy"
```

---

## 🎯 Level 1 Requirements (2.0 points)

### Task 1.1: Docker Compose Setup (Level 1 - Basic)

**Requirement:** Deploy a simple Docker setup using Docker Compose with at least 3 services.

#### Test 1.1.1: Check Docker Compose File Exists
```bash
cat docker-compose.yml | grep -E "services:|frontend:|backend:|database:"
```
- **Expected PASS:** File exists with `services:` and 3+ service definitions
- **Expected FAIL:** File missing or incomplete

#### Test 1.1.2: Verify All Services Start
```bash
docker compose up -d --build
docker compose ps
```
- **Expected PASS:** All services show "healthy" or "Up" status
- **Expected FAIL:** Some services not running or restarting

#### Test 1.1.3: Verify 3+ Services Defined
```bash
docker compose config --services
```
- **Expected PASS:** Shows frontend, backend replicas, database, nginx, redis, worker
- **Expected FAIL:** Less than 3 services

---

### Task 1.2: Frontend Service (Level 1)

**Requirement:** Frontend (React/HTML) accessible and communicating.

#### Test 1.2.1: Frontend Accessible on Port 8080
```bash
curl -s http://localhost:8080 | grep -o "<title>.*</title>"
```
- **Expected PASS:** Returns `<title>TaskFlow - Dockerized Task Manager</title>`
- **Expected FAIL:** Connection refused or wrong content

#### Test 1.2.2: Frontend Health Check
```bash
curl -s http://localhost:8080/nginx-health
```
- **Expected PASS:** Returns `frontend healthy`
- **Expected FAIL:** 404 or connection error

#### Test 1.2.3: Frontend Docker Health Check
```bash
docker compose ps frontend
```
- **Expected PASS:** Status shows healthy, ports 8080:80 mapped
- **Expected FAIL:** Container not healthy

---

### Task 1.3: Backend Node.js Service (Level 1)

**Requirement:** Backend API running on Node.js, responding to requests.

#### Test 1.3.1: Backend Health Endpoint
```bash
curl -s http://localhost:3000/api/health | python3 -m json.tool
```
- **Expected PASS:**
```json
{
    "status": "ok",
    "checks": {
        "database": {"status": "ok"},
        "redis": {"status": "ok"}
    }
}
```
- **Expected FAIL:** Connection refused, 500 error, or missing checks

#### Test 1.3.2: Backend Root Health (Direct)
```bash
curl -s http://localhost:3000/health
```
- **Expected PASS:** Returns JSON with status "ok"
- **Expected FAIL:** Returns nginx welcome page (wrong routing)

#### Test 1.3.3: Backend Running on Correct Port
```bash
docker compose ps | grep backend | grep "3000/tcp"
```
- **Expected PASS:** Shows backend containers with port 3000 exposed
- **Expected FAIL:** No backend containers or wrong ports

---

### Task 1.4: Database Service (Level 1)

**Requirement:** MySQL database working, data persists.

#### Test 1.4.1: Database Container Healthy
```bash
docker compose ps database
```
- **Expected PASS:** Status healthy, port 3306 mapped
- **Expected FAIL:** Container not healthy or not running

#### Test 1.4.2: Database Connection from Backend
```bash
curl -s http://localhost:3000/api/health | grep -o '"database":{"status":"[^"]*"'
```
- **Expected PASS:** `"database":{"status":"ok"}`
- **Expected FAIL:** Status "error" or missing

#### Test 1.4.3: Database Has Sample Data
```bash
curl -s http://localhost:3000/api/tasks | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Total tasks: {len(d[\"data\"])}')"
```
- **Expected PASS:** Returns 7+ seed tasks
- **Expected FAIL:** Empty response or error

#### Test 1.4.4: Database Init Script Executed
```bash
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; SHOW TABLES;"
```
- **Expected PASS:** Shows `tasks` table
- **Expected FAIL:** Table not found

---

### Task 1.5: Service Communication (Level 1)

**Requirement:** Services in same Docker network, communicating correctly.

#### Test 1.5.1: Frontend Calls Backend API
```bash
curl -s http://localhost:8080/api/tasks | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Response success: {d.get(\"success\", False)}')"
```
- **Expected PASS:** `Response success: True`
- **Expected FAIL:** 502 Bad Gateway, 404, or CORS error

#### Test 1.5.2: Services in Same Network
```bash
docker network inspect taskflow-network --format '{{range .Containers}}{{.Name}} {{end}}'
```
- **Expected PASS:** Lists all service containers
- **Expected FAIL:** Containers missing from network

#### Test 1.5.3: Backend Database Health Check
```bash
curl -s http://localhost:3000/api/health | grep -q '"database":{"status":"ok"' && echo "PASS" || echo "FAIL"
```
- **Expected PASS:** Prints "PASS"
- **Expected FAIL:** Prints "FAIL"

---

### Task 1.6: Docker Build Reproducibility (Level 1)

**Requirement:** `docker compose up -d` works from clean environment, no manual npm install.

#### Test 1.6.1: Dockerfile Has npm ci
```bash
grep -E "npm (ci|install)" backend/Dockerfile
```
- **Expected PASS:** Contains `npm ci --only=production` or similar
- **Expected FAIL:** Uses `npm install` without `--only=production`

#### Test 1.6.2: Build From Clean State
```bash
docker compose down -v
docker compose up -d --build
sleep 30
docker compose ps
```
- **Expected PASS:** All services healthy after fresh build
- **Expected FAIL:** Build errors or services fail to start

---

## 🎯 Level 2 Requirements (2.0 points)

### Task 2.1: Backend Replication (Level 2)

**Requirement:** Backend service scaled to multiple containers.

#### Test 2.1.1: Multiple Backend Containers
```bash
docker compose ps | grep -c backend
```
- **Expected PASS:** Shows 3 backend containers (backend1, backend2, backend3)
- **Expected FAIL:** Only 1 backend container

#### Test 2.1.2: Each Backend Has Different Instance ID
```bash
docker compose exec backend1 sh -c 'echo $INSTANCE_ID'
docker compose exec backend2 sh -c 'echo $INSTANCE_ID'
docker compose exec backend3 sh -c 'echo $INSTANCE_ID'
```
- **Expected PASS:** Shows "backend-1", "backend-2", "backend-3" respectively
- **Expected FAIL:** Same ID or empty

#### Test 2.1.3: All Backends Are Healthy
```bash
docker compose ps | grep backend | awk '{print $3}' | grep -c "healthy\|Up"
```
- **Expected PASS:** Shows 3 (all healthy)
- **Expected FAIL:** Less than 3 healthy

---

### Task 2.2: Load Balancing (Level 2)

**Requirement:** Load balancer distributes requests across backend replicas.

#### Test 2.2.1: Nginx Config Has Upstream
```bash
grep -A5 "upstream" nginx/nginx.conf
```
- **Expected PASS:** Contains `upstream backend_cluster` with 3 server entries
- **Expected FAIL:** Missing upstream or only 1 server

#### Test 2.2.2: Nginx Uses Load Balancing Algorithm
```bash
grep "least_conn\|round_robin\|ip_hash" nginx/nginx.conf
```
- **Expected PASS:** Uses `least_conn` or `round_robin`
- **Expected FAIL:** No load balancing algorithm

#### Test 2.2.3: Requests Distributed Across Backends
```bash
# Send 30 requests and check logs
for i in {1..30}; do curl -s http://localhost:3000/api/health > /dev/null; done
sleep 2
echo "Backend-1 hits: $(docker compose logs backend1 2>&1 | grep -c 'GET /api/health')"
echo "Backend-2 hits: $(docker compose logs backend2 2>&1 | grep -c 'GET /api/health')"
echo "Backend-3 hits: $(docker compose logs backend3 2>&1 | grep -c 'GET /api/health')"
```
- **Expected PASS:** All 3 backends receive requests (distribution ~8-12 each)
- **Expected FAIL:** Only 1 or 2 backends receive requests

#### Test 2.2.4: Nginx Routes Through Load Balancer
```bash
# Test 10 requests, check they go through nginx (port 3000)
for i in {1..10}; do curl -s http://localhost:3000/api/health > /dev/null; done
```
- **Expected PASS:** All requests succeed via nginx port 3000
- **Expected FAIL:** Requests fail

---

### Task 2.3: Message Broker (Level 2)

**Requirement:** Redis service running as message broker.

#### Test 2.3.1: Redis Container Running
```bash
docker compose ps redis
```
- **Expected PASS:** Shows redis container healthy
- **Expected FAIL:** Redis not running

#### Test 2.3.2: Redis Accepting Commands
```bash
docker compose exec redis redis-cli ping
```
- **Expected PASS:** Returns `PONG`
- **Expected FAIL:** Connection refused or error

#### Test 2.3.3: Redis Port Exposed
```bash
docker compose ps redis | grep "6379"
```
- **Expected PASS:** Shows port 6379 mapped
- **Expected FAIL:** Port not exposed

---

### Task 2.4: Service Decoupling - Async Worker (Level 2)

**Requirement:** Worker service consumes messages from Redis queue.

#### Test 2.4.1: Worker Containers Running
```bash
docker compose ps | grep worker
```
- **Expected PASS:** Shows worker1 and worker2 containers
- **Expected FAIL:** No worker containers

#### Test 2.4.2: Workers Connected to Redis
```bash
docker compose logs worker1 --tail 5 2>&1 | grep -i "redis\|connected"
```
- **Expected PASS:** Shows Redis connection message
- **Expected FAIL:** No Redis connection log

#### Test 2.4.3: Workers Waiting for Tasks
```bash
docker compose logs worker1 --tail 10 2>&1 | grep -i "waiting\|ready"
```
- **Expected PASS:** Shows worker waiting message
- **Expected FAIL:** No waiting message

#### Test 2.4.4: Task Creates Notification in Redis

> **Note:** Redis queue will be empty (LLEN=0) because workers use `BLPOP` which CONSUMES and REMOVES the item immediately. To verify, check worker logs instead (Test 2.4.5).

```bash
# Create a task
curl -s -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Async Task","status":"todo","priority":"high"}' > /dev/null
sleep 3
# Check worker logs instead (queue is consumed immediately by BLPOP)
docker compose logs worker1 --tail 20 2>&1 | grep -i "Test Async Task"
```
- **Expected PASS:** Shows processing log for "Test Async Task"
- **Expected FAIL:** No processing log for the task

#### Test 2.4.5: Worker Processes Notification
```bash
# Get current worker logs
docker compose logs worker1 --tail 20 2>&1 | grep -i "received\|processing"
```
- **Expected PASS:** Shows "Received notification" and "Processing notification"
- **Expected FAIL:** No processing logs

#### Test 2.4.6: Notification Processed Successfully
```bash
docker compose logs worker1 --tail 5 2>&1 | grep -i "successfully\|sent"
```
- **Expected PASS:** Shows "Notification sent successfully"
- **Expected FAIL:** No success message

---

### Task 2.5: Backend Publishes to Queue (Level 2)

**Requirement:** Backend publishes task notifications to Redis when tasks are created.

#### Test 2.5.1: Backend Has Redis Publisher
```bash
grep -r "publishTaskNotification\|lpush" backend/src/
```
- **Expected PASS:** Shows Redis publish/lpush implementation
- **Expected FAIL:** No queue publishing code

#### Test 2.5.2: Task Creation Triggers Queue

> **Note:** Queue will be empty because BLPOP consumes immediately. Check worker logs instead.

```bash
# Create task and check worker logs
curl -s -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Queue Test","status":"todo","priority":"medium"}' > /dev/null
sleep 2
docker compose logs worker1 --tail 10 2>&1 | grep -i "Queue Test\|Received"
```
- **Expected PASS:** Shows "Received" or "Queue Test" in worker logs
- **Expected FAIL:** No queue activity in worker logs

---

## 🎯 Level 3 Requirements (1.0 points)

### Task 3.1: Docker Swarm Configuration (Level 3)

**Requirement:** docker-stack.yml exists with Swarm deployment configuration.

#### Test 3.1.1: Docker Stack File Exists
```bash
ls -la docker-stack.yml
```
- **Expected PASS:** File exists
- **Expected FAIL:** File not found

#### Test 3.1.2: Stack File Has Required Services
```bash
grep -E "frontend:|backend:|database:|redis:|nginx:|worker:" docker-stack.yml | wc -l
```
- **Expected PASS:** 6 or more services defined
- **Expected FAIL:** Less than 6 services

#### Test 3.1.3: Stack Has Replicas Configuration
```bash
grep -A1 "replicas:" docker-stack.yml | head -10
```
- **Expected PASS:** Shows replica counts for services
- **Expected FAIL:** No replicas section

#### Test 3.1.4: Stack Has Resource Limits
```bash
grep -E "cpus:|memory:" docker-stack.yml | head -5
```
- **Expected PASS:** Shows CPU and memory limits
- **Expected FAIL:** No resource limits

---

### Task 3.2: Kubernetes Configuration (Level 3)

**Requirement:** Kubernetes manifests exist with deployment configuration.

#### Test 3.2.1: Kubernetes Manifest Exists
```bash
ls -la kubernetes/deployment.yaml
```
- **Expected PASS:** File exists
- **Expected FAIL:** File not found

#### Test 3.2.2: K8s Has Required Deployments
```bash
grep -E "kind: Deployment" kubernetes/deployment.yaml | wc -l
```
- **Expected PASS:** 5+ Deployment resources
- **Expected FAIL:** Less than 5 deployments

#### Test 3.2.3: K8s Has Services
```bash
grep -E "kind: Service" kubernetes/deployment.yaml | wc -l
```
- **Expected PASS:** 4+ Service resources
- **Expected FAIL:** Less than 4 services

#### Test 3.2.4: K8s Has Horizontal Pod Autoscaler
```bash
grep -A2 "kind: HorizontalPodAutoscaler" kubernetes/deployment.yaml
```
- **Expected PASS:** HPA resource defined
- **Expected FAIL:** No HPA

#### Test 3.2.5: K8s Has Ingress
```bash
grep -E "kind: Ingress" kubernetes/deployment.yaml
```
- **Expected PASS:** Ingress resource defined
- **Expected FAIL:** No Ingress

---

### Task 3.3: Orchestration Deployment Ready (Level 3)

**Requirement:** Swarm or K8s deployment documented and ready.

#### Test 3.3.1: ReadMe Documents Swarm Deployment
```bash
grep -A5 "Swarm" ReadMe.txt | head -10
```
- **Expected PASS:** Shows Swarm deployment instructions
- **Expected FAIL:** No Swarm documentation

#### Test 3.3.2: ReadMe Documents Kubernetes Deployment
```bash
grep -A5 "Kubernetes" ReadMe.txt | head -10
```
- **Expected PASS:** Shows K8s deployment instructions
- **Expected FAIL:** No K8s documentation

#### Test 3.3.3: Swarm Deploy Commands Present
```bash
grep "docker stack deploy" ReadMe.txt
```
- **Expected PASS:** Shows stack deploy command
- **Expected FAIL:** No deploy command

---

## 📊 Test Results (Last Run: 2024-09-29)

### ✅ ALL TESTS PASSED

| Test ID | Description | Result | Evidence |
|---------|-------------|--------|----------|
| 1.1.1 | docker-compose.yml exists | ✅ PASS | File exists with services |
| 1.2.1 | Frontend accessible | ✅ PASS | `<title>TaskFlow - Dockerized Task Manager</title>` |
| 1.2.2 | Frontend health | ✅ PASS | `frontend healthy` |
| 1.3.1 | Backend health | ✅ PASS | `status: ok, database: ok, redis: ok` |
| 1.4.3 | Database has data | ✅ PASS | 17 tasks found |
| 2.1.1 | 3 backend replicas | ✅ PASS | backend-1, backend-2, backend-3 all healthy |
| 2.2.1 | Nginx LB config | ✅ PASS | `upstream backend_cluster` + `least_conn` |
| 2.2.3 | LB distribution | ✅ PASS | 18/52/55 requests across 3 backends |
| 2.3.1 | Redis running | ✅ PASS | Container healthy |
| 2.4.1 | Workers running | ✅ PASS | worker-1, worker-2 running |
| 2.4.5 | Worker processing | ✅ PASS | Logs show "Received notification" |
| 2.4.6 | Worker success | ✅ PASS | Logs show "Notification sent successfully" |
| 3.1.1 | docker-stack.yml | ✅ PASS | File exists |
| 3.2.1 | K8s manifests | ✅ PASS | 6 Deployment resources |
| 3.2.4 | HPA configured | ✅ PASS | HorizontalPodAutoscaler found |
| 3.3.1 | Swarm docs | ✅ PASS | Swarm instructions in ReadMe |

---

## ✅ Final Checklist

### Level 1 - Basic Setup (2.0 points)
- [x] **✅ PASS** docker-compose.yml exists with 3+ services
- [x] **✅ PASS** Frontend accessible at http://localhost:8080
- [x] **✅ PASS** Backend API responding at http://localhost:3000/api/health
- [x] **✅ PASS** Database healthy and has sample data (17 tasks)
- [x] **✅ PASS** Frontend can call backend API
- [x] **✅ PASS** All services in same Docker network
- [x] **✅ PASS** Dockerfile uses npm ci, not manual install

**Level 1 Score: 2.0/2.0** ✅

### Level 2 - Advanced Features (1.0 points)
- [x] **✅ PASS** 3 backend replicas running
- [x] **✅ PASS** Nginx load balancer configured with least_conn
- [x] **✅ PASS** Requests distributed across backends (18/52/55)
- [x] **✅ PASS** Redis running as message broker
- [x] **✅ PASS** 2 worker containers running
- [x] **✅ PASS** Workers receive and process notifications
- [x] **✅ PASS** Async task decoupling working (BLPOP consumer)

**Level 2 Score: 1.0/1.0** ✅

### Level 3 - Orchestration (0.5 points)
- [x] **✅ PASS** docker-stack.yml exists with 6 services
- [x] **✅ PASS** Kubernetes manifests exist (6 deployments)
- [x] **✅ PASS** HPA configured in K8s
- [x] **✅ PASS** Swarm/K8s documentation in ReadMe

**Level 3 Score: 0.5/0.5** ✅

### Demo & Presentation (1.0 points)
- [ ] **PENDING** Demo video with sound
- [ ] **PENDING** All team members appear in video
- [ ] **PENDING** Clear explanation of architecture
- [ ] **PENDING** Show load balancing in action
- [ ] **PENDING** Show worker processing tasks

---

## 🧪 Quick Test Script

Run this script for a quick verification:

```bash
#!/bin/bash
echo "=== TaskFlow Quick Test ==="
echo ""

echo "1. Checking Docker Compose..."
docker compose ps | grep -q "healthy" && echo "✓ Docker running" || echo "✗ Docker not healthy"
echo ""

echo "2. Testing Frontend..."
curl -s http://localhost:8080 | grep -q "TaskFlow" && echo "✓ Frontend OK" || echo "✗ Frontend FAIL"
echo ""

echo "3. Testing Backend Health..."
curl -s http://localhost:3000/api/health | grep -q '"database":{"status":"ok"}' && echo "✓ Backend+DB OK" || echo "✗ Backend/DB FAIL"
echo ""

echo "4. Testing Redis..."
docker compose exec redis redis-cli ping | grep -q PONG && echo "✓ Redis OK" || echo "✗ Redis FAIL"
echo ""

echo "5. Testing Workers..."
docker compose ps | grep -q "worker" && echo "✓ Workers running" || echo "✗ Workers missing"
echo ""

echo "6. Testing Load Balancing..."
for i in {1..10}; do curl -s http://localhost:3000/api/health > /dev/null; done
B1=$(docker compose logs backend1 2>&1 | grep -c "GET /api/health")
B2=$(docker compose logs backend2 2>&1 | grep -c "GET /api/health")
B3=$(docker compose logs backend3 2>&1 | grep -c "GET /api/health")
echo "Backend distribution: 1=$B1 2=$B2 3=$B3"
[ "$B1" -gt 0 ] && [ "$B2" -gt 0 ] && [ "$B3" -gt 0 ] && echo "✓ Load balancing OK" || echo "✗ Load balancing FAIL"
echo ""

echo "=== Test Complete ==="
```

---

## 📝 Notes

- All tests should be run with `docker context use desktop-linux`
- Wait 30 seconds after `docker compose up -d --build` for services to be healthy
- If containers fail to start, check logs with `docker compose logs <service-name>`
- For full logs: `docker compose logs -f`

---

**Document Version:** 1.0
**Last Updated:** 2024-09-29
**Course:** Web Programming with NodeJS - 502070
**Instructor:** Mai Van Manh
