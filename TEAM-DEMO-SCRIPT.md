# 🎬 KỊCH BẢN DEMO VIDEO - 3 NGƯỜI
## TaskFlow - Dockerized Node.js Web Application

> **Mục tiêu:** Chia đều phần trình bày cho 3 thành viên, tổng thời gian ~17-18 phút, đảm bảo mỗi người nói khoảng 5-6 phút.
>
> **Nguyên tắc:** Mỗi người tự quay màn hình + giọng của mình. Có thể ghép video cuối cùng bằng CapCut/Premiere. Mỗi người cần thấy mặt + nghe giọng (kết hợp webcam + screen share).

---

## 📋 THÔNG TIN CHUNG

| Mục | Chi tiết |
|-----|----------|
| **Project** | TaskFlow - Dockerized Task Manager |
| **Môn học** | Web Programming with NodeJS - 502070 |
| **Stack** | Docker, Node.js, React, MySQL, Redis, Nginx, Docker Swarm, Kubernetes |
| **Tổng thời gian** | ~17 phút (3 × ~5-6 phút) |
| **Yêu cầu chung** | Mỗi người phải xuất hiện + nói tiếng Anh (hoặc song ngữ EN-VN) |

---

## 🎯 PHÂN CHIA THEO NGƯỜI

| Người | Phụ trách | Thời gian | Nội dung chính |
|-------|-----------|-----------|----------------|
| **Người 1 - Leader** | Intro + Level 1 (Backend/Database) | 0:00 - 6:00 | Giới thiệu, kiểm tra containers, test API, MySQL |
| **Người 2 - Frontend** | Level 1 (UI/CRUD) + Level 2 (Load Balancer) | 6:00 - 12:00 | Demo giao diện, CRUD qua UI, Load Balancing test |
| **Người 3 - Orchestration** | Level 2 (Redis/Worker) + Level 3 (Swarm/K8s) + Kết luận | 12:00 - 17:30 | Redis queue, worker logs, Swarm/K8s, tổng kết |

---

## 🔧 CHUẨN BỊ CHUNG CHO CẢ 3 NGƯỜI

### Trước khi quay (mỗi người phải làm)

1. **Khởi động Docker Desktop** và đợi biểu tượng xanh
2. **Mở 2-3 terminal windows** (cửa sổ terminal)
3. **Cd vào thư mục project:**
   ```bash
   cd /Users/iannwendy/Desktop/NodeMidterm      # Mac/Linux
   cd C:\Users\<YourName>\Desktop\NodeMidterm   # Windows
   ```
4. **Start tất cả services:**
   ```bash
   docker compose up -d --build
   ```
5. **Đợi 60 giây** cho services healthy
6. **Verify mọi thứ sẵn sàng:**
   ```bash
   docker compose ps
   ```
   → Tất cả phải "Up" hoặc "healthy"

### Mở sẵn các cửa sổ

| Cửa sổ | Mở gì | Dùng để |
|--------|--------|---------|
| Terminal A | Project root | Chạy lệnh docker |
| Terminal B | `docker compose logs -f` | Xem logs real-time |
| Browser | http://localhost:8080 | Frontend UI |
| Browser (tab 2) | http://localhost:3000/api/health | API |
| Code editor | VSCode mở project | Show code khi cần |

### Lỗi thường gặp & fix nhanh

| Lỗi | Cách xử lý |
|-----|-----------|
| Service không healthy | `docker compose restart <service_name>` |
| Port 8080/3000 bị chiếm | `lsof -i :8080` (Mac) / `netstat -ano | findstr :8080` (Win) |
| Frontend trắng trang | Clear cache + `docker compose restart frontend` |
| Worker không nhận message | `docker compose logs worker1` xem lỗi |
| MySQL chưa ready | Đợi thêm 30s, MySQL init lần đầu rất chậm |

---

# 👤 NGƯỜI 1 - LEADER (INTRO + LEVEL 1 BACKEND)
## Thời gian: 0:00 - 6:00 (6 phút)

### Mục tiêu
- Giới thiệu project, thành viên
- Verify Docker containers
- Test Backend API endpoints
- Verify MySQL database

### Phần 1: Giới thiệu (0:00 - 1:30) ⭐ 90 giây

