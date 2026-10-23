# 🎬 KỊCH BẢN DEMO VIDEO - 3 NGƯỜI (FULL TIẾNG VIỆT)
## TaskFlow - Dockerized Node.js Web Application

> **Mục tiêu:** Chia đều phần trình bày cho 3 thành viên bằng tiếng Việt mạch lạc, tổng thời gian ~17-18 phút, đảm bảo mỗi người nói khoảng 5-6 phút.
>
> **Nguyên tắc:** Mỗi người tự quay màn hình + giọng của mình. Có thể ghép video cuối cùng bằng CapCut/Premiere. Mỗi người cần thấy mặt + nghe giọng (kết hợp webcam + screen share).

---

## 📋 THÔNG TIN CHUNG

| Mục | Chi tiết |
|-----|----------|
| **Project** | TaskFlow - Dockerized Task Manager |
| **Môn học** | Web Programming with NodeJS - 502070 |
| **Giảng viên** | Mai Văn Mạnh |
| **Stack** | Docker, Node.js, React, MySQL, Redis, Nginx, Docker Swarm, Kubernetes |
| **Tổng thời gian** | ~17 phút (3 × ~5-6 phút) |
| **Ngôn ngữ** | Thuyết trình hoàn toàn bằng Tiếng Việt |

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

1. **Khởi động Docker Desktop** và đợi biểu tượng chuyển sang màu xanh.
2. **Mở 2-3 cửa sổ Terminal** (trên Mac hoặc PowerShell trên Windows).
3. **Di chuyển vào thư mục project:**
   - **Mac/Linux:**
     ```bash
     cd /Users/iannwendy/Desktop/NodeMidterm
     ```
   - **Windows PowerShell:**
     ```powershell
     cd C:\Users\<YourName>\Desktop\NodeMidterm
     ```
4. **Khởi chạy và làm mới tất cả services:**
   ```bash
   docker compose up -d --build --force-recreate
   ```
5. **Đợi khoảng 30-60 giây** cho các services chuyển sang trạng thái `healthy`.
6. **Kiểm tra mọi thứ đã sẵn sàng:**
   ```bash
   docker compose ps
   ```
   → Tất cả phải ở trạng thái `Up` và `healthy`.

### Mở sẵn các cửa sổ

| Cửa sổ | Mở gì | Dùng để |
|--------|--------|---------|
| Terminal A | Project root | Chạy lệnh docker và curl |
| Terminal B | `docker compose logs -f worker1` | Xem logs worker real-time |
| Browser | http://localhost:8080 | Frontend UI |
| Browser (tab 2) | http://localhost:3000/api/health | API Health |
| Code editor | VSCode mở project | Show code khi cần |

### Lỗi thường gặp & fix nhanh

| Lỗi | Cách xử lý |
|-----|-----------|
| Service không healthy | `docker compose up -d --build --force-recreate` |
| Port 8080/3000 bị chiếm | `lsof -i :8080` (Mac) / `netstat -ano \| findstr :8080` (Win) |
| Frontend trắng trang | Clear cache (`Cmd+Shift+R` / `Ctrl+Shift+R`) + `docker compose restart frontend` |
| Worker không nhận message | `docker compose logs worker1` xem lỗi |
| MySQL chưa ready | Đợi thêm 30s, MySQL khởi tạo lần đầu cần thời gian |

---

# 👤 NGƯỜI 1 - LEADER (INTRO + LEVEL 1 BACKEND & DATABASE)
## Thời gian: 0:00 - 6:00 (6 phút)

### Mục tiêu
- Giới thiệu project, thành viên và 3 cấp độ (Levels) của đồ án
- Kiểm tra danh sách Docker containers
- Kiểm thử các Backend API endpoints
- Kiểm chứng dữ liệu trong MySQL database

### Phần 1: Giới thiệu mở đầu (0:00 - 1:30) ⭐ 90 giây

**[GÓC MÁY: Webcam (full màn hình) hoặc mở sơ đồ kiến trúc kèm cam góc dưới]**

**Hành động:** Mở slide/sơ đồ kiến trúc hoặc nói trực tiếp vào camera.

**Lời dẫn (Tiếng Việt):**

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

**[Hành động:]** Chuyển sang màn hình Terminal A.

---

