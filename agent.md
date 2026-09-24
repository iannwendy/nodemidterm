# AGENT.md — NodeJS Mid-term Essay: Dockerized Web Application

## 1. Bối cảnh, mục tiêu và phạm vi

- Môn: **Web Programming with NodeJS — 502070**; học kỳ 2, năm học **2024–2025**; giảng viên **Mai Van Manh**.
- Nhóm thông thường gồm **2–3 thành viên**. Cần phân chia công việc công bằng và chứng minh hiểu rõ phần mình làm.
- Mục đích: nghiên cứu nền tảng Docker (kiến trúc, ưu điểm, trường hợp sử dụng), rồi **Dockerize một ứng dụng web Node.js** để triển khai nhiều dịch vụ một cách dễ duy trì, có khả năng mở rộng.
- Kết quả học tập: hiểu Docker và containerization; chạy ứng dụng nhiều service; scale bằng Docker Compose hoặc orchestration; áp dụng load balancing, tách service và orchestration khi chọn mức nâng cao.
- Phần thực hành phải dùng **Docker và Docker Compose**. Có thể nghiên cứu Docker Swarm, Kubernetes hoặc ECS cho mức nâng cao.
- Đây là yêu cầu tạo **source, báo cáo, video và hướng dẫn**, không chỉ một bản thuyết minh. Không tự nhận một Level hay tính năng đã đạt khi chưa có bằng chứng chạy được.

## 2. Chọn Level trước khi triển khai

| Mức | Yêu cầu tích lũy | Cách kiểm chứng cần thể hiện |
| --- | --- | --- |
| **Level 1** | Docker Compose với **ít nhất ba services**: frontend (HTML/React/Angular hoặc tương đương), backend **Node.js**, database (MySQL/MongoDB hoặc tương đương). Các service ở cùng Docker network và giao tiếp được. Giảng viên phải khởi chạy được bằng đúng `docker compose up -d`; cài dependency như `npm install` phải nằm trong Dockerfile/Compose, không yêu cầu bước thủ công. | Từ môi trường sạch chạy lệnh trên; mở frontend; gọi backend từ luồng frontend; đọc/ghi database qua backend; trình bày network/service health. |
| **Level 2** | Toàn bộ Level 1, cộng **nhân bản một service**, **load balancing** giữa các instance, và **service decoupling** qua RabbitMQ/Redis hay intermediary tương đương để xử lý **bất đồng bộ**. Ví dụ: upload → broker → xử lý file; đăng ký → broker → gửi lời chào; đặt hàng → broker → email thông báo. | Chứng minh request thực sự đi qua nhiều instance và tác vụ được publish/consume qua broker; không chỉ khai báo service hoặc dùng Redis như cache. |
| **Level 3** | Toàn bộ Level 2, cộng **triển khai thực sự** trên Docker Swarm, Kubernetes hoặc nền tảng orchestration tương đương (rubric nêu cả ECS); giải thích tác động đến scalability, availability và service management. | Có manifest/config và các lệnh/bằng chứng triển khai, scaling, quản lý service trên platform đã chọn. Chỉ mô tả kiến trúc dự kiến chưa đạt yêu cầu demo. |

**Quy tắc làm việc:** Xác định Level nhóm muốn nộp từ yêu cầu người dùng hoặc cấu hình dự án hiện có. Nếu chưa xác định, hoàn thành **Level 1** trước; các phần Level 2 và 3 là phần cộng dồn và cần được nêu rõ là chưa thực hiện cho đến khi chạy được. Đề không ấn định chủ đề ứng dụng cụ thể: có thể chọn một bài toán nhỏ, dễ demo luồng frontend → backend → database và, nếu cần, một tác vụ bất đồng bộ có ý nghĩa.

## 3. Cấu trúc báo cáo bắt buộc

Tuân theo **format chuẩn của khoa** khi có mẫu/hướng dẫn chính thức. Không tự suy đoán logo, tên khoa, tên nhóm, MSSV hay thông tin tài khoản. Báo cáo nộp dạng **Word hoặc PDF**, có sáu phần chính sau:

