# 🎬 KỊCH BẢN DEMO VIDEO - 3 NGƯỜI (SCRIPT TIẾNG ANH)
## TaskFlow - Dockerized Node.js Web Application

> **Mục tiêu:** Chia đều phần trình bày cho 3 thành viên (thuyết trình bằng Tiếng Anh), tổng thời gian ~17-18 phút, đảm bảo mỗi người nói khoảng 5-6 phút.
>
> **Hệ điều hành theo thành viên:**
> - **Người 1:** Dùng **macOS** (Terminal `zsh`)
> - **Người 2:** Dùng **Hệ điều hành Windows** (Windows PowerShell)
> - **Người 3:** Dùng **Hệ điều hành Windows** (Windows PowerShell)

---

## 📋 THÔNG TIN CHUNG

| Mục | Chi tiết |
|-----|----------|
| **Project** | TaskFlow - Dockerized Task Manager |
| **Môn học** | Web Programming with NodeJS - 502070 |
| **Giảng viên** | Mai Van Manh |
| **Stack** | Docker, Node.js, React, MySQL, Redis, Nginx, Docker Swarm, Kubernetes |
| **Tổng thời gian** | ~17 phút (3 × ~5-6 phút) |
| **Ngôn ngữ nói** | Tiếng Anh (đọc theo script bên dưới) |

---

## 🎯 PHÂN CHIA THEO NGƯỜI & HỆ ĐIỀU HÀNH

| Người | Hệ điều hành | Phụ trách | Thời gian | Nội dung chính |
|-------|-------------|-----------|-----------|----------------|
| **Người 1 - Leader** | 🍎 **macOS** | Intro + Level 1 (Backend/Database) | 0:00 - 6:00 | Giới thiệu, kiểm tra containers, test API, MySQL |
| **Người 2 - Frontend** | 🪟 **Windows OS** | Level 1 (UI/CRUD) + Level 2 (Load Balancer) | 6:00 - 12:00 | Demo giao diện, CRUD qua UI, Load Balancing test |
| **Người 3 - Orchestration** | 🪟 **Windows OS** | Level 2 (Redis/Worker) + Level 3 (Swarm/K8s) + Kết luận | 12:00 - 17:30 | Redis queue, worker logs, Swarm/K8s, tổng kết |

---

## 🔧 CHUẨN BỊ CHUNG TRƯỚC KHI QUAY

1. **Khởi động Docker Desktop** và đợi biểu tượng chuyển sang trạng thái Running.
2. **Mở Terminal (macOS) hoặc Windows PowerShell (Windows OS)** và di chuyển vào thư mục project:
   - **Người 1 (macOS):**
     ```bash
     cd /Users/iannwendy/Desktop/NodeMidterm
     ```
   - **Người 2 & Người 3 (Windows OS - PowerShell):**
     ```powershell
     cd C:\Users\<YourName>\Desktop\NodeMidterm
     ```
3. **Khởi chạy và làm mới toàn bộ services:**
   ```powershell
   docker compose up -d --build --force-recreate
   ```
4. **Đợi khoảng 30-60 giây** rồi kiểm tra trạng thái:
   ```powershell
   docker compose ps
   ```
   → Đảm bảo tất cả các containers đều `Up` và `healthy`.

---

# 👤 NGƯỜI 1 - LEADER (🍎 HỆ ĐIỀU HÀNH MACOS)
## Nội dung: Intro + Level 1 (Backend & MySQL Database) | Thời gian: 0:00 - 6:00

### Mục tiêu
- Giới thiệu project, thành viên và 3 cấp độ (Levels) của đồ án
- Kiểm tra danh sách Docker containers
- Kiểm thử các Backend API endpoints
- Kiểm chứng dữ liệu trong MySQL database

### Phần 1: Giới thiệu mở đầu (0:00 - 1:30) ⭐ 90 giây

**[GÓC MÁY: Webcam (full màn hình) hoặc mở sơ đồ kiến trúc kèm cam góc dưới]**

**Hành động:** Mở slide/sơ đồ kiến trúc hoặc nói trực tiếp vào camera.

🗣️ **Script Tiếng Anh (đọc nguyên văn):**