### Phần 2: Kiểm tra Docker Containers (1:30 - 2:30) ⭐ 60 giây

**[GÓC MÁY: Terminal A - toàn màn hình]**

**Hành động:** Chạy lệnh `docker compose ps`, phóng to chữ cho dễ nhìn.

**Lệnh (Mac/Linux & Windows giống nhau):**
```bash
docker compose ps
```

**Lời dẫn (Tiếng Việt):**

> "Đầu tiên, chúng ta sẽ kiểm tra xem toàn bộ các Docker container của hệ thống đã hoạt động ổn định hay chưa. Em sẽ chạy lệnh `docker compose ps` để liệt kê danh sách tất cả các dịch vụ đang chạy."

**Giải thích khi nhìn vào kết quả trên màn hình:**

> "Như thầy và các bạn có thể thấy trên màn hình, hiện tại toàn bộ các dịch vụ của hệ thống đều đang hoạt động:
> - Thứ nhất là **taskflow-frontend**: Giao diện người dùng viết bằng React, được mở ở cổng **8080**.
> - Thứ hai là **taskflow-nginx**: Bộ cân bằng tải (Load Balancer) lắng nghe ở cổng **3000**.
> - Tiếp theo là **taskflow-backend-1, backend-2 và backend-3**: Ba bản sao (replicas) của Node.js API server.
> - **taskflow-redis**: Đóng vai trò là Message Broker (trung gian truyền tải thông điệp).
> - **taskflow-worker-1 và worker-2**: Hai worker xử lý các tác vụ ngầm bất đồng bộ.
> - Và cuối cùng là **taskflow-database**: Cơ sở dữ liệu MySQL phiên bản 8 chạy ở cổng **3306**.
>
> Tất cả các dịch vụ đều đang ở trạng thái **Up** và **healthy**, nghĩa là toàn bộ hạ tầng của chúng ta đã sẵn sàng hoạt động."

---

### Phần 3: Kiểm thử Backend API (2:30 - 4:30) ⭐ 120 giây

**[GÓC MÁY: Terminal A]**

#### 3.1 - Health Check

**Lệnh (Mac/Linux):**
```bash
curl -s http://localhost:3000/api/health | python3 -m json.tool
```

**Lệnh (Windows PowerShell):**
```powershell
Invoke-RestMethod http://localhost:3000/api/health | ConvertTo-Json
```

**Lời dẫn (Tiếng Việt):**

> "Tiếp theo, em sẽ tiến hành kiểm thử trực tiếp các API ở phía Backend. Đầu tiên là endpoint kiểm tra sức khỏe hệ thống (`/api/health`)."

**Giải thích kết quả:**

> "Kết quả trả về từ Health endpoint bao gồm:
> - **status**: `ok` — cho biết server đang hoạt động tốt.
> - **instance**: `backend-1` (hoặc 2, 3) — đây là mã định danh duy nhất của từng container backend, giúp chúng ta kiểm chứng tính năng cân bằng tải ở phần sau.
> - **database** và **redis**: đều ở trạng thái `ok` (đã kết nối thành công kèm thời gian phản hồi).
> - Cùng với thông số **uptime** cho biết thời gian máy chủ đã hoạt động liên tục."

#### 3.2 - Lấy danh sách toàn bộ công việc (Get All Tasks)

**Lệnh (Mac/Linux):**
```bash
curl -s http://localhost:3000/api/tasks | python3 -c 'import sys,json; d=json.load(sys.stdin); print("Total tasks:", len(d.get("data", d)))'
```

**Lệnh (Windows PowerShell):**
```powershell
(Invoke-RestMethod http://localhost:3000/api/tasks).data.Count
```

**Lời dẫn (Tiếng Việt):**

> "Tiếp theo, chúng ta sẽ gọi API lấy danh sách toàn bộ các công việc hiện có trong hệ thống. Kết quả trả về tổng cộng **21 công việc mẫu (sample tasks)** được đọc trực tiếp từ cơ sở dữ liệu MySQL."

#### 3.3 - Kiểm tra API Thống kê (Get Statistics)

**Lệnh (Mac/Linux):**
```bash
curl -s http://localhost:3000/api/stats | python3 -m json.tool
```

**Lệnh (Windows PowerShell):**
```powershell
Invoke-RestMethod http://localhost:3000/api/stats | ConvertTo-Json
```