1. **Introduction to Docker:** Docker là gì, vì sao quan trọng với phát triển web; định nghĩa container, image, Dockerfile, Docker Compose và container orchestration.
2. **Theoretical Survey:** Kiến trúc Docker và nền tảng như **namespaces, cgroups, union file systems**; Docker giúp phát triển/deploy Node.js thế nào; lợi ích và thách thức của containerization, gồm scalability, isolation và deployment automation.
3. **Project Overview:** Bối cảnh ứng dụng được chọn, lý do dùng Docker, các service (frontend/backend/database...) và tương tác giữa chúng.
4. **Architecture and Implementation:** Sơ đồ và giải thích kiến trúc thực tế; vai trò, Dockerfile, Compose file, network, cấu hình và tương tác các service. Nếu làm Level 2: cách scale, load balance và decouple. Nếu làm Level 3: vai trò và hiệu quả của Swarm/Kubernetes/nền tảng đã dùng.
5. **Results and Discussion:** Kết quả chạy; quan sát **performance, scalability, reliability** trên cơ sở bằng chứng; khó khăn gặp phải và cách giải quyết. Không bịa số đo hoặc kết quả benchmark.
6. **Conclusion:** Kiến thức thu được; Docker tác động đến phát triển và triển khai web hiện đại như thế nào.

Rubric cũng lưu ý có thể cần **appendix, requirement analysis, system design, phân tích/so sánh kết quả** theo format khoa. Kiểm tra mẫu khoa để thêm những phần đó đúng vị trí. Ưu tiên giải thích hệ thống, nguyên lý, cách triển khai và kết quả; không biến báo cáo thành bản chép code.

### Chất lượng trình bày cần kiểm soát

- Bìa: logo rõ, đúng màu và đúng thông tin trường/khoa/giảng viên/nhóm/đề tài/môn học.
- Chính tả, font, màu, cỡ chữ, lề và giãn dòng nhất quán; tránh lạm dụng bullet points.
- Dùng hình, sơ đồ, bảng và biểu đồ để giải thích. Ảnh/screenshot đúng tỷ lệ, rõ chữ, nền dễ đọc và bỏ nội dung dư.
- Báo cáo và video **nên bằng tiếng Anh** vì có thể bị trừ điểm nếu không dùng tiếng Anh.

## 4. Toàn bộ thành phần phải nộp

1. **Complete Report (`.docx` hoặc `.pdf`):** Đúng format khoa; đủ lý thuyết, tổng quan dự án, kiến trúc, triển khai, kết quả/thảo luận và kết luận.
2. **Source code and dependencies:** Toàn bộ source của ứng dụng web Node.js, Dockerfile(s), Docker Compose file, các cấu hình và dependency (`package.json`, lockfile khi dùng). Có thể build/deploy bằng Docker; không để thiếu file cần thiết.
3. **Video presentation:** Giải thích dự án; demo ứng dụng Dockerized; chỉ rõ build, deploy, scale **nếu Level đã chọn yêu cầu**; demo tính năng chính; trình bày khó khăn và cách khắc phục. **Phải có âm thanh.** Tất cả thành viên phải xuất hiện trừ khi giảng viên đã cho phép ngoại lệ.
4. **`ReadMe.txt`:** Ngắn gọn, rõ ràng; cách build images, chạy containers và kiểm thử ứng dụng trên máy local. Nêu URL/port, dữ liệu hoặc tài khoản cần để giảng viên truy cập (đặc biệt admin nếu ứng dụng cần), cách xem luồng giữa service, cách dừng/reset và các lệnh scale/orchestration tương ứng với Level đã hoàn thành. Không đưa credentials thật của dịch vụ cá nhân vào repo.

**Điều kiện chặn chấm phần DEMO:** nếu thiếu **video có âm thanh** hoặc thiếu **source code đầy đủ kèm hướng dẫn**, toàn bộ phần demo 4 điểm sẽ không được đánh giá. Coding agent không thể tự ghi hình tiếng nói/thành viên thật khi chưa có đầu vào; phải bàn giao kịch bản và các lệnh demo rõ ràng để nhóm quay, đồng thời đánh dấu video là việc cần nhóm hoàn tất.

## 5. Rubric đầy đủ: 10 điểm

Đề chia **REPORT 6.0** và **DEMO 4.0**. Các cột đánh giá là 0, 25%, 50–75% và full; ở mục Level 3, bảng chỉ ghi rõ mức 0 và full, không tự đặt nội dung cho các mức giữa.

### REPORT — 6.0