> "Hello everyone! My name is **[Tên của bạn]**, and today I'm going to present our **NodeJS Mid-term project** for course **502070 - Web Programming with NodeJS**, taught by instructor **Mai Van Manh**.
>
> Our project is called **TaskFlow** — a Dockerized Task Manager built with **Node.js, React, MySQL, Redis, and Nginx**.
>
> We are a team of **3 members**: I will present the project overview, Docker containers, Backend APIs, and MySQL database. Next, **[Tên người 2]** will present the frontend user interface and Nginx load balancing. Finally, **[Tên người 3]** will present the Redis message queue, async workers, and container orchestration.
>
> In this demo, we will cover all **3 levels** required by the assignment:
> - **Level 1** with basic Docker setup for Frontend, Backend, and Database.
> - **Level 2** with Nginx load balancing and Redis message broker for async processing.
> - **Level 3** with Docker Swarm and Kubernetes orchestration."

**[Hành động:]** Vẫy tay chào → chuyển sang màn hình Terminal trên macOS.

---

### Phần 2: Kiểm tra Docker Containers (1:30 - 2:30) ⭐ 60 giây

**[GÓC MÁY: Terminal macOS - toàn màn hình]**

🗣️ **Script Tiếng Anh:**

> "First, let's verify that all Docker containers are running properly. I'm running `docker compose ps` to list all active services."

💻 **Lệnh (macOS Terminal):**
```bash
docker compose ps
```

🗣️ **Script Tiếng Anh (giải thích khi nhìn vào output):**

> "As you can see on the screen, all of our services are up and running:
> - **taskflow-frontend** — the React user interface exposed on port **8080**.
> - **taskflow-nginx** — the Nginx load balancer listening on port **3000**.
> - **taskflow-backend-1, backend-2, and backend-3** — three Node.js API replicas.
> - **taskflow-redis** — the Redis message broker.
> - **taskflow-worker-1 and worker-2** — two background workers for asynchronous processing.
> - And **taskflow-database** — MySQL 8 running on port **3306**.
>
> All services are in the **Up** and **healthy** state, meaning our infrastructure is ready."

---

### Phần 3: Kiểm thử Backend API (2:30 - 4:30) ⭐ 120 giây

**[GÓC MÁY: Terminal macOS]**

#### 3.1 - Health Check

🗣️ **Script Tiếng Anh:**

> "Now let's test the backend API endpoints. First, I will check the **health endpoint** at `/api/health`."

💻 **Lệnh (macOS Terminal):**
```bash
curl -s http://localhost:3000/api/health | python3 -m json.tool
```

🗣️ **Script Tiếng Anh (giải thích output):**

> "The health endpoint returns:
> - **status**: `ok`
> - **instance**: `backend-1` (or `backend-2`, `backend-3`) — this is the unique instance ID that helps us verify load balancing later.
> - **database**: `ok`, and **redis**: `ok`, along with their response times.
> - And **uptime**, showing how long the server has been running."

#### 3.2 - Get All Tasks

🗣️ **Script Tiếng Anh:**

> "Next, let's fetch all tasks from the `/api/tasks` endpoint."

💻 **Lệnh (macOS Terminal):**
```bash
curl -s http://localhost:3000/api/tasks | python3 -c 'import sys,json; d=json.load(sys.stdin); print("Total tasks:", len(d.get("data", d)))'
```

🗣️ **Script Tiếng Anh:**

> "As you can see, there are **21 sample tasks** stored in our MySQL database and returned by the backend API."

#### 3.3 - Get Statistics

🗣️ **Script Tiếng Anh:**

> "Now let's test the **statistics endpoint** at `/api/stats`."

💻 **Lệnh (macOS Terminal):**
```bash
curl -s http://localhost:3000/api/stats | python3 -m json.tool
```

🗣️ **Script Tiếng Anh:**

> "The statistics endpoint shows the total number of tasks, their distribution by status and priority, and recent tasks — this data directly powers the frontend dashboard."

---

### Phần 4: Kiểm chứng Cơ sở dữ liệu MySQL (4:30 - 6:00) ⭐ 90 giây

**[GÓC MÁY: Terminal macOS]**

🗣️ **Script Tiếng Anh:**

> "Finally, let's connect directly to the MySQL container to verify that our data is persisted in the database."

💻 **Lệnh (macOS Terminal):**
```bash
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; SELECT COUNT(*) AS total, status FROM tasks GROUP BY status;"
```

🗣️ **Script Tiếng Anh:**

