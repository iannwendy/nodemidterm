# 🎬 KỊCH BẢN QUAY VIDEO DEMO - TASKFLOW
## Dockerized Node.js Web Application

---

## 📋 THÔNG TIN PROJECT

- **Tên Project:** TaskFlow - Dockerized Task Manager
- **Môn học:** Web Programming with NodeJS - 502070
- **Giảng viên:** Mai Van Manh
- **Công nghệ:** Docker, Node.js, React, MySQL, Redis, Nginx

---

## 🎯 MỤC TIÊU DEMO

Demonstrate đầy đủ 3 levels:
1. **Level 1:** Frontend + Backend + Database (2.0 điểm)
2. **Level 2:** Load Balancing + Redis Queue + Workers (1.0 điểm)
3. **Level 3:** Docker Swarm + Kubernetes (0.5 điểm)

---

## 🎬 KỊCH BẢN CHI TIẾT

### SCENE 1: GIỚI THIỆU (0:00 - 1:00)

**TRƯỚC KHI QUAY:**
- Mở terminal, cd vào project
- Chạy: `docker compose up -d --build`
- Đợi 30 giây cho services healthy
- Mở trình duyệt tại http://localhost:8080

---

**[GÓC MÁY: Màn hình máy tính + Giọng nói]**

**NGƯỜI DẪN CHƯƠNG TRÌNH:**

> "Xin chào everyone! Hôm nay mình sẽ demo project **TaskFlow** - một ứng dụng Dockerized Task Manager được xây dựng với Node.js, React, MySQL và Redis.
>
> Đây là project môn **Web Programming with NodeJS - 502070** dưới sự hướng dẫn của thầy **Mai Van Manh**.
>
> Trong demo này, mình sẽ demonstrate đầy đủ **3 levels** theo yêu cầu của đề bài."

**[CHUYỂN CẢNH: Zoom vào trình duyệt]**

---

### SCENE 2: KIỂM TRA DOCKER CONTAINERS (1:00 - 2:00)

**[GÓC MÁY: Terminal]**

**NGƯỜI DẪN:**
> "Đầu tiên, verify rằng tất cả Docker containers đang chạy."

**THAO TÁC:**
```bash
# Chạy trong terminal
docker compose ps
```

**GIẢI THÍCH (Voiceover):**
> "Các bạn thấy đây, tổng cộng có **9 services** đang chạy:
> - **frontend**: React app served by nginx
> - **nginx**: Load balancer
> - **backend1, backend2, backend3**: 3 Node.js API replicas
> - **redis**: Message broker
> - **worker1, worker2**: Async task processors
> - **database**: MySQL 8"

**ĐIỂM CẦN SHOW:**
- Tất cả containers đều "healthy" hoặc "Up"
- 3 backend replicas
- 2 workers

---

### SCENE 3: LEVEL 1 - FRONTEND (2:00 - 3:30)