| Tiêu chí | Điểm | 0 | 25% | 50–75% | Full score |
| --- | ---: | --- | --- | --- | --- |
| **Theoretical Understanding** | 2.0 | Không hiểu Docker hoặc thiếu khảo sát lý thuyết. | Nắm căn bản, nhắc vài khái niệm nhưng thiếu chi tiết/rõ ràng. | Có khái niệm chính nhưng thiếu chiều sâu kỹ thuật hoặc phần giải thích. | Hiểu toàn diện, sâu về image, container, Docker Compose, orchestration và các khái niệm chính. |
| **Project Overview & Context** | 1.0 | Không có tổng quan hoặc không rõ. | Mô tả cơ bản nhưng chưa rõ tương tác service/vai trò Docker. | Nêu project và service nhưng thiếu tương tác hoặc lý do dùng Docker. | Bối cảnh rõ, giải thích vì sao dùng Docker, trình bày đầy đủ tương tác service. |
| **Architecture and Implementation** | 1.0 | Không có kiến trúc hoặc triển khai Docker/Compose sai. | Kiến trúc cơ bản, thiếu cấu hình quan trọng hoặc tương tác service. | Kiến trúc/triển khai một phần, thiếu chi tiết Dockerfile hoặc network. | Kiến trúc đúng, mọi service rõ ràng, Dockerfile/Compose/network đầy đủ và triển khai chính xác. |
| **Report Structure and Presentation** | 2.0 | Không nộp hoặc lỗi nghiêm trọng trên bìa (logo méo/sai, màu hoặc thông tin trường, khoa, giảng viên, nhóm, đề tài, môn học sai). | Báo cáo cơ bản, thiếu cấu trúc hoặc nhiều lỗi format/nội dung. | Khá đầy đủ nhưng còn lỗi format, phần thiếu chi tiết hoặc giải thích không nhất quán. | Tổ chức tốt, trình bày chuyên nghiệp, đúng cấu trúc, giải thích rõ, mạch nội dung hợp lý. |

### DEMO — 4.0

| Tiêu chí | Điểm | 0 | 25% | 50–75% | Full score |
| --- | ---: | --- | --- | --- | --- |
| **Working Demo (Level 1)** | 2.0 | Demo không chạy hoặc Docker triển khai chưa hoàn tất. | Chạy nhưng frontend/backend/database chưa kết nối hoặc chưa hoàn chỉnh. | Phần lớn chạy, còn lỗi nhỏ ở tương tác service hoặc scaling chưa hoàn chỉnh. | Ứng dụng Dockerized chạy đủ frontend, backend, database và giao tiếp đúng. |
| **Advanced Features (Level 2)** | 0.5 | Không có scaling, load balancing, decoupling. | Scale/load balance cơ bản nhưng chưa có intermediary Redis/RabbitMQ. | Có một phần các tính năng nhưng chưa chạy hoặc tích hợp đầy đủ. | Scaling, load balancing, decoupling hoạt động chính xác, qua Redis/RabbitMQ hoặc tương đương. |
| **Advanced Features (Level 3)** | 0.5 | Không dùng orchestration tool. | Rubric không mô tả. | Rubric không mô tả. | Deploy đầy đủ/đúng với Swarm, Kubernetes hoặc ECS; chứng minh scalability và service management. |
| **Demonstration and Clarity** | 0.5 | Không demo hoặc demo khó hiểu, thiếu giải thích/hình. | Có demo nhưng giải thích/hình chưa đủ. | Demo rõ, có giải thích và hình phù hợp nhưng vài phần còn thiếu chi tiết. | Demo rõ, cấu trúc tốt, giải thích chi tiết và hình ảnh hiệu quả. |
| **Video and Presentation Skills** | 0.5 | Không video demo hoặc không giải thích. | Trình bày kém rõ, thiếu thông tin quan trọng. | Có giải thích nhưng vài phần chưa rõ hoặc thiếu. | Trình bày rõ, giải thích đầy đủ, cho thấy hiểu vững chủ đề và cách triển khai demo. |

## 6. Quy định phạt và điều kiện làm việc nhóm