**Lời dẫn (Tiếng Việt):**

> "Tiếp tục, em sẽ kiểm tra thêm endpoint thống kê (`/api/stats`). Endpoint này trả về sự phân bổ số lượng công việc theo từng trạng thái (Status) và mức độ ưu tiên (Priority) — đây chính là nguồn dữ liệu để hiển thị lên bảng điều khiển (Dashboard) ở phía giao diện người dùng."

---

### Phần 4: Kiểm chứng Cơ sở dữ liệu MySQL (4:30 - 6:00) ⭐ 90 giây

**[GÓC MÁY: Terminal A]**

**Lệnh đếm số lượng công việc theo trạng thái (Mac/Linux & Windows giống nhau):**
```bash
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; SELECT COUNT(*) AS total, status FROM tasks GROUP BY status;"
```

**Lời dẫn (Tiếng Việt):**

> "Cuối cùng trong phần trình bày của mình, em sẽ truy cập trực tiếp vào bên trong container MySQL để xác nhận rằng dữ liệu thực sự được lưu trữ bền vững trong cơ sở dữ liệu."

**Lệnh xem cấu trúc bảng (Mac/Linux & Windows giống nhau):**
```bash
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; DESCRIBE tasks;"
```

**Lời dẫn (Tiếng Việt):**

> "Và chúng ta cũng có thể kiểm tra chi tiết cấu trúc của bảng `tasks` bằng câu lệnh `DESCRIBE tasks`. Như trên màn hình, bảng `tasks` bao gồm đầy đủ các trường thông tin: `id`, `title`, `description`, `status`, `priority`, `created_at` và `updated_at`. Toàn bộ dữ liệu này được lưu trữ bền vững thông qua Docker Volume có tên là **taskflow-mysql**, đảm bảo không bị mất dữ liệu ngay cả khi khởi động lại container.
>
> Phần trình bày của em đến đây là kết thúc. Tiếp theo, xin mời bạn **[Tên người 2]** sẽ tiếp tục demo phần giao diện người dùng và các thao tác thêm, sửa, xóa cũng như kiểm thử cân bằng tải."

**[Hành động:]** Cười, gật đầu, chuyển quyền cho Người 2.

---

### ✅ Checklist cho Người 1 trước khi quay

- [ ] Docker Desktop đang chạy
- [ ] Tất cả containers `Up` và `healthy`
- [ ] Terminal đã mở ở đúng thư mục project
- [ ] Đã test chạy thử 3 lệnh curl trên
- [ ] Đã thử lệnh mysql exec chạy mượt
- [ ] Webcam sẵn sàng + mic test OK
- [ ] Có slide/sơ đồ kiến trúc để show ở phần intro

---

# 👤 NGƯỜI 2 - FRONTEND & LOAD BALANCING
## Thời gian: 6:00 - 12:00 (6 phút)

### Mục tiêu
- Demo giao diện React trên trình duyệt
- Thực hiện các thao tác CRUD (Thêm, Sửa, Xóa) trực tiếp trên giao diện
- Chứng minh cơ chế cân bằng tải (Load Balancing) qua Nginx

### Phần 1: Tổng quan giao diện Frontend (6:00 - 7:00) ⭐ 60 giây

