# 🎬 KỊCH BẢN THUYẾT TRÌNH - NGƯỜI 1 (TIẾNG VIỆT LIỀN MẠCH + LỆNH MACOS)
## Project: TaskFlow - Dockerized Node.js Web Application (0:00 - 6:00)

---

## 🔧 BƯỚC 0: CHUẨN BỊ TRƯỚC KHI BẤM MÁY QUAY (macOS)

Mở ứng dụng **Docker Desktop** và đợi biểu tượng chuyển sang màu xanh. Sau đó mở **Terminal** trên Mac và chạy các lệnh sau (không chứa dòng `#` để copy-paste trực tiếp vào `zsh` không bị lỗi):

**1. Di chuyển vào thư mục project:**
```bash
cd /Users/iannwendy/Desktop/NodeMidterm
```

**2. Khởi chạy và làm mới toàn bộ các container:**
```bash
docker compose up -d --build --force-recreate
```

**3. Kiểm tra trạng thái (đảm bảo cả 8 container đều Up / healthy):**
```bash
docker compose ps
```

---

## 🎙️ KỊCH BẢN NÓI TIẾNG VIỆT LIỀN MẠCH (KÈM LỆNH MACOS)

### Phần 1: Giới thiệu mở đầu (0:00 - 1:30)
*(Góc máy: Bật Webcam hoặc mở sơ đồ kiến trúc project trên màn hình)*

> "Xin chào thầy và các bạn! Em tên là **[Tên của bạn]**. Hôm nay em xin đại diện nhóm trình bày đồ án giữa kỳ môn **Lập trình Web với Node.js (mã môn 502070)** do thầy **Mai Văn Mạnh** hướng dẫn.
>
> Dự án của nhóm em có tên là **TaskFlow** — một ứng dụng Quản lý Công việc (Task Manager) được đóng gói hoàn toàn bằng Docker, xây dựng trên nền tảng **Node.js, React, MySQL, Redis và Nginx**.
>
> Nhóm chúng em gồm có 3 thành viên: Em sẽ phụ trách phần giới thiệu tổng quan kiến trúc, kiểm tra hệ thống container, Backend API và cơ sở dữ liệu MySQL. Tiếp theo, bạn **[Tên người 2]** sẽ trình bày phần giao diện Frontend cùng cơ chế cân bằng tải (Load Balancing). Cuối cùng, bạn **[Tên người 3]** sẽ trình bày về hàng đợi Redis, tiến trình xử lý bất đồng bộ (Worker) và điều phối container (Container Orchestration).
>
> Trong buổi demo hôm nay, nhóm sẽ đi qua đầy đủ cả **3 cấp độ (3 Levels)** theo yêu cầu của đề bài:
> - **Level 1:** Thiết lập Docker cơ bản cho hệ thống.
> - **Level 2:** Triển khai cân bằng tải với Nginx và xử lý thông điệp qua Redis Message Broker.
> - **Level 3:** Điều phối container nâng cao với Docker Swarm và Kubernetes."

*(Chuyển màn hình sang cửa sổ Terminal trên macOS)*

---

### Phần 2: Kiểm tra các Docker Containers (1:30 - 2:30)

> "Đầu tiên, chúng ta sẽ kiểm tra xem toàn bộ các Docker container của hệ thống đã hoạt động ổn định hay chưa. Em sẽ chạy lệnh `docker compose ps` để liệt kê danh sách tất cả các dịch vụ đang chạy."

💻 **Chạy lệnh trên Terminal (macOS):**
```bash
docker compose ps
```

> "Như thầy và các bạn có thể thấy trên màn hình, hiện tại chúng ta có tổng cộng **8 dịch vụ (services)** đang hoạt động:
> - Thứ nhất là **taskflow-frontend**: Giao diện người dùng viết bằng React, được mở ở cổng **8080**.
> - Thứ hai là **taskflow-nginx**: Bộ cân bằng tải (Load Balancer) lắng nghe ở cổng **3000**.
> - Tiếp theo là **taskflow-backend-1, backend-2 và backend-3**: Ba bản sao (replicas) của Node.js API server.
> - **taskflow-redis**: Đóng vai trò là Message Broker (trung gian truyền tải thông điệp).
> - **taskflow-worker-1 và worker-2**: Hai worker xử lý các tác vụ ngầm bất đồng bộ.
> - Và cuối cùng là **taskflow-database**: Cơ sở dữ liệu MySQL phiên bản 8 chạy ở cổng **3306**.
>
> Tất cả các dịch vụ đều đang ở trạng thái **Up** và **healthy**, nghĩa là toàn bộ hạ tầng của chúng ta đã sẵn sàng hoạt động."