> "Here we can see the exact task counts grouped by status: `todo`, `in-progress`, and `done`. Next, let's inspect the `tasks` table structure using `DESCRIBE tasks`."

💻 **Lệnh (macOS Terminal):**
```bash
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; DESCRIBE tasks;"
```

🗣️ **Script Tiếng Anh:**

> "The `tasks` table contains columns for `id`, `title`, `description`, `status`, `priority`, `created_at`, and `updated_at`. All data is persisted through the Docker volume **taskflow-mysql**, so no data is lost when containers restart.
>
> That concludes my section. Now **[Tên người 2]** will demonstrate the frontend interface, CRUD operations, and load balancing."

**[Hành động:]** Cười, gật đầu, chuyển quyền cho Người 2.

---

# 👤 NGƯỜI 2 - FRONTEND & LOAD BALANCING (🪟 HỆ ĐIỀU HÀNH WINDOWS)
## Nội dung: Level 1 (UI/CRUD) + Level 2 (Nginx Load Balancing) | Thời gian: 6:00 - 12:00

### Mục tiêu
- Demo giao diện React tại `http://localhost:8080`
- Test đầy đủ CRUD (Create, Update, Delete) trên giao diện UI
- Chứng minh Load Balancing qua Nginx bằng **Windows PowerShell**

### Phần 1: Tổng quan giao diện Frontend (6:00 - 7:00) ⭐ 60 giây