**[GÓC MÁY: Webcam (full màn hình) + bật cam nhỏ góc dưới]**

**Hành động:** Mở slide/sơ đồ kiến trúc hoặc nói trực tiếp vào camera.

**Script tiếng Anh (đọc nguyên văn):**

> "Hello everyone! My name is **[tên của bạn]**, and today I'm going to present our **NodeJS Mid-term project** for course **502070 - Web Programming with NodeJS**, taught by instructor **Mai Van Manh**.
>
> Our project is called **TaskFlow** - a Dockerized Task Manager built with **Node.js, React, MySQL, Redis, and Nginx**.
>
> We are a team of **3 members**: [tên người 2] will present the frontend and load balancing, and [tên người 3] will present the Redis queue and container orchestration.
>
> In this demo, we will cover all **3 levels** required by the assignment: Level 1 with basic Docker setup, Level 2 with load balancing and message broker, and Level 3 with Docker Swarm and Kubernetes orchestration."

**[Hành động:]** Vẫy tay chào → chuyển sang màn hình terminal.

---

### Phần 2: Kiểm tra Docker Containers (1:30 - 2:30) ⭐ 60 giây

**[GÓC MÁY: Terminal A - toàn màn hình]**

**Hành động:** Chạy lệnh `docker compose ps`, zoom to cho mọi người thấy.

**Lệnh (Mac/Linux - zsh/bash):**
```bash
docker compose ps
```

**Lệnh (Windows - PowerShell):**
```powershell
docker compose ps
```

**Script:**

> "Let's first verify that all Docker containers are running properly. I'm running `docker compose ps` to list all services."

**Giải thích khi nhìn vào output:**

> "As you can see, we have **8 services** all running:
> - **taskflow-frontend** - the React UI exposed on port **8080**
> - **taskflow-nginx** - the load balancer on port **3000**
> - **taskflow-backend-1, backend-2, backend-3** - three Node.js API replicas
> - **taskflow-redis** - the message broker
> - **taskflow-worker-1, worker-2** - two async workers
> - **taskflow-database** - MySQL 8 on port **3306**
>
> All services are in **healthy** or **Up** state, meaning our infrastructure is ready."

---

### Phần 3: Test Backend API (2:30 - 4:30) ⭐ 120 giây

**[GÓC MÁY: Terminal A]**

#### 3.1 - Health Check

**Lệnh (Mac/Linux):**
```bash
curl -s http://localhost:3000/api/health | python3 -m json.tool
```

**Lệnh (Windows PowerShell):**
```powershell
curl http://localhost:3000/api/health | ConvertFrom-Json | ConvertTo-Json
```

**Script:**

> "Now let's test the backend API. First, the **health endpoint**."

**Giải thích output:**

> "The health endpoint returns:
> - **status**: ok
> - **instance**: backend-1 - this is the unique ID that helps us verify load balancing later
> - **database**: connected
> - **redis**: connected
> - **uptime**: showing how long the server has been running"

#### 3.2 - Get All Tasks

**Lệnh (Mac/Linux):**
```bash
curl -s http://localhost:3000/api/tasks | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Total tasks: {len(d.get(\"data\", d))}')"
```

**Lệnh (Windows PowerShell):**
```powershell
(Invoke-RestMethod http://localhost:3000/api/tasks).data.Count
```

**Script:**

> "Next, we fetch all tasks. There are **21 sample tasks** that were loaded from the database initialization script when MySQL first started."

#### 3.3 - Get Statistics

**Lệnh (Mac/Linux):**
```bash
curl -s http://localhost:3000/api/stats | python3 -m json.tool
```

**Lệnh (Windows PowerShell):**
```powershell
Invoke-RestMethod http://localhost:3000/api/stats | ConvertTo-Json
```

**Script:**

> "The statistics endpoint shows the distribution of tasks by status and priority - this data powers the dashboard."

---

### Phần 4: Verify MySQL Database (4:30 - 6:00) ⭐ 90 giây

**[GÓC MÁY: Terminal A]**

**Lệnh (Mac/Linux):**
```bash
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; SELECT COUNT(*) AS total, status FROM tasks GROUP BY status;"
```