---

### Phần 3: Kiểm thử Backend API (2:30 - 4:30)

#### 3.1. Kiểm tra Health Endpoint
> "Tiếp theo, em sẽ tiến hành kiểm thử trực tiếp các API ở phía Backend. Đầu tiên là endpoint kiểm tra sức khỏe hệ thống (`/api/health`)."

💻 **Chạy lệnh trên Terminal (macOS):**
```bash
curl -s http://localhost:3000/api/health | python3 -m json.tool
```

> "Kết quả trả về từ Health endpoint bao gồm:
> - **status**: `ok` — cho biết server đang hoạt động tốt.
> - **instance**: `backend-1` (hoặc 2, 3) — đây là mã định danh duy nhất của từng container backend, giúp chúng ta kiểm chứng tính năng cân bằng tải ở phần sau.
> - **database** và **redis**: đều ở trạng thái `ok` (đã kết nối thành công kèm thời gian phản hồi).
> - Cùng với thông số **uptime** cho biết thời gian máy chủ đã hoạt động liên tục."

#### 3.2. Lấy danh sách toàn bộ công việc (Tasks)
> "Tiếp theo, chúng ta sẽ gọi API lấy danh sách toàn bộ các công việc hiện có trong hệ thống."

💻 **Chạy lệnh trên Terminal (macOS):**
```bash
curl -s http://localhost:3000/api/tasks | python3 -c 'import sys,json; d=json.load(sys.stdin); print("Total tasks:", len(d.get("data", d)))'
```

> "API trả về tổng cộng **21 công việc mẫu (sample tasks)**. Toàn bộ dữ liệu này được đọc trực tiếp từ cơ sở dữ liệu MySQL thông qua cụm Backend API."

#### 3.3. Kiểm tra API Thống kê (Statistics)
> "Tiếp tục, em sẽ kiểm tra thêm endpoint thống kê (`/api/stats`)."

💻 **Chạy lệnh trên Terminal (macOS):**
```bash
curl -s http://localhost:3000/api/stats | python3 -m json.tool
```

> "Endpoint thống kê này trả về sự phân bổ số lượng công việc theo từng trạng thái (Status) và mức độ ưu tiên (Priority) — đây chính là nguồn dữ liệu để hiển thị lên bảng điều khiển (Dashboard) ở phía giao diện người dùng."

---

### Phần 4: Kiểm chứng Cơ sở dữ liệu MySQL (4:30 - 6:00)

> "Cuối cùng trong phần trình bày của mình, em sẽ truy cập trực tiếp vào bên trong container MySQL để xác nhận rằng dữ liệu thực sự được lưu trữ bền vững trong cơ sở dữ liệu."

💻 **Chạy lệnh đếm số lượng công việc theo trạng thái (macOS):**
```bash
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; SELECT COUNT(*) AS total, status FROM tasks GROUP BY status;"
```

> "Và chúng ta cũng có thể kiểm tra chi tiết cấu trúc của bảng `tasks` bằng câu lệnh `DESCRIBE tasks`."

💻 **Chạy lệnh xem cấu trúc bảng (macOS):**
```bash
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; DESCRIBE tasks;"
```

> "Như trên màn hình, bảng `tasks` bao gồm đầy đủ các trường thông tin: `id`, `title`, `description`, `status`, `priority`, `created_at` và `updated_at`. Toàn bộ dữ liệu này được lưu trữ bền vững thông qua Docker Volume có tên là **taskflow-mysql**, đảm bảo không bị mất dữ liệu ngay cả khi khởi động lại container.
>
> Phần trình bày của em đến đây là kết thúc. Tiếp theo, xin mời bạn **[Tên người 2]** sẽ tiếp tục demo phần giao diện người dùng và các thao tác thêm, sửa, xóa cũng như kiểm thử cân bằng tải."

---

## 📋 TỔNG HỢP LỆNH MACOS ĐỂ COPY NHANH KHI QUAY
*(Đã loại bỏ các dòng comment `#` để bạn có thể copy từng dòng hoặc cả cụm dán thẳng vào Terminal `zsh` trên macOS)*

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