- **Nộp trễ:** mỗi ngày trừ **1 điểm**; chỉ cần trễ **1 giây** được tính như một ngày.
- **Nhóm một người:** trừ **0.5 điểm**. Nếu có thành viên bỏ môn hoặc bất khả kháng, báo giảng viên ngay; giảng viên có thể miễn trừ điểm hoặc giới hạn điểm tùy trường hợp.
- **Có thể bị trừ điểm** khi: báo cáo/video không dùng tiếng Anh; thiếu thành viên xuất hiện trong video khi chưa được cho phép; âm thanh/hình ảnh video kém; chia việc không đều; sai format hoặc thiếu thông tin thành viên; thiếu hướng dẫn chạy; thiếu tài khoản admin cần để truy cập ứng dụng.
- Không tự khẳng định nhóm đủ số người, được giảng viên miễn trừ hay đã có video. Đánh dấu các dữ liệu chưa có để người dùng/nhóm cung cấp.

## 7. Hướng dẫn thực thi dành cho coding agent

1. **Khảo sát repo và ràng buộc hiện có:** đọc mã, tài liệu và cấu hình trước khi sửa. Nếu repo rỗng, đề xuất/chọn một ứng dụng demo Node.js nhỏ, đủ để minh họa luồng ghi/đọc database. Không lẫn yêu cầu của Final Project vào Mid-term Essay.
2. **Chốt phạm vi Level:** Level 1 là nền tảng bắt buộc; Level 2/3 chỉ nhận là hoàn thành khi triển khai và demo được từng phần cộng dồn. Nếu nhóm muốn điểm tối đa, lập kế hoạch/triển khai cả ba Level khi môi trường cho phép.
3. **Thiết kế trước khi code:** liệt kê service, sơ đồ tương tác, network, volume, ports, variables và đường đi của request. Với Level 2 mô tả worker/broker/replica/load balancer; với Level 3 chọn nền tảng và manifest tương ứng.
4. **Tạo ứng dụng và đóng gói:** frontend gọi backend, backend Node.js truy cập database; Dockerfile/Compose cài dependency tự động; tách secrets khỏi mã nguồn, cung cấp cấu hình demo tái lập được. Chuẩn bị dữ liệu mẫu nếu tính năng cần dữ liệu.
5. **Kiểm chứng Level 1 từ đầu:** dùng `docker compose up -d` trong project và xác nhận frontend, backend, database cùng chạy, network kết nối, request đọc/ghi thành công. Nếu máy không có Docker, nêu rõ chỉ kiểm tra tĩnh và bước người dùng cần chạy; tuyệt đối không ghi là đã test container.
6. **Kiểm chứng Level 2/3 nếu thực hiện:** nhiều backend phục vụ qua load balancer; broker nhận và worker xử lý thông điệp bất đồng bộ; orchestration deploy và scale được. Ghi lại lệnh và kết quả quan sát để đưa vào báo cáo/video.
7. **Bàn giao theo đề:** báo cáo Word/PDF theo mẫu khoa, `ReadMe.txt`, source/config, kế hoạch/kịch bản video. Đối chiếu rubric bằng chứng cụ thể, chỉ liệt kê kết quả thực tế. Video có âm thanh và sự xuất hiện của thành viên do nhóm thực hiện nếu agent không có khả năng quay.

## 8. Checklist nghiệm thu ngắn

- [ ] Xác định Level dự kiến và các phần Level 1/2/3 thực sự hoạt động.
- [ ] `docker compose up -d` đủ để khởi chạy hệ thống Level 1 từ môi trường sạch.
- [ ] Frontend ↔ Node.js backend ↔ database giao tiếp thực tế trên cùng Docker network.
- [ ] Nếu nhận Level 2: có replica, load balancing và message broker + worker bất đồng bộ chạy được.
- [ ] Nếu nhận Level 3: có triển khai orchestration và bằng chứng scale/quản lý service.
- [ ] Có đủ source, Dockerfile, Compose, dependency và `ReadMe.txt` với build/run/test/credentials demo khi cần.
- [ ] Báo cáo Word/PDF đủ sáu phần, đúng format khoa, có hình/bảng/sơ đồ và kết quả kiểm chứng trung thực.
- [ ] Nhóm chuẩn bị video **có âm thanh**, giải thích và demo các chức năng/Level đã làm, tất cả thành viên tham gia nếu không có ngoại lệ được duyệt.
- [ ] Kiểm tra tiếng Anh, thông tin trang bìa/thành viên, chất lượng trình bày và thời hạn nộp.

**Nguồn nội bộ:** `NodeJS Mid-term Essay (1)(1).pdf`, trang 1–7. Tài liệu này diễn giải đầy đủ nội dung và rubric để agent làm việc; PDF gốc vẫn là nguồn đối chiếu cuối cùng.