**[GÓC MÁY: Trình duyệt - http://localhost:8080]**

**NGƯỜI DẪN:**
> "Bây giờ chúng ta sẽ xem **Level 1** - Basic Docker Setup.
>
> Đây là giao diện **Frontend** của ứng dụng, được xây dựng bằng **React + Vite + Tailwind CSS**.
>
> Frontend được serve bởi **nginx** container trên port **8080**."

**THAO TÁC 1 - Zoom vào Dashboard:**
> "Giao diện bao gồm:
> - **Dashboard Overview**: Hiển thị tổng quan số lượng task
> - **Task List**: Danh sách các task với filter
> - **Floating Action Button**: Để tạo task mới"

**GIẢI THÍCH:**
> "Các bạn thấy dashboard hiển thị:
> - Total Tasks: 17
> - To Do: 11
> - In Progress: 3
> - Done: 3
>
> Đây là dữ liệu được seed tự động từ database."

---

### SCENE 4: LEVEL 1 - BACKEND API (3:30 - 5:00)

**[GÓC MÁY: Terminal mới]**

**NGƯỜI DẪN:**
> "Bây giờ chúng ta test **Backend API**."

**THAO TÁC 1 - Test Health Endpoint:**
```bash
curl -s http://localhost:3000/api/health | python3 -m json.tool
```

**GIẢI THÍCH (Voiceover):**
> "Health endpoint trả về:
> - **status**: ok
> - **database**: connected ✓
> - **redis**: connected ✓
> - **uptime**: thời gian server chạy"

**THAO TÁC 2 - Test Tasks Endpoint:**
```bash
curl -s http://localhost:3000/api/tasks | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Total tasks: {len(d[\"data\"])}')"
```

> "API trả về **17 tasks** từ MySQL database."

**THAO TÁC 3 - Test Stats Endpoint:**
```bash
curl -s http://localhost:3000/api/stats | python3 -m json.tool
```

> "Stats endpoint trả về statistics bao gồm:
> - total, todo, in-progress, done counts
> - high priority count
> - 5 recent tasks"

---

### SCENE 5: LEVEL 1 - CRUD OPERATIONS (5:00 - 7:00)

**[GÓC MÁY: Trình duyệt - http://localhost:8080]**

**NGƯỜI DẪN:**
> "Bây giờ mình sẽ demonstrate **CRUD operations** trên giao diện."

#### CREATE - Tạo Task mới

**THAO TÁC:**
1. Click vào **nút "+"** ở góc phải dưới màn hình
2. Điền thông tin:
   - Title: "Demo Task - Level 1"
   - Description: "Testing CRUD operations"
   - Status: To Do
   - Priority: High
3. Click **"Create Task"**

**GIẢI THÍCH (Voiceover):**
> "Khi click Create Task:
> 1. Frontend gửi POST request đến Backend API
> 2. Backend lưu vào MySQL database
> 3. Backend publish notification đến Redis queue
> 4. Worker consume message và xử lý async"

**VERIFY:**
- Task mới xuất hiện trong danh sách
- Dashboard total tăng lên 18

#### READ - Xem Task

**THAO TÁC:**
1. Click vào một task bất kỳ
2. Verify thông tin hiển thị đúng

#### UPDATE - Cập nhật Task

**THAO TÁC:**
1. Click vào **"Start"** button trên một task có status "To Do"
2. Verify status chuyển sang "In Progress"
3. Click **"Complete"** để chuyển sang "Done"

**GIẢI THÍCH:**
> "Update được thực hiện qua PUT /api/tasks/:id endpoint."

#### DELETE - Xóa Task

**THAO TÁC:**
1. Click vào **icon trash** trên task vừa tạo
2. Confirm delete
3. Verify task biến mất khỏi danh sách

**GIẢI THÍCH:**
> "Delete được thực hiện qua DELETE /api/tasks/:id endpoint."

---

### SCENE 6: LEVEL 1 - DATABASE (7:00 - 8:00)

**[GÓC MÁY: Terminal]**

**NGƯỜI DẪN:**
> "Verify rằng data được persist trong **MySQL database**."

**THAO TÁC:**
```bash
# Check database
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; SELECT COUNT(*) FROM tasks;"
```

**GIẢI THÍCH:**
> "Database đang có 17 tasks. Dữ liệu được persist qua Docker volume."

**THAO TÁC:**
```bash
# Show table structure
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; DESCRIBE tasks;"
```

> "Table structure với các columns: id, title, description, status, priority, created_at, updated_at"

---

### SCENE 7: LEVEL 2 - LOAD BALANCING (8:00 - 10:00)

**[GÓC MÁY: Split screen - Terminal + Trình duyệt]**

**NGƯỜI DẪN:**
> "Bây giờ chúng ta sẽ demonstrate **Level 2** - Advanced Features.
>
> Đầu tiên là **Load Balancing**."

#### 7.1 - Show Nginx Config

**[GÓC MÁY: Terminal]**

**THAO TÁC:**
```bash
cat nginx/nginx.conf | grep -A10 "upstream"
```

**GIẢI THÍCH:**
> "Nginx được cấu hình với **upstream backend_cluster** sử dụng thuật toán **least_conn**.
>
> Load balancer phân phối requests đến 3 backend replicas:
> - backend1:3000
> - backend2:3000
> - backend3:3000"

#### 7.2 - Test Load Balancing Distribution

**THAO TÁC:**
```bash
# Send 30 requests
for i in {1..30}; do curl -s http://localhost:3000/api/health > /dev/null; done

# Check logs
echo "Backend 1:" && docker compose logs backend1 2>&1 | grep -c "GET /api"
echo "Backend 2:" && docker compose logs backend2 2>&1 | grep -c "GET /api"
echo "Backend 3:" && docker compose logs backend3 2>&1 | grep -c "GET /api"
```

**GIẢI THÍCH:**
> "Các bạn thấy đấy, **30 requests** được phân phối đều qua cả 3 backend replicas.
>
> Điều này prove rằng **nginx load balancer** đang hoạt động."

#### 7.3 - Show Different Instance IDs

**THAO TÁC:**
```bash
docker compose exec backend1 sh -c 'echo $INSTANCE_ID'
docker compose exec backend2 sh -c 'echo $INSTANCE_ID'
docker compose exec backend3 sh -c 'echo $INSTANCE_ID'
```

> "Mỗi backend instance có **INSTANCE_ID** khác nhau để identify."

---

### SCENE 8: LEVEL 2 - REDIS QUEUE (10:00 - 12:00)

**[GÓC MÁY: Terminal]**

**NGƯỜI DẪN:**
> "Tiếp theo là **Redis Message Broker** và **Worker Service**."

#### 8.1 - Verify Redis Running

**THAO TÁC:**
```bash
docker compose ps redis
docker compose exec redis redis-cli ping
```

**GIẢI THÍCH:**
> "Redis đang chạy và respond PONG."

#### 8.2 - Show Worker Code

**[GÓC MÁY: Code Editor hoặc Terminal]**

**THAO TÁC:**
```bash
cat worker/src/worker.js | grep -A10 "BLPOP"
```

**GIẢI THÍCH:**
> "Worker sử dụng **BLPOP** (Blocking Left POP) để consume messages từ Redis queue 'task:notifications'.
>
> Khi có message, worker xử lý và simulate gửi notification."

#### 8.3 - Show Backend Publishes

**THAO TÁC:**
```bash
grep -A5 "publishTaskNotification" backend/src/routes/tasks.js
```

**GIẢI THÍCH:**
> "Khi task được tạo, backend **publish notification** đến Redis queue.
>
> Đây là ví dụ về **service decoupling** - task creation không phải đợi notification được gửi."

#### 8.4 - Live Demo - Create Task and Watch Worker

**[GÓC MÁY: Split - Terminal (worker logs) + Trình duyệt]**

**THAO TÁC:**
1. Mở terminal mới, chạy:
   ```bash
   docker compose logs -f worker1
   ```

2. Trên trình duyệt, tạo task mới:
   - Title: "Live Demo Task"
   - Click Create

3. Quan sát worker logs

**GIẢI THÍCH (Voiceover):**
> "Các bạn thấy không:
> 1. Task được tạo thành công ✓
> 2. Worker logs hiển thị:
>    - `Received notification: TASK_NOTIFICATION`
>    - `Processing notification for task: [id]`
>    - `Title: Live Demo Task`
>    - `Notification sent successfully` ✓
>
> Điều này prove rằng **async notification** đang hoạt động qua **Redis queue**."

---

### SCENE 9: LEVEL 3 - DOCKER SWARM (12:00 - 14:00)

**[GÓC MÁY: Terminal]**

**NGƯỜI DẪN:**
> "Cuối cùng là **Level 3** - Container Orchestration."

#### 9.1 - Show Docker Stack File

**THAO TÁC:**
```bash
cat docker-stack.yml
```

**GIẢI THÍCH:**
> "File **docker-stack.yml** cấu hình đầy đủ cho Docker Swarm:
> - 6 services: frontend, nginx, backend1/2/3, redis, worker, database
> - Replicas configuration
> - Resource limits (CPU, Memory)
> - Health checks
> - Networks và volumes"

#### 9.2 - Show Swarm Deployment Commands

**THAO TÁC:**
```bash
grep -A3 "docker stack" ReadMe.txt
```

> "Deploy với commands:
> - `docker swarm init`
> - `docker stack deploy -c docker-stack.yml taskflow`"

#### 9.3 - Scale Command

**THAO TÁC:**
```bash
echo "Scale backend: docker service scale taskflow_backend=5"
echo "Scale frontend: docker service scale taskflow_frontend=3"
```

> "Swarm cho phép scale services dễ dàng với `docker service scale`."

---

### SCENE 10: LEVEL 3 - KUBERNETES (14:00 - 16:00)

**[GÓC MÁY: Terminal]**

**NGƯỜI DẪN:**
> "Ngoài Swarm, project còn có **Kubernetes manifests**."

#### 10.1 - Show Kubernetes Manifests

**THAO TÁC:**
```bash
ls -la kubernetes/
grep -c "kind: Deployment" kubernetes/deployment.yaml
grep -c "kind: Service" kubernetes/deployment.yaml
```

**GIẢI THÍCH:**
> "Kubernetes deployment bao gồm:
> - **6 Deployments**: mysql, redis, backend, worker, nginx, frontend
> - **4 Services**: mysql-svc, redis-svc, backend-svc, nginx-svc
> - **ConfigMaps & Secrets**
> - **Horizontal Pod Autoscaler (HPA)**
> - **Ingress**"

#### 10.2 - Show HPA Configuration

**THAO TÁC:**
```bash
grep -A15 "HorizontalPodAutoscaler" kubernetes/deployment.yaml
```

**GIẢI THÍCH:**
> "HPA configured để auto-scale backend từ **2 đến 10 replicas** khi CPU usage > 70%."

#### 10.3 - Kubernetes Deployment Commands

**THAO TÁC:**
```bash
grep -A5 "kubectl apply" ReadMe.txt
```

> "Deploy với Kubernetes:
> - `kubectl apply -f kubernetes/deployment.yaml`
> - Scale: `kubectl scale deployment backend --replicas=5`"

---

### SCENE 11: ARCHITECTURE OVERVIEW (16:00 - 17:00)

**[GÓC MÁY: Diagram/Slide]**

**NGƯỜI DẪN:**
> "Tổng kết architecture của hệ thống:

```
                    ┌─────────────────┐
                    │     CLIENT      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   NGINX (LB)    │  Port 3000
                    │   least_conn    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐          ┌────▼────┐          ┌────▼────┐
   │backend-1│          │backend-2│          │backend-3│
   │ :3000   │          │ :3000   │          │ :3000   │
   └────┬────┘          └────┬────┘          └────┬────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
         ┌────▼────┐                  ┌────▼────┐
         │  MySQL   │                  │  Redis  │
         │ :3306    │                  │  :6379  │
         └──────────┘                  └────┬────┘
                                           │
                               ┌───────────┴───────────┐
                               │                       │
                          ┌────▼────┐             ┌────▼────┐
                          │ worker-1│             │ worker-2│
                          └─────────┘             └─────────┘

Frontend: React + Vite → nginx → Port 8080
```

> **Data Flow:**
> 1. Client → Nginx (Load Balancer) → Backend replicas
> 2. Backend → MySQL (CRUD operations)
> 3. Backend → Redis (Publish notification)
> 4. Redis → Workers (BLPOP - consume queue)
> 5. Workers → Process notifications (async)"

---

### SCENE 12: KẾT LUẬN (17:00 - 18:00)

**[GÓC MÁY: Màn hình đen với text]**

**NGƯỜI DẪN:**
> "**Tổng kết những gì đã demonstrate:**
>
> ✅ **Level 1** (2.0 điểm):
> - Docker Compose với 9 services
> - Frontend React accessible
> - Backend Node.js API responding
> - MySQL database working với seed data
> - Full CRUD operations
>
> ✅ **Level 2** (1.0 điểm):
> - 3 backend replicas
> - Nginx load balancing (least_conn)
> - Redis message broker
> - 2 worker services
> - Async task decoupling
>
> ✅ **Level 3** (0.5 điểm):
> - Docker Swarm stack configuration
> - Kubernetes manifests với HPA
> - Orchestration deployment documented
>
> **Điểm tối đa đạt được: 4.5/4.5 điểm**
>
> Cảm ơn mọi người đã theo dõi! 🎬"

---

## 📝 GHI CHÚ CHO NGƯỜI QUAY

### Chuẩn bị trước khi quay:
1. ✅ Restart Docker: `docker compose down && docker compose up -d --build`
2. ✅ Đợi 30-60 giây cho services healthy
3. ✅ Mở 3 terminal windows:
   - Terminal 1: `docker compose ps`
   - Terminal 2: `docker compose logs -f`
   - Terminal 3: Để chạy commands
4. ✅ Mở trình duyệt http://localhost:8080
5. ✅ Chuẩn bị sẵn code editor để show code nếu cần

### Tips quay video:
- 🎤 Nói rõ ràng, không quá nhanh
- ⏱️ Tổng thời gian: 15-20 phút
- 🎯 Show evidence: containers, logs, UI response
- 📱 Nếu có multi-cam: 1 cam góc rộng + 1 cam focus vào màn hình

### Lỗi thường gặp:
- ❌ Services chưa healthy → Đợi thêm hoặc restart
- ❌ Worker không nhận task → Check Redis connection
- ❌ Load balancing không work → Restart nginx container

---

## 🔗 LINKS CẦN NHỚ

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:8080 | React UI |
| API via Nginx | http://localhost:3000 | Load Balanced API |
| Backend Health | http://localhost:3000/api/health | Health Check |
| Tasks API | http://localhost:3000/api/tasks | Tasks CRUD |
| Stats API | http://localhost:3000/api/stats | Dashboard Stats |
| Redis CLI | `docker compose exec redis redis-cli` | Redis Terminal |

---

## 📋 COMMANDS ĐỂ TEST NHANH

```bash
# 1. Start all services
docker compose up -d --build

# 2. Wait 30 seconds
sleep 30

# 3. Check status
docker compose ps

# 4. Test Level 1
curl http://localhost:8080  # Frontend
curl http://localhost:3000/api/health  # Backend health
curl http://localhost:3000/api/tasks  # Get tasks

# 5. Test Level 2
for i in {1..30}; do curl http://localhost:3000/api/health > /dev/null; done  # Load test
docker compose logs worker1 --tail 20  # Check worker

# 6. Test Level 3
cat docker-stack.yml  # Swarm config
cat kubernetes/deployment.yaml  # K8s config
```

---

**Script Version:** 1.0
**Last Updated:** 2024-09-29
**Course:** Web Programming with NodeJS - 502070
**Instructor:** Mai Van Manh
