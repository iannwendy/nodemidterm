# 🎬 KỊCH BẢN THUYẾT TRÌNH - NGƯỜI 1 (SCRIPT TIẾNG ANH + LỆNH MACOS)
## Project: TaskFlow - Dockerized Node.js Web Application (0:00 - 6:00)

---

## 🔧 BƯỚC 0: CHUẨN BỊ TRƯỚC KHI BẤM MÁY QUAY (macOS)

Mở ứng dụng **Docker Desktop** và đợi biểu tượng chuyển sang màu xanh. Sau đó mở **Terminal** trên Mac và chạy lần lượt các lệnh sau:

**1. Di chuyển vào thư mục project:**
```bash
cd /Users/iannwendy/Desktop/NodeMidterm
```

**2. Khởi chạy và làm mới toàn bộ các container:**
```bash
docker compose up -d --build --force-recreate
```

**3. Kiểm tra trạng thái (đảm bảo tất cả các container đều Up / healthy):**
```bash
docker compose ps
```

---

## 🎙️ KỊCH BẢN NÓI TIẾNG ANH LIỀN MẠCH (KÈM LỆNH MACOS)

### Phần 1: Giới thiệu mở đầu — Introduction (0:00 - 1:30)
*(Góc máy: Bật Webcam hoặc mở sơ đồ kiến trúc project trên màn hình)*

🗣️ **Script Tiếng Anh (đọc liền mạch):**

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

*(Hành động: Vẫy tay chào → chuyển màn hình sang cửa sổ Terminal trên macOS)*

---

### Phần 2: Kiểm tra các Docker Containers (1:30 - 2:30)

🗣️ **Script Tiếng Anh (trước khi gõ lệnh):**

> "First, let's verify that all Docker containers are running properly. I'm running `docker compose ps` to list all active services."

💻 **Chạy lệnh trên Terminal (macOS):**
```bash
docker compose ps
```

🗣️ **Script Tiếng Anh (giải thích kết quả trên màn hình):**

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

### Phần 3: Kiểm thử Backend API (2:30 - 4:30)

#### 3.1. Kiểm tra Health Endpoint
🗣️ **Script Tiếng Anh:**

> "Now let's test the backend API endpoints. First, I will check the **health endpoint** at `/api/health`."

💻 **Chạy lệnh trên Terminal (macOS):**
```bash
curl -s http://localhost:3000/api/health | python3 -m json.tool
```

🗣️ **Script Tiếng Anh (giải thích output):**

> "The health endpoint returns:
> - **status**: `ok`
> - **instance**: `backend-1` (or `backend-2`, `backend-3`) — this is the unique instance ID that helps us verify load balancing later.
> - **database**: `ok`, and **redis**: `ok`, along with their response times.
> - And **uptime**, showing how long the server has been running."

#### 3.2. Lấy danh sách toàn bộ công việc (Get All Tasks)
🗣️ **Script Tiếng Anh:**

> "Next, let's fetch all tasks from the `/api/tasks` endpoint."

💻 **Chạy lệnh trên Terminal (macOS):**
```bash
curl -s http://localhost:3000/api/tasks | python3 -c 'import sys,json; d=json.load(sys.stdin); print("Total tasks:", len(d.get("data", d)))'
```

🗣️ **Script Tiếng Anh:**

> "As you can see, there are **21 sample tasks** stored in our MySQL database and returned by the backend API."

#### 3.3. Kiểm tra API Thống kê (Get Statistics)
🗣️ **Script Tiếng Anh:**

> "Now let's test the **statistics endpoint** at `/api/stats`."

💻 **Chạy lệnh trên Terminal (macOS):**
```bash
curl -s http://localhost:3000/api/stats | python3 -m json.tool
```

🗣️ **Script Tiếng Anh:**

> "The statistics endpoint shows the total number of tasks, their distribution by status and priority, and recent tasks — this data directly powers the frontend dashboard."

---

### Phần 4: Kiểm chứng Cơ sở dữ liệu MySQL (4:30 - 6:00)

🗣️ **Script Tiếng Anh:**

> "Finally, let's connect directly to the MySQL container to verify that our data is persisted in the database."

💻 **Chạy lệnh đếm số lượng công việc theo trạng thái (macOS):**
```bash
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; SELECT COUNT(*) AS total, status FROM tasks GROUP BY status;"
```

🗣️ **Script Tiếng Anh:**

> "Here we can see the exact task counts grouped by status: `todo`, `in-progress`, and `done`. Next, let's inspect the `tasks` table structure using `DESCRIBE tasks`."

💻 **Chạy lệnh xem cấu trúc bảng (macOS):**
```bash
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; DESCRIBE tasks;"
```

🗣️ **Script Tiếng Anh:**

> "The `tasks` table contains columns for `id`, `title`, `description`, `status`, `priority`, `created_at`, and `updated_at`. All data is persisted through the Docker volume **taskflow-mysql**, so no data is lost when containers restart.
>
> That concludes my section. Now **[Tên người 2]** will demonstrate the frontend interface, CRUD operations, and load balancing."

---

## 📋 TỔNG HỢP LỆNH MACOS ĐỂ COPY NHANH KHI QUAY
*(Đã loại bỏ các dòng comment `#` để bạn copy-paste thẳng vào Terminal `zsh` trên macOS không bị lỗi)*

**Lệnh 1 — Kiểm tra danh sách containers:**
```bash
docker compose ps
```

**Lệnh 2 — Test API Health Check:**
```bash
curl -s http://localhost:3000/api/health | python3 -m json.tool
```

**Lệnh 3 — Test API lấy tổng số Tasks:**
```bash
curl -s http://localhost:3000/api/tasks | python3 -c 'import sys,json; d=json.load(sys.stdin); print("Total tasks:", len(d.get("data", d)))'
```

**Lệnh 4 — Test API Thống kê (Stats):**
```bash
curl -s http://localhost:3000/api/stats | python3 -m json.tool
```

**Lệnh 5 — Truy vấn thống kê trực tiếp trong MySQL:**
```bash
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; SELECT COUNT(*) AS total, status FROM tasks GROUP BY status;"
```

**Lệnh 6 — Xem cấu trúc bảng tasks trong MySQL:**
```bash
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; DESCRIBE tasks;"
```