**Lệnh (Windows PowerShell):**
```powershell
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; SELECT COUNT(*) AS total, status FROM tasks GROUP BY status;"
```

**Script:**

> "Let's verify the data is actually persisted in MySQL."

**Lệnh tiếp - xem cấu trúc bảng (Mac/Linux & Windows giống nhau):**
```bash
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; DESCRIBE tasks;"
```

**Script:**

> "The table has columns: id, title, description, status, priority, created_at, and updated_at. The data is persisted through the Docker volume **taskflow-mysql**."

> "That's the end of my section. Now [tên người 2] will demonstrate the frontend interface and CRUD operations."

**[Hành động:]** Cười, gật đầu, chuyển quyền cho người 2.

---

### ✅ Checklist cho Người 1 trước khi quay

- [ ] Docker Desktop đang chạy
- [ ] Tất cả containers `Up`/`healthy`
- [ ] Terminal đã mở ở đúng thư mục project
- [ ] Đã test chạy thử 3 lệnh curl trên
- [ ] Đã thử lệnh mysql exec - không bị lỗi password
- [ ] Webcam sẵn sàng + mic test OK
- [ ] Có slide/kiến trúc diagram để show ở phần intro

---

# 👤 NGƯỜI 2 - FRONTEND & LOAD BALANCING
## Thời gian: 6:00 - 12:00 (6 phút)

### Mục tiêu
- Demo giao diện React
- Test CRUD qua UI
- Demonstrate Load Balancing qua Nginx

### Phần 1: Frontend Overview (6:00 - 7:00) ⭐ 60 giây

