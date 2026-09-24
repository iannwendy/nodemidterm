# CLAUDE.md — Coding Agent for Dockerized Node.js Web Application

## Mục đích
Agent này chỉ làm **coding và technical implementation**. Không viết báo cáo, không tạo video, không soạn ReadMe cuối cùng.

---

## Nhiệm vụ chính

### 1. Chọn Level
- **Level 1 là bắt buộc** (frontend + backend Node.js + database)
- Level 2/3 là tùy chọn, chỉ claim khi đã chạy được thực tế

### 2. Thiết kế kiến trúc (trước khi code)

**Level 1 — Tối thiểu:**
```
frontend (React/HTML) → backend (Node.js:3000) → database (MongoDB/MySQL:3306)
                         ↕ Docker network
```

**Level 2 — Thêm:**
```
backend replicas (x2+) → nginx load balancer
                        → Redis/RabbitMQ broker → worker service
```

**Level 3 — Thêm:**
```
Kubernetes/Docker Swarm manifests cho orchestration
```

### 3. Cấu trúc thư mục
```
/project-root
├── frontend/          # React app hoặc static HTML
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── backend/           # Node.js Express API
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── database/          # MySQL init scripts hoặc MongoDB config
├── nginx/             # Load balancer config (Level 2+)
│   └── nginx.conf
├── broker/            # Redis/RabbitMQ worker (Level 2+)
│   ├── Dockerfile
│   └── src/
├── docker-compose.yml
├── .env.example       # Template, không hardcode secrets
└── README.md          # Chỉ hướng dẫn chạy, không phải báo cáo
```

### 4. Yêu cầu kỹ thuật

#### Dockerfile backend (Node.js)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]
```

#### docker-compose.yml (Level 1)
```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "8080:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=database
      - DB_PORT=3306
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
    depends_on:
      database:
        condition: service_healthy

  database:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      timeout: 5s
      retries: 10
    volumes:
      - db_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql

networks:
  default:
    name: app-network

volumes:
  db_data:
```

#### docker-compose.yml (Level 2 - thêm replicas + load balancer)
```yaml
services:
  # ... Level 1 services ...

  backend:
    # ... Level 1 config ...
    deploy:
      replicas: 3

  nginx:
    image: nginx:alpine
    ports:
      - "3000:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  worker:
    build: ./broker
    depends_on:
      - redis
      - backend

networks:
  default:
    name: app-network
```

#### nginx.conf (Level 2)
```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:3000;
    }

    server {
        listen 80;
        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### 5. Quy tắc coding

1. **Không hardcode secrets** — dùng biến môi trường từ `.env`
2. **Health check** cho database để backend chờ DB ready
3. **npm ci** thay vì npm install trong Dockerfile ( reproducible builds)
4. **Docker network** — tất cả services phải cùng network để giao tiếp
5. **Volume** cho database để data persist
6. **Init script** cho database seed data mẫu

### 6. Kiểm thử

Sau khi code xong, chạy:
```bash
docker compose up -d --build
docker compose ps          # Kiểm tra tất cả containers đang chạy
docker compose logs        # Xem logs nếu có lỗi
curl http://localhost:8080 # Test frontend
curl http://localhost:3000/api/health # Test backend
```

### 7. Checklist trước khi bàn giao

- [ ] `docker compose up -d` chạy thành công từ thư mục gốc
- [ ] Frontend có thể gọi backend API
- [ ] Backend đọc/ghi database thành công
- [ ] Level 2: Load balancer phân phối request đến replicas
- [ ] Level 2: Worker nhận message từ broker
- [ ] Không có credentials thật trong code
- [ ] Có `.env.example` làm template

### 8. Giới hạn

- **Không viết báo cáo** — chỉ cung cấp technical details, sơ đồ kiến trúc dạng ASCII/text
- **Không tạo video** — cung cấp kịch bản demo commands
- **Không quay video** — đánh dấu đây là việc của nhóm
- **ReadMe chỉ hướng dẫn chạy** — không phải báo cáo project

---

## Nguồn tham chiếu
- `agent.md` — hướng dẫn đầy đủ bao gồm cả báo cáo
- `NodeJS Mid-term Essay (1).pdf` — rubric và yêu cầu gốc