**[GÓC MÁY: Trình duyệt trên Windows - http://localhost:8080 - toàn màn hình]**

**Hành động:** Mở trình duyệt, truy cập `http://localhost:8080`. Di chuột vào các thẻ thống kê trên Dashboard và giải thích.

🗣️ **Script Tiếng Anh:**

> "Hi everyone, my name is **[Tên người 2]**. Now let's look at the **frontend**, which is a **React Single Page Application** served by Nginx on port **8080**.
>
> On the main screen, the dashboard shows the total task count, the distribution by status — **To Do**, **In Progress**, and **Done** — as well as high-priority tasks and recent activity. All of this data is fetched from our backend cluster through the Nginx load balancer."

---

### Phần 2: CREATE - Tạo Task Mới (7:00 - 8:15) ⭐ 75 giây

**[GÓC MÁY: Trình duyệt trên Windows]**

**Hành động:**
1. Click nút **"+"** (floating action button) ở góc phải dưới màn hình.
2. Khi hộp thoại hiện ra, nhập:
   - **Title:** `Demo by [Tên bạn] - Level 1`
   - **Description:** `Testing CRUD via UI`
   - **Status:** `To Do`
   - **Priority:** `High`
3. Click nút **"Create Task"**.

🗣️ **Script Tiếng Anh:**

> "Now I will demonstrate the **CREATE** operation. I click the **plus button** at the bottom right to open the create modal.
>
> I fill in the title, description, status, and priority, and then click **Create Task**.
>
> Behind the scenes:
> 1. The frontend sends a **POST request** to `/api/tasks`.
> 2. The request goes through the **Nginx load balancer** on port 3000.
> 3. Nginx routes it to one of the **3 backend replicas**.
> 4. The backend saves the new task into **MySQL**.
> 5. The backend also publishes a **notification message** to **Redis** for asynchronous processing.
>
> As you can see, the new task appears at the top of the list immediately, and the total count increases to **22**."

---

### Phần 3: UPDATE & DELETE (8:15 - 9:30) ⭐ 75 giây

**[GÓC MÁY: Trình duyệt trên Windows]**

#### Thao tác UPDATE

**Hành động:**
1. Tìm task vừa tạo ở đầu danh sách.
2. Click **"Start"** (trạng thái chuyển sang `In Progress`).
3. Click **"Complete"** (trạng thái chuyển sang `Done`).

🗣️ **Script Tiếng Anh:**

> "Next, for the **UPDATE** operation, I click **Start** on the newly created task to change its status from *To Do* to *In Progress*, and then click **Complete** to mark it as *Done*. Each click sends a **PUT request** to update the record in MySQL."

#### Thao tác DELETE

**Hành động:**
1. Tìm task vừa tạo.
2. Click biểu tượng **thùng rác** (trash icon).
3. Xác nhận xóa (Confirm).

🗣️ **Script Tiếng Anh:**

> "For the **DELETE** operation, I click the **trash icon** and confirm deletion. The task is removed via a **DELETE request** to the API, and our total task count returns to **21**."

---

### Phần 4: Load Balancing Demo trên Windows PowerShell (9:30 - 12:00) ⭐ 150 giây

**[GÓC MÁY: Cửa sổ Windows PowerShell]**

#### 4.1 - Hiển thị cấu hình Nginx Load Balancer

🗣️ **Script Tiếng Anh:**

> "Now let's prove that **Level 2 Load Balancing** is working. First, let me show you our **Nginx configuration**."

💻 **Lệnh (Windows PowerShell):**
```powershell
Get-Content nginx/nginx.conf | Select-String -Pattern "upstream backend_cluster" -Context 0,13
```

🗣️ **Script Tiếng Anh (giải thích output):**

> "As you can see, Nginx is configured with an **upstream block** named `backend_cluster` using the **`least_conn`** algorithm — which routes each incoming request to the backend server with the fewest active connections.
>
> Inside the cluster, we have **3 backend instances**: `backend1`, `backend2`, and `backend3` listening on port 3000."

#### 4.2 - Kiểm thử phân phối tải (Load Distribution)

🗣️ **Script Tiếng Anh:**

> "Now I will send **15 health check requests** in a loop using PowerShell, and group the responses by the **instance ID** of the backend server that handled each request."

💻 **Lệnh (Windows PowerShell):**
```powershell
1..15 | ForEach-Object { (Invoke-RestMethod http://localhost:3000/api/health).instance } | Group-Object | Select-Object Count, Name
```

**Hành động:** Chạy lệnh trên Windows PowerShell, màn hình sẽ hiển thị bảng kết quả:
```
Count Name
----- ----
    5 backend-1
    5 backend-2
    5 backend-3
```

🗣️ **Script Tiếng Anh (giải thích kết quả):**

> "Look at the result — the 15 requests are **evenly distributed across all 3 backend replicas**: `backend-1`, `backend-2`, and `backend-3`, with 5 requests each. This proves that **Nginx load balancing** is working properly."

#### 4.3 - Kiểm tra INSTANCE_ID của từng Backend Container

🗣️ **Script Tiếng Anh:**

> "We can also verify the `INSTANCE_ID` environment variable inside each backend container."

💻 **Lệnh (Windows PowerShell):**
```powershell
docker compose exec backend1 printenv INSTANCE_ID
docker compose exec backend2 printenv INSTANCE_ID
docker compose exec backend3 printenv INSTANCE_ID
```

🗣️ **Script Tiếng Anh:**

> "As you can see, `backend1`, `backend2`, and `backend3` each respond with their own unique `INSTANCE_ID`.
>
> That's the end of my section. Now **[Tên người 3]** will demonstrate the **Redis message queue**, **worker processing**, and **Level 3 container orchestration**."

**[Hành động:]** Chuyển quyền cho Người 3.

---

# 👤 NGƯỜI 3 - REDIS, WORKER & ORCHESTRATION (🪟 HỆ ĐIỀU HÀNH WINDOWS)
## Nội dung: Level 2 (Redis/Worker) + Level 3 (Swarm/K8s) + Kết luận | Thời gian: 12:00 - 17:30

### Mục tiêu
- Kiểm tra Redis Message Broker bằng **Windows PowerShell**
- Show code của Worker và Backend publish message
- Live Demo: Tạo task trên trình duyệt → Xem Worker xử lý real-time trên PowerShell
- Show cấu hình Docker Swarm và Kubernetes trên Windows PowerShell
- Kết luận toàn bộ bài thuyết trình

### Phần 1: Kiểm tra Redis Message Broker (12:00 - 12:45) ⭐ 45 giây

**[GÓC MÁY: Cửa sổ Windows PowerShell]**

🗣️ **Script Tiếng Anh:**

> "Hi everyone, my name is **[Tên người 3]**. Now let's look at the **Redis message broker** and asynchronous worker processing.
>
> First, let's verify that the Redis container is running and healthy."

💻 **Lệnh (Windows PowerShell):**
```powershell
docker compose ps redis
docker compose exec redis redis-cli ping
```

🗣️ **Script Tiếng Anh:**

> "Running `docker compose ps redis` shows that the Redis container is up and healthy, and `redis-cli ping` returns **PONG**, confirming that Redis is ready to accept connections."

---

### Phần 2: Hiển thị mã nguồn Worker (12:45 - 13:45) ⭐ 60 giây

**[GÓC MÁY: Windows PowerShell (hoặc mở file `worker/src/worker.js` trên VSCode)]**

🗣️ **Script Tiếng Anh:**

> "Next, let's examine the **worker code** inside `worker/src/worker.js`."

💻 **Lệnh (Windows PowerShell):**
```powershell
Get-Content worker/src/worker.js | Select-String -Pattern "blpop" -Context 2,15
```

🗣️ **Script Tiếng Anh:**

> "Here you can see the worker uses the **`BLPOP` command** — **Blocking Left Pop** — to consume messages from the `task:notifications` queue in Redis.
>
> `BLPOP` waits up to 5 seconds if the queue is empty before looping again. This provides **non-blocking asynchronous processing**, so the worker does not waste CPU cycles when there are no messages in the queue."

---

### Phần 3: Hiển thị mã nguồn Backend Publish vào Redis (13:45 - 14:30) ⭐ 45 giây

**[GÓC MÁY: Windows PowerShell]**

🗣️ **Script Tiếng Anh:**

> "Now let's look at how the backend publishes notifications to Redis."

💻 **Lệnh (Windows PowerShell):**
```powershell
Get-ChildItem -Path backend/src -Recurse -Filter *.js | Select-String -Pattern "publish|lpush|rpush" | Select-Object -First 10
```

🗣️ **Script Tiếng Anh:**

> "On the backend side, whenever a task is created or updated, the API calls `publishTaskNotification`, which pushes a message into the Redis list using `lpush`. This achieves **service decoupling** — the API responds immediately to the user without waiting for the notification to be processed."

---

### Phần 4: Live Demo - Worker Xử Lý Task Thời Gian Thực (14:30 - 15:30) ⭐ 60 giây

**[GÓC MÁY: Chia đôi màn hình Windows PowerShell + Trình duyệt `http://localhost:8080`]**

**Bước 1:** Trong cửa sổ Windows PowerShell, chạy lệnh theo dõi log trực tiếp của cả 2 workers:

🗣️ **Script Tiếng Anh:**

> "Now let's see this asynchronous pipeline in action. First, I will stream the real-time logs of our worker containers."

💻 **Lệnh (Windows PowerShell):**
```powershell
docker compose logs -f worker1 worker2
```

**Bước 2:** Mở trình duyệt tại `http://localhost:8080`, nhấn nút **"+"** tạo một task mới:
- **Title:** `Live Demo by [Tên bạn]`
- Nhấn **"Create Task"**.

**Bước 3:** Chỉ vào log mới xuất hiện trên cửa sổ Windows PowerShell:
```
taskflow-worker-1  | [Worker] Received notification: TASK_CREATED
taskflow-worker-1  | [Worker] Processing task notification: Live Demo by ...
```

🗣️ **Script Tiếng Anh:**

> "I just created a new task in the browser, and if we look at the PowerShell terminal, the worker immediately received the notification from Redis, processed the task, and logged completion. This proves our asynchronous pipeline — **API to Redis to Worker** — is working in real time."

*(Lưu ý: Nhấn tổ hợp phím **`Ctrl + C`** trong cửa sổ PowerShell để thoát chế độ xem log trước khi chạy lệnh phần 5)*

---

### Phần 5: Docker Swarm - Level 3 (15:30 - 16:15) ⭐ 45 giây

**[GÓC MÁY: Windows PowerShell]**

🗣️ **Script Tiếng Anh:**

> "Moving on to **Level 3 — Container Orchestration**, we first prepared a **Docker Swarm stack configuration** in `docker-stack.yml`."

💻 **Lệnh (Windows PowerShell):**
```powershell
Get-Content docker-stack.yml -TotalCount 50
```

🗣️ **Script Tiếng Anh:**

> "Let's also check the replica configurations across our services in the stack file."

💻 **Lệnh tiếp (Windows PowerShell):**
```powershell
Select-String -Path docker-stack.yml -Pattern "replicas:" -Context 0,2
```

🗣️ **Script Tiếng Anh:**

> "This file defines all services with their replica counts, CPU and memory limits, restart policies, and health checks. To deploy and scale on Docker Swarm, we run:
> - `docker swarm init`
> - `docker stack deploy -c docker-stack.yml taskflow`
> - And `docker service scale taskflow_backend1=5` to scale the service."

---

### Phần 6: Kubernetes - Level 3 (16:15 - 16:50) ⭐ 35 giây

**[GÓC MÁY: Windows PowerShell]**

🗣️ **Script Tiếng Anh:**

> "In addition to Docker Swarm, we also created **Kubernetes manifests** in the `kubernetes` directory."

💻 **Lệnh (Windows PowerShell):**
```powershell
Get-ChildItem kubernetes/
(Select-String -Path kubernetes/deployment.yaml -Pattern "kind: Deployment").Count
(Select-String -Path kubernetes/deployment.yaml -Pattern "kind: Service").Count
```

🗣️ **Script Tiếng Anh:**

> "Our `deployment.yaml` manifest includes **6 Deployments**, **4 Services**, **ConfigMaps**, **Secrets**, and a **Horizontal Pod Autoscaler (HPA)** that automatically scales the backend from **2 to 10 pods** whenever CPU utilization exceeds 70%.
>
> We can deploy it to a cluster using `kubectl apply -f kubernetes/deployment.yaml`."

---

### Phần 7: Tổng kết & Kết luận (16:50 - 17:30) ⭐ 40 giây

**[GÓC MÁY: Webcam (full màn hình) hoặc Slide tổng kết]**

🗣️ **Script Tiếng Anh:**

> "To summarize what our team has demonstrated today:
>
> - ✅ **Level 1:** Three core services — React frontend, Node.js backend, and MySQL database — all containerized with Docker Compose, communicating over a custom bridge network with persistent volume storage.
> - ✅ **Level 2:** Three backend replicas behind an Nginx load balancer using the `least_conn` algorithm, combined with a Redis message broker and two asynchronous workers for service decoupling.
> - ✅ **Level 3:** Production-ready orchestration manifests for both Docker Swarm and Kubernetes with Horizontal Pod Autoscaling.
>
> All source code, Dockerfiles, and step-by-step instructions are included in our repository and documented in `ReadMe.txt`.
>
> Thank you very much for watching our presentation!"

**[Hành động:]** Vẫy tay chào kết thúc video.

---

# 📋 BẢNG TỔNG HỢP LỆNH COPY NHANH THEO THÀNH VIÊN

## 🍎 NGƯỜI 1 (macOS Terminal - `zsh`)

```bash
docker compose ps
```
```bash
curl -s http://localhost:3000/api/health | python3 -m json.tool
```
```bash
curl -s http://localhost:3000/api/tasks | python3 -c 'import sys,json; d=json.load(sys.stdin); print("Total tasks:", len(d.get("data", d)))'
```
```bash
curl -s http://localhost:3000/api/stats | python3 -m json.tool
```
```bash
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; SELECT COUNT(*) AS total, status FROM tasks GROUP BY status;"
```
```bash
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; DESCRIBE tasks;"
```

---

## 🪟 NGƯỜI 2 (Windows OS - PowerShell)

```powershell
Get-Content nginx/nginx.conf | Select-String -Pattern "upstream backend_cluster" -Context 0,13
```
```powershell
1..15 | ForEach-Object { (Invoke-RestMethod http://localhost:3000/api/health).instance } | Group-Object | Select-Object Count, Name
```
```powershell
docker compose exec backend1 printenv INSTANCE_ID
docker compose exec backend2 printenv INSTANCE_ID
docker compose exec backend3 printenv INSTANCE_ID
```

---

## 🪟 NGƯỜI 3 (Windows OS - PowerShell)

```powershell
docker compose ps redis
docker compose exec redis redis-cli ping
```
```powershell
Get-Content worker/src/worker.js | Select-String -Pattern "blpop" -Context 2,15
```
```powershell
Get-ChildItem -Path backend/src -Recurse -Filter *.js | Select-String -Pattern "publish|lpush|rpush" | Select-Object -First 10
```
```powershell
docker compose logs -f worker1 worker2
```
*(Nhấn `Ctrl + C` để dừng xem log trước khi chạy tiếp các lệnh dưới)*
```powershell
Get-Content docker-stack.yml -TotalCount 50
```
```powershell
Select-String -Path docker-stack.yml -Pattern "replicas:" -Context 0,2
```
```powershell
Get-ChildItem kubernetes/
(Select-String -Path kubernetes/deployment.yaml -Pattern "kind: Deployment").Count
(Select-String -Path kubernetes/deployment.yaml -Pattern "kind: Service").Count
```