**[GÓC MÁY: Trình duyệt - http://localhost:8080 - toàn màn hình]**

**Hành động:** Mở trình duyệt, truy cập `http://localhost:8080`. Di chuột vào các số liệu trên Dashboard và giải thích.

**Lời dẫn (Tiếng Việt):**

> "Xin chào thầy và các bạn, em là **[Tên người 2]**. Tiếp nối phần của bạn **[Tên người 1]**, em xin trình bày phần **giao diện người dùng (Frontend)** của ứng dụng. Đây là một ứng dụng đơn trang (**React SPA**) được phục vụ bởi container Nginx trên cổng **8080**.
>
> Trên màn hình chính là khu vực **Dashboard** hiển thị tổng số lượng công việc, sự phân bổ theo từng trạng thái — bao gồm **To Do** (Cần làm), **In Progress** (Đang thực hiện) và **Done** (Đã hoàn thành) — cùng với danh sách các hoạt động gần đây. Toàn bộ dữ liệu này được lấy từ cụm Backend thông qua bộ cân bằng tải Nginx."

---

### Phần 2: Thao tác CREATE - Tạo Công Việc Mới (7:00 - 8:15) ⭐ 75 giây

**[GÓC MÁY: Trình duyệt]**

**Hành động:**
1. Click nút **"+"** (Floating Action Button) ở góc dưới bên phải màn hình.
2. Cửa sổ Modal hiện ra, điền thông tin:
   - **Title:** `Demo bởi [Tên bạn] - Level 1`
   - **Description:** `Kiểm thử chức năng CRUD qua giao diện`
   - **Status:** `To Do`
   - **Priority:** `High`
3. Click nút **"Create Task"**.

**Lời dẫn (Tiếng Việt):**

> "Bây giờ em sẽ demo thao tác **CREATE (Tạo mới công việc)**. Em nhấn vào **nút dấu cộng (+)** ở góc dưới bên phải để mở biểu mẫu tạo công việc.
>
> Em sẽ nhập tiêu đề, mô tả chi tiết, chọn trạng thái và mức độ ưu tiên là Cao (High), sau đó nhấn **Create Task**.
>
> Về luồng xử lý bên dưới hệ thống khi em nhấn nút tạo:
> 1. Đầu tiên, Frontend gửi một **POST request** đến đường dẫn `/api/tasks`.
> 2. Request này đi qua **bộ cân bằng tải Nginx** ở cổng 3000.
> 3. Nginx sẽ điều hướng request đến một trong **3 bản sao (replicas) của Backend**.
> 4. Backend tiến hành lưu công việc mới vào cơ sở dữ liệu **MySQL**.
> 5. Đồng thời, Backend đẩy một **thông báo (notification)** vào hàng đợi **Redis** để các Worker xử lý bất đồng bộ.
>
> Như thầy và các bạn thấy, công việc mới đã xuất hiện ngay lập tức ở đầu danh sách và tổng số công việc trên Dashboard đã tăng lên **22**."

---

### Phần 3: Thao tác UPDATE & DELETE (8:15 - 9:30) ⭐ 75 giây

**[GÓC MÁY: Trình duyệt]**

#### Thao tác UPDATE (Cập nhật trạng thái)

**Hành động:**
1. Tìm công việc vừa tạo ở đầu danh sách.
2. Click nút **"Start"** (trạng thái chuyển sang `In Progress`).
3. Click nút **"Complete"** (trạng thái chuyển sang `Done`).

**Lời dẫn (Tiếng Việt):**

> "Tiếp theo đối với thao tác **UPDATE (Cập nhật)**, ngay trên công việc vừa tạo, em nhấn nút **Start** để chuyển trạng thái từ *To Do* sang *In Progress*, sau đó nhấn **Complete** để đánh dấu công việc là *Done* (Đã hoàn thành). Mỗi thao tác sẽ gửi một **PUT request** xuống API để cập nhật trực tiếp vào MySQL."

#### Thao tác DELETE (Xóa công việc)

**Hành động:**
1. Tìm công việc vừa tạo.
2. Click biểu tượng **thùng rác** (Trash icon).
3. Xác nhận xóa (Confirm).

**Lời dẫn (Tiếng Việt):**

> "Đối với thao tác **DELETE (Xóa)**, em nhấn vào biểu tượng thùng rác và xác nhận xóa. Công việc sẽ được xóa khỏi cơ sở dữ liệu thông qua một **DELETE request** gửi đến API, và tổng số lượng công việc trên bảng điều khiển đã quay trở về **21**."

---

### Phần 4: Demo Cân Bằng Tải - Load Balancing (9:30 - 12:00) ⭐ 150 giây

**[GÓC MÁY: Terminal A]**

#### 4.1 - Xem cấu hình Nginx Load Balancer

**Lệnh (Mac/Linux):**
```bash
cat nginx/nginx.conf | grep -A13 "upstream backend_cluster"
```

**Lệnh (Windows PowerShell):**
```powershell
Get-Content nginx/nginx.conf | Select-String -Pattern "upstream backend_cluster" -Context 0,13
```

**Lời dẫn (Tiếng Việt):**

> "Tiếp theo, em sẽ chứng minh cơ chế **cân bằng tải (Load Balancing)** của hệ thống ở **Level 2** đang hoạt động. Trước tiên, em xin hiển thị cấu hình của **Nginx**."

**Giải thích:**

> "Trong file `nginx.conf`, nhóm em đã cấu hình một khối **upstream** có tên là `backend_cluster` sử dụng thuật toán **`least_conn`** — nghĩa là Nginx sẽ ưu tiên phân phối từng request mới đến máy chủ Backend nào đang có ít kết nối hoạt động nhất.
>
> Bên trong cụm này, chúng ta có **3 máy chủ Backend**: `backend1`, `backend2` và `backend3` cùng lắng nghe ở cổng nội bộ 3000."

#### 4.2 - Kiểm thử phân phối tải thực tế

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

**Lời dẫn (Tiếng Việt):**

> "Bây giờ, em sẽ chạy một vòng lặp gửi liên tiếp **15 request** kiểm tra sức khỏe hệ thống đến cổng 3000 của Nginx. Mỗi phản hồi trả về sẽ cho biết chính xác **mã định danh (`instance`)** của container Backend nào đã xử lý request đó."

**Hành động:** Chạy lệnh, đợi kết quả hiển thị:
```
   5 "instance":"backend-1"
   5 "instance":"backend-2"
   5 "instance":"backend-3"
```

**Giải thích:**

> "Nhìn vào kết quả thống kê trên màn hình, 15 request đã được **phân bổ đều qua cả 3 máy chủ**: `backend-1`, `backend-2` và `backend-3` (mỗi máy chủ xử lý 5 request). Điều này chứng minh rằng **bộ cân bằng tải Nginx** đang hoạt động hoàn toàn chính xác."

#### 4.3 - Kiểm tra biến môi trường INSTANCE_ID của từng Backend

**Lệnh (Mac/Linux & Windows giống nhau):**
```bash
docker compose exec backend1 sh -c 'echo $INSTANCE_ID'
docker compose exec backend2 sh -c 'echo $INSTANCE_ID'
docker compose exec backend3 sh -c 'echo $INSTANCE_ID'
```

**Lời dẫn (Tiếng Việt):**

> "Mỗi container Backend đều được gắn một biến môi trường `INSTANCE_ID` riêng biệt. Như trên màn hình, `backend1`, `backend2` và `backend3` lần lượt trả về đúng mã định danh của mình.
>
> Phần trình bày của em đến đây là hết. Xin mời bạn **[Tên người 3]** tiếp tục trình bày về **hàng đợi Redis**, **tiến trình xử lý ngầm Worker** và **điều phối container ở Level 3**."

**[Hành động:]** Chuyển quyền cho Người 3.

---

### ✅ Checklist cho Người 2 trước khi quay

- [ ] Frontend load OK tại `http://localhost:8080`
- [ ] Đã thử tạo và xóa 1 task nháp trước khi quay
- [ ] Biết chính xác vị trí nút `+`, `Start`, `Complete`, biểu tượng thùng rác
- [ ] Test lệnh vòng lặp `for` (Mac) hoặc PowerShell loop (Windows) chạy đúng
- [ ] Webcam + mic OK

---

# 👤 NGƯỜI 3 - REDIS, WORKER & ORCHESTRATION
## Thời gian: 12:00 - 17:30 (5.5 phút)

### Mục tiêu
- Kiểm tra Redis Message Broker đang hoạt động
- Giải thích mã nguồn của Worker và cơ chế publish từ Backend
- Demo trực tiếp (Live Demo): Tạo task trên giao diện → Worker nhận và xử lý thông báo theo thời gian thực
- Trình bày cấu hình Docker Swarm và Kubernetes (Level 3)
- Tổng kết toàn bộ đồ án

### Phần 1: Kiểm tra Redis Message Broker (12:00 - 12:45) ⭐ 45 giây

**[GÓC MÁY: Terminal A]**

**Hành động:** Chạy lệnh kiểm tra trạng thái và ping Redis.

**Lệnh (Mac/Linux & Windows giống nhau):**
```bash
docker compose ps redis
docker compose exec redis redis-cli ping
```

**Lời dẫn (Tiếng Việt):**

> "Xin chào thầy và các bạn, em là **[Tên người 3]**. Tiếp theo, em xin trình bày về **Redis Message Broker** và cơ chế xử lý bất đồng bộ của hệ thống.
>
> Khi chạy lệnh `docker compose ps redis`, chúng ta thấy container Redis đang hoạt động tốt. Và khi kiểm tra bằng lệnh `redis-cli ping`, Redis phản hồi lại là **PONG**, xác nhận rằng Message Broker đang khỏe mạnh và sẵn sàng tiếp nhận kết nối."

---

### Phần 2: Giải thích mã nguồn Worker (12:45 - 13:45) ⭐ 60 giây

**[GÓC MÁY: VSCode hoặc Terminal]**

**Lành động:** Hiển thị đoạn code xử lý hàng đợi trong `worker/src/worker.js`.

**Lệnh (Mac/Linux):**
```bash
grep -A15 "blpop" worker/src/worker.js
```

**Lệnh (Windows PowerShell):**
```powershell
Get-Content worker/src/worker.js | Select-String -Pattern "blpop" -Context 0,15
```

**Lời dẫn (Tiếng Việt):**

> "Trên màn hình là mã nguồn của dịch vụ **Worker**. Worker sử dụng câu lệnh **`BLPOP` (Blocking Left Pop)** để lấy các thông điệp từ hàng đợi Redis có tên là `task:notifications`.
>
> Cơ chế `BLPOP` sẽ chờ tối đa 5 giây nếu hàng đợi đang trống rồi mới tiếp tục vòng lặp. Đây là kỹ thuật **xử lý bất đồng bộ không gây nghẽn (non-blocking async processing)**, giúp Worker không bị tiêu tốn tài nguyên CPU một cách lãng phí khi chưa có công việc mới."

---

### Phần 3: Cơ chế Backend đẩy thông điệp vào Redis (13:45 - 14:30) ⭐ 45 giây

**[GÓC MÁY: Terminal]**

**Lệnh (Mac/Linux):**
```bash
grep -rnE "publish|lpush|rpush" backend/src/ | head -10
```

**Lệnh (Windows PowerShell):**
```powershell
Get-ChildItem -Path backend/src -Recurse -Filter *.js | Select-String -Pattern "publish|lpush|rpush" | Select-Object -First 10
```

**Lời dẫn (Tiếng Việt):**

> "Ở phía Backend, mỗi khi có một công việc mới được tạo ra hoặc cập nhật, hàm `publishTaskNotification` sẽ sử dụng lệnh `lpush` để đẩy một **thông điệp thông báo** vào hàng đợi Redis. Đây chính là kiến trúc **tách rời dịch vụ (Service Decoupling)** — giúp API phản hồi ngay lập tức cho người dùng mà không cần phải chờ tiến trình gửi thông báo hoàn tất."

---

### Phần 4: Live Demo - Worker Xử Lý Task Thời Gian Thực (14:30 - 15:30) ⭐ 60 giây

**[GÓC MÁY: Terminal B (xem logs) + Trình duyệt (chia đôi màn hình nếu được)]**

**Bước 1:** Mở Terminal B, chạy lệnh theo dõi log trực tiếp của `worker1`:

**Lệnh (Mac/Linux & Windows giống nhau):**
```bash
docker compose logs -f worker1
```

**Bước 2:** Mở trình duyệt tại `http://localhost:8080`, tạo một công việc mới:
- **Title:** `Live Demo bởi [Tên bạn]`
- Nhấn **Create Task** (nếu `worker2` nhận task đó thì tạo thêm 1 task nữa hoặc chạy `docker compose logs -f worker1 worker2`).

**Lệnh khuyên dùng để thấy cả 2 worker cùng lúc (Mac/Linux & Windows):**
```bash
docker compose logs -f worker1 worker2
```

**Lời dẫn (Tiếng Việt):**

> "Bây giờ chúng ta sẽ xem luồng xử lý bất đồng bộ này hoạt động thực tế. Em sẽ mở log theo dõi trực tiếp các Worker ở cửa sổ Terminal này, sau đó quay sang trình duyệt và tạo một công việc mới."

**Giải thích khi log hiện lên trên Terminal:**

> "Thầy và các bạn có thể quan sát ngay trên màn hình log: Ngay khi công việc vừa được tạo, Worker đã lập tức nhận được thông điệp từ hàng đợi Redis, tiến hành xử lý thông báo cho công việc đó và báo cáo hoàn tất. Điều này chứng minh luồng xử lý bất đồng bộ **API → Redis → Worker** hoạt động hoàn toàn trơn tru."

*(Nhấn `Ctrl + C` trên Terminal để thoát chế độ xem log trực tiếp trước khi sang phần 5)*

---

### Phần 5: Điều phối với Docker Swarm - Level 3 (15:30 - 16:15) ⭐ 45 giây

**[GÓC MÁY: Terminal]**

**Lệnh (Mac/Linux & Windows giống nhau):**
```bash
cat docker-stack.yml | head -50
```

**Lời dẫn (Tiếng Việt):**

> "Đối với **Level 3 (Điều phối Container)**, đầu tiên nhóm chúng em đã xây dựng file cấu hình **Docker Swarm** trong `docker-stack.yml`."

**Lệnh tiếp theo:**
```bash
grep -A2 "replicas:" docker-stack.yml
```

**Lời dẫn (Tiếng Việt):**

> "File cấu hình này định nghĩa đầy đủ số lượng bản sao (`replicas`), giới hạn tài nguyên CPU/RAM, chính sách tự khởi động lại và kiểm tra sức khỏe cho từng dịch vụ. Để triển khai và mở rộng quy mô trên Docker Swarm, chúng ta sử dụng các lệnh:
> - `docker swarm init` để khởi tạo cụm Swarm.
> - `docker stack deploy -c docker-stack.yml taskflow` để triển khai toàn bộ stack.
> - Và `docker service scale taskflow_backend1=5` khi cần tăng số lượng bản sao."

---

### Phần 6: Điều phối với Kubernetes - Level 3 (16:15 - 16:50) ⭐ 35 giây

**[GÓC MÁY: Terminal]**

**Lệnh (Mac/Linux & Windows giống nhau):**
```bash
ls kubernetes/
grep -c "kind: Deployment" kubernetes/deployment.yaml
grep -c "kind: Service" kubernetes/deployment.yaml
```

**Lời dẫn (Tiếng Việt):**

> "Bên cạnh Docker Swarm, nhóm cũng thiết lập đầy đủ bộ cấu hình **Kubernetes** nằm trong thư mục `kubernetes/`. File `deployment.yaml` bao gồm **6 Deployments**, **4 Services**, các **ConfigMaps**, **Secrets**, và đặc biệt là bộ **Horizontal Pod Autoscaler (HPA)** giúp tự động mở rộng số lượng Pod của Backend từ **2 lên đến 10 Pods** khi mức sử dụng CPU vượt quá 70%.
>
> Chúng ta có thể triển khai dễ dàng bằng lệnh `kubectl apply -f kubernetes/deployment.yaml`."

---

### Phần 7: Tổng kết & Kết luận (16:50 - 17:30) ⭐ 40 giây

**[GÓC MÁY: Webcam (full màn hình) hoặc Slide tổng kết]**

**Lời dẫn (Tiếng Việt):**

> "Để tổng kết lại buổi demo hôm nay, nhóm chúng em đã hoàn thành và chứng minh đầy đủ cả 3 cấp độ của đồ án:
>
> - ✅ **Ở Level 1:** Đóng gói thành công 3 thành phần cốt lõi gồm giao diện React, máy chủ Node.js và cơ sở dữ liệu MySQL vào các Docker container, giao tiếp qua mạng nội bộ và lưu trữ dữ liệu bền vững.
> - ✅ **Ở Level 2:** Triển khai mở rộng 3 bản sao Backend phía sau bộ cân bằng tải Nginx với thuật toán `least_conn`, kết hợp cùng Redis Message Broker và 2 Worker xử lý thông báo bất đồng bộ.
> - ✅ **Ở Level 3:** Xây dựng hoàn chỉnh kịch bản điều phối container cấp độ Production với cả Docker Swarm và Kubernetes tích hợp tính năng tự động mở rộng (Auto-scaling).
>
> Toàn bộ mã nguồn, Dockerfiles và hướng dẫn chi tiết từng bước để tái lập môi trường đều đã được nhóm đóng gói đầy đủ trong file `ReadMe.txt`.
>
> Cảm ơn thầy và các bạn đã lắng nghe phần trình bày của nhóm em! Em xin chân thành cảm ơn!"

**[Hành động:]** Vẫy tay chào kết thúc video.

---

### ✅ Checklist cho Người 3 trước khi quay

- [ ] Lệnh `docker compose exec redis redis-cli ping` trả về `PONG`
- [ ] Đã test thử tạo task và xem log `docker compose logs -f worker1 worker2` hoạt động
- [ ] Biết bấm `Ctrl + C` để thoát log `docker compose logs -f` trước khi gõ lệnh phần 5
- [ ] Webcam + mic OK

---

# 🔧 DANH SÁCH LỆNH NHANH (CHEAT SHEET - ĐÃ FIX TOÀN BỘ)

## Khởi động & Dừng

| Tác vụ | Mac/Linux | Windows PowerShell |
|--------|-----------|-------------------|
| Start | `docker compose up -d --build --force-recreate` | `docker compose up -d --build --force-recreate` |
| Stop | `docker compose stop` | `docker compose stop` |
| Xóa hết | `docker compose down -v` | `docker compose down -v` |
| Xem status | `docker compose ps` | `docker compose ps` |

## Logs

| Tác vụ | Mac/Linux | Windows PowerShell |
|--------|-----------|-------------------|
| Tất cả logs | `docker compose logs -f` | `docker compose logs -f` |
| Worker logs | `docker compose logs -f worker1 worker2` | `docker compose logs -f worker1 worker2` |
| 100 dòng cuối | `docker compose logs --tail=100` | `docker compose logs --tail=100` |

## Test API (Người 1)

**Mac/Linux (zsh/bash):**
```bash
curl -s http://localhost:3000/api/health | python3 -m json.tool
curl -s http://localhost:3000/api/tasks | python3 -c 'import sys,json; d=json.load(sys.stdin); print("Total tasks:", len(d.get("data", d)))'
curl -s http://localhost:3000/api/stats | python3 -m json.tool
```

**Windows PowerShell:**
```powershell
Invoke-RestMethod http://localhost:3000/api/health | ConvertTo-Json
(Invoke-RestMethod http://localhost:3000/api/tasks).data.Count
Invoke-RestMethod http://localhost:3000/api/stats | ConvertTo-Json
```

## Database (Người 1)

```bash
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; SELECT COUNT(*) AS total, status FROM tasks GROUP BY status;"
docker compose exec database mysql -uroot -ptaskflow123 -e "USE taskflow; DESCRIBE tasks;"
```

## Load Balancing Test (Người 2)

**Mac/Linux (zsh/bash):**
```bash
cat nginx/nginx.conf | grep -A13 "upstream backend_cluster"
for i in {1..15}; do curl -s http://localhost:3000/api/health | grep -o '"instance":"[^"]*"'; done | sort | uniq -c
docker compose exec backend1 sh -c 'echo $INSTANCE_ID'
docker compose exec backend2 sh -c 'echo $INSTANCE_ID'
docker compose exec backend3 sh -c 'echo $INSTANCE_ID'
```

**Windows PowerShell:**
```powershell
Get-Content nginx/nginx.conf | Select-String -Pattern "upstream backend_cluster" -Context 0,13
1..15 | ForEach-Object { (Invoke-WebRequest http://localhost:3000/api/health -UseBasicParsing).Content | Select-String -Pattern '"instance":"[^"]*"' } | Group-Object | Select-Object Name, Count
docker compose exec backend1 sh -c 'echo $INSTANCE_ID'
docker compose exec backend2 sh -c 'echo $INSTANCE_ID'
docker compose exec backend3 sh -c 'echo $INSTANCE_ID'
```

## Redis, Worker & Orchestration (Người 3)

**Mac/Linux (zsh/bash):**
```bash
docker compose ps redis
docker compose exec redis redis-cli ping
grep -A15 "blpop" worker/src/worker.js
grep -rnE "publish|lpush|rpush" backend/src/ | head -10
docker compose logs -f worker1 worker2
cat docker-stack.yml | head -50
grep -A2 "replicas:" docker-stack.yml
ls kubernetes/
grep -c "kind: Deployment" kubernetes/deployment.yaml
grep -c "kind: Service" kubernetes/deployment.yaml
```

---

**Chúc nhóm quay video thành công! 🎬🚀**