**[GÓC MÁY: Browser - http://localhost:8080 - toàn màn hình]**

**Hành động:** Mở trình duyệt, navigate tới http://localhost:8080, đợi load xong.

**Script:**

> "Hi, I'm **[tên của bạn]**. Now let's look at the **frontend**, which is a **React SPA** served by nginx on port **8080**.
>
> The dashboard shows the total task count, distribution by status - To Do, In Progress, and Done - and recent activity. This data is fetched from the backend through the load balancer."

**Hành động:** Di chuột vào các số liệu trên dashboard, giải thích từng phần.

---

### Phần 2: CREATE - Tạo Task Mới (7:00 - 8:15) ⭐ 75 giây

**[GÓC MÁY: Browser]**

**Hành động:**
1. Click nút **"+"** (floating action button) ở góc phải dưới
2. Modal hiện ra, điền:
   - **Title:** "Demo by [tên bạn] - Level 1"
   - **Description:** "Testing CRUD via UI"
   - **Status:** To Do
   - **Priority:** High
3. Click **"Create Task"**

**Script:**

> "Now I'll demonstrate the **CREATE** operation. I'll click the **plus button** to open the create modal.
>
> I fill in the title, description, status, and priority, then click Create.
>
> Behind the scenes:
> 1. The frontend sends a **POST request** to `/api/tasks`
> 2. The request goes through **Nginx load balancer** on port 3000
> 3. Nginx routes it to one of the **3 backend replicas**
> 4. The backend saves it to **MySQL**
> 5. The backend also publishes a **notification** to **Redis** for async processing
>
> The new task appears in the list immediately."

**Hành động:** Verify task mới xuất hiện ở đầu danh sách, dashboard count tăng lên 22.

---

### Phần 3: UPDATE & DELETE (8:15 - 9:30) ⭐ 75 giây

**[GÓC MÁY: Browser]**

#### UPDATE

**Hành động:**
1. Tìm task vừa tạo
2. Click **"Start"** (status chuyển sang In Progress)
3. Click **"Complete"** (chuyển sang Done)

**Script:**

> "For **UPDATE**, I click **Start** to change the status from To Do to In Progress, then **Complete** to mark it as Done."

#### DELETE

**Hành động:**
1. Tìm task vừa tạo
2. Click icon **thùng rác** (trash icon)
3. Confirm delete

**Script:**

> "For **DELETE**, I click the trash icon and confirm. The task is removed via a **DELETE request** to the API."

**Hành động:** Verify task biến mất khỏi danh sách, count giảm về 21.

---

### Phần 4: Load Balancing Demo (9:30 - 12:00) ⭐ 150 giây

**[GÓC MÁY: Terminal A]**

#### 4.1 - Show Nginx Configuration

**Lệnh (Mac/Linux):**
```bash
cat nginx/nginx.conf | grep -A12 "upstream backend_cluster"
```

**Lệnh (Windows PowerShell):**
```powershell
Get-Content nginx/nginx.conf | Select-String -Pattern "upstream backend_cluster" -Context 0,12
```

**Script:**

> "Now let's prove that **load balancing** is working. First, let me show you the **Nginx configuration**."

**Giải thích:**

> "Nginx is configured with an **upstream block** called `backend_cluster` using the **least_conn** algorithm - meaning it routes each request to the backend with the fewest active connections.
>
> We have **3 backend instances**: backend-1, backend-2, and backend-3, each with their own container name."

#### 4.2 - Test Load Distribution

**Lệnh (Mac/Linux - zsh/bash):**
```bash
for i in {1..15}; do curl -s http://localhost:3000/api/health | grep -o '"instance":"[^"]*"'; done | sort | uniq -c
```

**Lệnh (Windows PowerShell):**
```powershell
1..15 | ForEach-Object { 
    (Invoke-WebRequest http://localhost:3000/api/health -UseBasicParsing).Content | Select-String -Pattern '"instance":"[^"]*"' 
} | Group-Object | Select-Object Name, Count
```

**Script:**

> "Now I'll send **15 health check requests** in a loop, and each time the response includes the **instance ID** of the backend that handled the request."

**Hành động:** Chạy lệnh, đợi kết quả hiển thị. Output sẽ như:
```
   3 backend-1
   5 backend-2
   7 backend-3
```

**Giải thích:**

> "Look at the result - the requests are **distributed across all 3 backends**. This proves that **Nginx load balancing** is working correctly with the `least_conn` algorithm."

#### 4.3 - Show Backend Instance IDs

**Lệnh (Mac/Linux & Windows):**
```bash
docker compose exec taskflow-backend-1 sh -c 'echo $INSTANCE_ID'
docker compose exec taskflow-backend-2 sh -c 'echo $INSTANCE_ID'
docker compose exec taskflow-backend-3 sh -c 'echo $INSTANCE_ID'
```

**Script:**

> "Each backend container has a unique **INSTANCE_ID** environment variable. As you can see, backend-1, backend-2, and backend-3 all respond with their own IDs."

> "That's the end of my section. Now [tên người 3] will show you the **Redis queue**, **worker processing**, and **container orchestration**."

**[Hành động:]** Chuyển quyền cho người 3.

---

### ✅ Checklist cho Người 2 trước khi quay

- [ ] Frontend load OK tại localhost:8080
- [ ] Đã thử create 1 task test (xóa sau khi quay)
- [ ] Biết chính xác vị trí nút +, Start, Complete, trash icon
- [ ] Test lệnh `for` loop (Mac) hoặc PowerShell loop (Windows) chạy đúng
- [ ] Nginx config file `nginx/nginx.conf` đã mở sẵn trong editor
- [ ] Webcam + mic OK

---

# 👤 NGƯỜI 3 - REDIS, WORKER & ORCHESTRATION
## Thời gian: 12:00 - 17:30 (5.5 phút)

### Mục tiêu
- Verify Redis đang chạy
- Show worker code
- Demo real-time: tạo task → worker nhận notification
- Show Docker Swarm + Kubernetes configs
- Kết luận

### Phần 1: Verify Redis (12:00 - 12:45) ⭐ 45 giây

**[GÓC MÁY: Terminal A]**

**Hành động:** Chạy lệnh ping Redis.

**Lệnh (Mac/Linux & Windows):**
```bash
docker compose ps taskflow-redis
docker compose exec taskflow-redis redis-cli ping
```

**Script:**

> "Hi, I'm **[tên của bạn]**. Now let's look at the **Redis message broker**.
>
> Running `docker compose ps` shows the Redis container is running. And `redis-cli ping` returns **PONG**, meaning Redis is healthy and accepting connections."

---

### Phần 2: Show Worker Code (12:45 - 13:45) ⭐ 60 giây

**[GÓC MÁY: VSCode hoặc Terminal]**

**Hành động:** Mở file `worker/src/worker.js` trong editor (hoặc dùng `cat`).

**Lệnh (Mac/Linux):**
```bash
cat worker/src/worker.js | grep -A15 "BLPOP\|blpop"
```

**Lệnh (Windows PowerShell):**
```powershell
Get-Content worker/src/worker.js | Select-String -Pattern "BLPOP" -Context 0,15
```

**Script:**

> "Here's the **worker code**. It uses the **BLPOP command** - **Blocking Left Pop** - to consume messages from the Redis queue.
>
> BLPOP waits up to 5 seconds if the queue is empty, then continues looping. This is **non-blocking async processing** - the worker doesn't waste CPU when there's no work."

---

### Phần 3: Backend Publishes to Redis (13:45 - 14:30) ⭐ 45 giây

**[GÓC MÁY: Terminal]**

**Lệnh (Mac/Linux):**
```bash
grep -rn "publish\|lpush\|rpush" backend/src/ | head -10
```

**Lệnh (Windows PowerShell):**
```powershell
Get-ChildItem -Path backend/src -Recurse -Filter *.js | Select-String -Pattern "publish|lpush|rpush" | Select-Object -First 10
```

**Script:**

> "On the backend side, when a task is created or updated, the code publishes a **notification message** to the Redis queue. This is **service decoupling** - the API doesn't wait for the notification to be sent."

---

### Phần 4: Live Demo - Worker Xử Lý Task (14:30 - 15:30) ⭐ 60 giây

**[GÓC MÁY: Terminal B (logs) + Browser (chia đôi nếu được)]**

**Bước 1:** Mở Terminal B, chạy lệnh xem worker logs:

**Lệnh (Mac/Linux & Windows):**
```bash
docker compose logs -f worker1
```

**Bước 2:** Quay lại browser, tạo task mới:
- Title: "Live Demo by [tên bạn]"
- Click Create

**Bước 3:** Quay lại Terminal B, show log output.

**Script:**

> "Now let's see this in action. I'll open the worker logs in this terminal, then create a new task in the browser."

**Hành động:** Sau khi tạo task, Terminal B sẽ hiển thị log tương tự:
```
worker1  | [INFO] Received notification: TASK_NOTIFICATION
worker1  | [INFO] Processing notification for task: <id>
worker1  | [INFO] Title: Live Demo by [tên bạn]
worker1  | [INFO] Notification sent successfully
```

**Script:**

> "Look at the logs - the worker received the notification, processed it, and reported success. This proves the **async pipeline** is working: **API → Redis → Worker**."

---

### Phần 5: Docker Swarm (Level 3) (15:30 - 16:15) ⭐ 45 giây

**[GÓC MÁY: Terminal]**

**Lệnh (Mac/Linux & Windows):**
```bash
cat docker-stack.yml | head -50
```

**Script:**

> "For **Level 3**, we have a **Docker Swarm stack file** - `docker-stack.yml`."

**Lệnh tiếp:**
```bash
grep -A2 "replicas:" docker-stack.yml
```

**Script:**

> "It defines services with replica counts, resource limits, and health checks. To deploy, you would run:
> - `docker swarm init`
> - `docker stack deploy -c docker-stack.yml taskflow`
> - `docker service scale taskflow_backend=5` to scale up
>
> The same stack can be deployed locally to demonstrate orchestration."

---

### Phần 6: Kubernetes (Level 3) (16:15 - 16:50) ⭐ 35 giây

**[GÓC MÁY: Terminal]**

**Lệnh (Mac/Linux & Windows):**
```bash
ls kubernetes/
grep -c "kind: Deployment" kubernetes/deployment.yaml
grep -c "kind: Service" kubernetes/deployment.yaml
```

**Script:**

> "For Kubernetes, we have manifests in the `kubernetes/` folder with **6 Deployments**, **4 Services**, **ConfigMaps**, **Secrets**, and a **Horizontal Pod Autoscaler** that scales the backend from 2 to 10 pods when CPU exceeds 70%.
>
> Deployment commands:
> - `kubectl apply -f kubernetes/deployment.yaml`
> - `kubectl scale deployment backend --replicas=5`"

---

### Phần 7: Kết luận (16:50 - 17:30) ⭐ 40 giây

**[GÓC MÁY: Webcam (full màn hình)]**

**Script tiếng Anh:**

> "To summarize what we've demonstrated today:
>
> ✅ **Level 1** - Three core services: React frontend, Node.js backend, and MySQL database, all running in Docker containers and communicating through a shared network.
>
> ✅ **Level 2** - Three backend replicas behind an Nginx load balancer, with a Redis message broker and two async workers for service decoupling.
>
> ✅ **Level 3** - Docker Swarm and Kubernetes manifests for production-grade orchestration with auto-scaling.
>
> The complete source code, Dockerfiles, and configuration are available in our repository. The `ReadMe.txt` file contains step-by-step instructions to reproduce this setup on any machine.
>
> Thank you for watching! If you have any questions, feel free to reach out to our team."

**[Hành động:]** Cả 3 người cùng xuất hiện ở frame cuối (nếu quay chung), hoặc người 3 kết thúc solo. Vẫy tay chào.

---

### ✅ Checklist cho Người 3 trước khi quay

- [ ] Redis ping trả về PONG
- [ ] File `worker/src/worker.js` đã mở sẵn
- [ ] Test thử tạo task và xem log worker có hoạt động
- [ ] File `docker-stack.yml` đã mở
- [ ] File `kubernetes/deployment.yaml` đã mở
- [ ] Có slide/sơ đồ tổng kết (optional nhưng nên có)
- [ ] Webcam + mic OK

---

# 📋 CHECKLIST CHUNG CHO CẢ NHÓM

## Trước ngày quay (1 ngày trước)

- [ ] Cả 3 người test chạy project trên máy của mình
- [ ] Đảm bảo Docker Desktop version giống nhau (khuyến nghị 4.x+)
- [ ] Test đầy đủ các lệnh trong kịch bản
- [ ] Quay thử 1 lần để check âm thanh + hình ảnh
- [ ] Thống nhất format video (khuyến nghị 1080p, 30fps)
- [ ] Chuẩn bị slide tổng kết (optional)

## Trước khi quay (30 phút)

- [ ] Restart Docker: `docker compose down && docker compose up -d --build`
- [ ] Đợi 60 giây cho services healthy
- [ ] Verify: tất cả containers "Up" hoặc "healthy"
- [ ] Mở sẵn browser tabs: localhost:8080, localhost:3000/api/health
- [ ] Mở sẵn 2-3 terminal windows
- [ ] Mở code editor với các file cần thiết
- [ ] Tắt notification trên máy (để không bị popup khi quay)
- [ ] Bật chế độ "Do Not Disturb"
- [ ] Test mic + webcam
- [ ] Có sẵn nước uống bên cạnh

## Trong khi quay

- [ ] Mỗi người nói rõ ràng, tốc độ vừa phải
- [ ] Khi chuyển cảnh giữa các phần, có thể cut trực tiếp (không cần transition)
- [ ] Nếu lỗi xảy ra, dừng lại, fix, quay lại từ đầu phần đó
- [ ] Mỗi người xuất hiện rõ trong frame (khi nói)

## Sau khi quay

- [ ] Ghép video bằng CapCut / Premiere / DaVinci Resolve
- [ ] Cả 3 phần nối liền mạch
- [ ] Thêm title card đầu video (tên project, thành viên)
- [ ] Thêm subtitle tiếng Anh nếu cần (khuyến nghị)
- [ ] Xuất file cuối: MP4, 1080p, ~50-200 MB
- [ ] Nộp lên hệ thống trước deadline

---

# 🎤 TIPS CHO NGƯỜI NÓI TIẾNG ANH

Nếu cả nhóm không tự tin tiếng Anh, có thể dùng chiến lược **song ngữ**:

> "Today I'll demo... Hôm nay mình sẽ demo... [tên project]."

Hoặc chuẩn bị sẵn text tiếng Anh và đọc. Một số mẹo:

1. **Viết script ra giấy** và để gần màn hình (nhưng đừng đọc máy móc)
2. **Tập nói trước 2-3 lần** trước khi quay
3. **Dùng câu ngắn**, tránh động từ phức tạp
4. **Từ vựng hay dùng trong video này:**
   - container, service, replica, load balancer
   - frontend, backend, database
   - health check, endpoint, API
   - deploy, scale, orchestration
   - message broker, queue, async processing
5. **Nói chậm và rõ** - tốt hơn là nói nhanh mà không ai hiểu

---

# 🔧 DANH SÁCH LỆNH NHANH (Cheat Sheet)

## Khởi động & Dừng

| Tác vụ | Mac/Linux | Windows PowerShell |
|--------|-----------|-------------------|
| Start | `docker compose up -d --build` | `docker compose up -d --build` |
| Stop | `docker compose stop` | `docker compose stop` |
| Xóa hết | `docker compose down -v` | `docker compose down -v` |
| Xem status | `docker compose ps` | `docker compose ps` |

## Logs

| Tác vụ | Mac/Linux | Windows PowerShell |
|--------|-----------|-------------------|
| Tất cả logs | `docker compose logs -f` | `docker compose logs -f` |
| 1 service | `docker compose logs -f worker1` | `docker compose logs -f worker1` |
| 100 dòng cuối | `docker compose logs --tail=100` | `docker compose logs --tail=100` |

## Test API (Mac/Linux & Windows)

```bash
# Health
curl http://localhost:3000/api/health

# Tasks
curl http://localhost:3000/api/tasks

# Stats
curl http://localhost:3000/api/stats

# Windows PowerShell: dùng Invoke-RestMethod
Invoke-RestMethod http://localhost:3000/api/health
```

## Load Balancing Test

**Mac/Linux (zsh/bash):**
```bash
for i in {1..15}; do curl -s http://localhost:3000/api/health | grep -o '"instance":"[^"]*"'; done | sort | uniq -c
```

**Windows PowerShell:**
```powershell
1..15 | ForEach-Object { (Invoke-WebRequest http://localhost:3000/api/health -UseBasicParsing).Content | Select-String -Pattern '"instance":"[^"]*"' } | Group-Object | Select-Object Name, Count
```

## Database

```bash
# Count tasks
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; SELECT COUNT(*) FROM tasks;"

# Describe table
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; DESCRIBE tasks;"

# Group by status
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; SELECT status, COUNT(*) FROM tasks GROUP BY status;"
```

## Redis

```bash
docker compose exec redis redis-cli ping
```

## Container IDs

```bash
docker compose exec taskflow-backend-1 sh -c 'echo $INSTANCE_ID'
```

---

# 📞 HỖ TRỢ KHI GẶP VẤN ĐỀ

## Containers không lên?

```bash
# Xem logs chi tiết
docker compose logs database
docker compose logs backend1
docker compose logs nginx

# Restart service bị lỗi
docker compose restart <service_name>

# Nếu vẫn lỗi, xóa hết và build lại
docker compose down -v
docker compose up -d --build
```

## Frontend trắng trang?

```bash
# Check frontend logs
docker compose logs frontend

# Restart frontend
docker compose restart frontend

# Hard refresh browser: Ctrl+Shift+R (Win) / Cmd+Shift+R (Mac)
```

## Worker không nhận message?

```bash
# Check worker logs
docker compose logs worker1
docker compose logs worker2

# Check Redis
docker compose exec redis redis-cli ping

# Tạo task mới và quan sát log
docker compose logs -f worker1
```

## Load balancing không phân phối đều?

```bash
# Restart nginx
docker compose restart nginx

# Check nginx config
cat nginx/nginx.conf

# Gửi nhiều request hơn (ít nhất 30) để thấy distribution
```

---

# 🎯 TÓM TẮT

| Phần | Người | Thời gian | Nội dung chính |
|------|-------|-----------|----------------|
| 1 | Người 1 | 6 phút | Intro + Containers + Backend API + MySQL |
| 2 | Người 2 | 6 phút | Frontend UI + CRUD + Load Balancing |
| 3 | Người 3 | 5.5 phút | Redis + Worker + Swarm/K8s + Kết luận |
| **Tổng** | 3 người | **17.5 phút** | Full demo Level 1+2+3 |

> **Lưu ý quan trọng:** Mỗi người cần thực hành trước ở máy của mình ít nhất 2-3 lần để quen thao tác. Khi quay chính thức, nên có 1 người "đạo diễn" đứng ngoài quan sát và báo lỗi nếu có vấn đề.

**Chúc nhóm quay video thành công! 🎬🚀**
