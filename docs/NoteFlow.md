# Product Specification Document: NoteFlow

## **1. Giới thiệu**

### **1.1 Mục tiêu**
NoteFlow là một ứng dụng ghi chú và quản lý công việc đa năng, kết hợp ghi chú cá nhân, quản lý nhiệm vụ (task), theo dõi sự cố (issue tracking), và hỗ trợ làm việc nhóm theo domain email. Ứng dụng hoạt động cả online và offline, tối ưu cho các nhóm nhỏ (5-50 người) trong doanh nghiệp vừa và nhỏ, với giao diện đơn giản, hiệu quả, và khả năng đồng bộ mạnh mẽ.

### **1.2 Đối tượng người dùng**
- **Cá nhân**: Người dùng cần ghi chú nhanh, quản lý công việc cá nhân.
- **Nhóm nhỏ**: Các team trong doanh nghiệp, đặc biệt trong lĩnh vực IT, marketing, giáo dục.
- **Doanh nghiệp vừa**: Công ty cần giải pháp quản lý công việc nhẹ nhàng, không phức tạp như Jira.

### **1.3 Giá trị độc quyền (USP)**
- Tích hợp ghi chú, task, và issue tracking trong một giao diện trực quan.
- Hỗ trợ offline mạnh mẽ với đồng bộ hóa thông minh.
- Tự động nhóm theo domain email, giảm thời gian thiết lập.
- Giao diện đơn giản, thân thiện với người dùng không rành công nghệ.

## **2. Tính năng chính**

### **2.1 Ghi chú (Note)**
- Tạo ghi chú với nội dung rich text (bold, italic, list, link).
- Thêm tags, đính kèm file (PDF, hình ảnh, tối đa 10MB/file).
- Tìm kiếm full-text trong ghi chú.
- Hỗ trợ template ghi chú (ví dụ: meeting notes, brainstorming).
- Giao diện tối ưu cho mobile (iOS, Android).

### **2.2 Công việc (Task)**
- **Trường thông tin**:
  - Tiêu đề, nội dung, deadline, độ ưu tiên (Low, Medium, High).
  - Trạng thái: To Do, In Progress, Done.
  - Thời gian ước tính hoàn thành (estimated time).
- Gắn sub-task hoặc milestone.
- Giao task cho một hoặc nhiều người trong nhóm.
- Hiển thị trên Kanban board hoặc list view.

### **2.3 Sự cố (Issue)**
- Dành cho theo dõi lỗi hoặc vấn đề công việc.
- **Trường thông tin**:
  - Tiêu đề, mô tả, mức độ nghiêm trọng (Low, Medium, Critical).
  - Trạng thái: Open, In Progress, Resolved, Closed.
- Gắn sub-issue hoặc liên kết với task.

### **2.4 Giao việc (Assign)**
- Giao task/issue cho thành viên trong nhóm (theo domain email).
- Hỗ trợ nhiều người nhận một task/issue.
- Mời thành viên qua link hoặc mã QR.

### **2.5 Bình luận (Comment)**
- Bình luận theo luồng (threaded), hỗ trợ nested comments.
- @mention thành viên trong nhóm.
- Gửi file đính kèm, emoji.
- Chỉnh sửa/xóa bình luận với lịch sử chỉnh sửa.
- Pin comment quan trọng.

### **2.6 Nhóm theo domain email (Group)**
- Tự động tạo/thêm vào nhóm dựa trên domain email (VD: @company.com).
- **Vai trò**:
  - Admin: Quản lý thành viên, xóa task/issue.
  - Member: Tạo, xem, bình luận task/issue.
- Dữ liệu chỉ chia sẻ trong nhóm, không liên thông giữa các nhóm.

### **2.7 Thông báo (Notification)**
- **Kênh**:
  - Push notification (mobile).
  - Email (tùy chọn).
- **Sự kiện**:
  - Bị assign task/issue.
  - Có comment mới hoặc @mention.
  - Nhắc nhở deadline (trước 1 ngày, 1 giờ).
- Tùy chỉnh tần suất: real-time, hàng ngày, tắt.

### **2.8 Online/Offline Sync**
- Hoạt động offline với SQLite local database.
- Đồng bộ khi có mạng:
  - Lưu hành động vào queue.
  - Merge dữ liệu, giải quyết xung đột bằng versioning.
  - Manual merge với giao diện trực quan khi có xung đột.

### **2.9 Tích hợp bên thứ ba**
- Google Calendar (đồng bộ deadline).
- Slack (gửi thông báo).
- Export PDF cho ghi chú/task.

## **3. Giao diện & Trải nghiệm người dùng (UI/UX)**

### **3.1 Công nghệ**
| Nền tảng  | Công nghệ         |
|-----------|-------------------|
| iOS       | SwiftUI           |
| Android   | Jetpack Compose   |
| Web       | React + Tailwind CSS (giai đoạn v3) |

### **3.2 Thiết kế**
- Theo chuẩn **Material Design** (Android) và **Human Interface Guidelines** (iOS).
- Hỗ trợ **light/dark mode**.
- **Component chuẩn hóa**:
  - NoteCard: Hiển thị ghi chú/task/issue.
  - CommentBox: Nhập bình luận.
  - AssignUser: Chọn người giao việc.
  - TagChip: Hiển thị tag.
- **Accessibility**:
  - Tương thích screen reader.
  - Điều chỉnh cỡ chữ, tương phản cao.

### **3.3 Màn hình chính**
- **Onboarding**: Đăng ký, đăng nhập, hướng dẫn offline mode, tutorial tương tác.
- **Home**: Tabs cho Notes, Tasks, Issues (list/grid/kanban view).
- **Create/Edit**: Giao diện viết ghi chú/task/issue.
- **Detail View**: Nội dung, bình luận, assign.
- **Notification Center**: Danh sách thông báo.
- **Group Members View**: Quản lý thành viên, vai trò.

## **4. Mô hình dữ liệu (Database Schema)**

**Lưu ý**: Hệ thống sử dụng bảng `notes` chung để lưu trữ tất cả các loại entity (note, task, issue) và phân biệt bằng trường `type`. Các bảng liên quan như `assignments`, `comments`, `files`, `notifications` sử dụng trường `entity_id` để tham chiếu đến bất kỳ loại entity nào, thay vì chỉ `note_id` để rõ ràng hơn về mặt ngữ nghĩa.

### **4.1 users**
```json
{
  id: UUID,
  name: string,
  email: string,
  domain: string,
  group_id: UUID,
  role: "admin" | "member",
  avatar_url: string,
  created_at: timestamp
}
```

### **4.2 groups**
```json
{
  id: UUID,
  name: string, // domain, ví dụ: "company.com"
  created_at: timestamp
}
```

### **4.3 notes**
```json
{
  id: UUID,
  group_id: UUID,
  creator_id: UUID,
  parent_id: UUID, // cho sub-task
  title: string,
  content: text,
  type: "note" | "task" | "issue",
  status: string,
  priority: string,
  severity: string, // cho issue
  deadline: timestamp,
  estimated_time: number, // giờ
  tags: string[],
  is_pinned: boolean,
  created_at: timestamp,
  updated_at: timestamp
}
```

### **4.4 assignments**
```json
{
  id: UUID,
  entity_id: UUID, // references notes table (note/task/issue)
  assignee_id: UUID,
  created_at: timestamp
}
```

### **4.5 comments**
```json
{
  id: UUID,
  entity_id: UUID, // references notes table (note/task/issue)
  user_id: UUID,
  parent_comment_id: UUID, // cho nested comments
  content: text,
  created_at: timestamp,
  updated_at: timestamp
}
```

### **4.6 files**
```json
{
  id: UUID,
  entity_id: UUID, // references notes table (note/task/issue)
  file_url: string,
  file_type: string,
  file_size: number,
  uploaded_by: UUID,
  created_at: timestamp
}
```

### **4.7 notifications**
```json
{
  id: UUID,
  user_id: UUID,
  type: "comment" | "assign" | "deadline",
  entity_id: UUID, // references notes table (note/task/issue)
  message: string,
  read: boolean,
  created_at: timestamp
}
```

## **5. Backend & Đồng bộ**

### **5.1 Công nghệ**
- **Backend**: Node.js + Express hoặc Firebase Functions.
- **Database**: PostgreSQL (online), SQLite (offline).
- **API**: GraphQL (tăng linh hoạt truy vấn).
- **Auth**: Firebase Authentication (Google, Apple, Email, 2FA).
- **Push**: Firebase Cloud Messaging (FCM).
- **Scheduler**: Cron job cho nhắc nhở deadline.
- **Monitoring**: Sentry (lỗi), health check endpoint.

### **5.2 Đồng bộ Offline/Online**
- **Queue**: Lưu hành động offline vào local queue.
- **Sync**: Kiểm tra phiên bản, merge dữ liệu khi có mạng.
- **Conflict Resolution**:
  - Versioning: Lưu lịch sử thay đổi.
  - Manual merge: Hiển thị giao diện chọn phiên bản.
- **Caching**: Cache danh sách task/issue gần đây.

## **6. Luồng người dùng**

### **6.1 Đăng ký & Tạo nhóm**
1. Người dùng đăng ký với email (VD: alice@abc.com).
2. Tách domain (abc.com).
3. Kiểm tra group:
   - Nếu không tồn tại: Tạo group mới, người dùng là admin.
   - Nếu tồn tại: Thêm vào group với vai trò member.
4. Gửi email xác nhận.

### **6.2 Giao việc & Bình luận**
1. Tạo task/issue, chọn assignee từ danh sách nhóm.
2. Bình luận trong task/issue, @mention thành viên.
3. Gửi push notification/email khi có assign hoặc comment.

## **7. Phân tích cạnh tranh**

| Tính năng            | NoteFlow | Notion | Trello | Jira |
|----------------------|----------|--------|--------|------|
| Offline sync         | ✅       | ❌     | ❌     | ❌   |
| Group theo domain    | ✅       | ❌     | ❌     | ✅   |
| Kanban board         | ✅       | ✅     | ✅     | ✅   |
| Giao diện đơn giản   | ✅       | ✅     | ✅     | ❌   |
| Tích hợp Google Calendar | ✅ (v2) | ✅     | ✅     | ✅   |

**USP của NoteFlow**: Giao diện đơn giản, offline sync mạnh mẽ, phù hợp nhóm nhỏ không cần cấu hình phức tạp.

## **8. Lộ trình triển khai (Roadmap)**

| Giai đoạn | Nội dung | Thời gian | Tiêu chí thành công |
|-----------|----------|-----------|---------------------|
| **MVP v1** | Note, Task, Issue, Comment, Assign, Offline sync | 3 tháng | 500 người dùng active, crash rate <1% |
| **MVP v2** | Group theo domain, Push/Email notification, Kanban board, Google Calendar | 3 tháng | 2000 người dùng, 90% hài lòng UX |
| **v3** | Web version, AI gợi ý ưu tiên, Export PDF, Slack integration | 4 tháng | 10,000 người dùng, 50 doanh nghiệp đăng ký |
| **v4** | Phân quyền nâng cao, 2FA, Audit log | 3 tháng | 95% uptime, 0 lỗ hổng bảo mật |

## **9. Hiệu suất & Kiểm thử**

### **9.1 Mục tiêu hiệu suất**
- Tải danh sách 1000 task/issue: <2 giây (4G).
- Đồng bộ offline/online: <5 giây.
- API response time: <200ms.

### **9.2 Chiến lược kiểm thử**
- **Unit Test**: Logic đồng bộ, xử lý xung đột.
- **Integration Test**: API, database, auth.
- **User Testing**: 50 người dùng thử nghiệm UX.
- **Stress Test**: 10,000 task/issue, 100 người dùng đồng thời.

## **10. Bảo mật & Quyền riêng tư**
- **Mã hóa**: HTTPS, JWT, dữ liệu local mã hóa AES-256.
- **Phân quyền**: Dựa trên group_id và vai trò.
- **Quyền riêng tư**:
  - Tuân thủ GDPR, CCPA.
  - Người dùng có thể xóa tài khoản và dữ liệu.
- **Audit Log**: Ghi lại hành động admin.
- **2FA**: Xác thực qua email hoặc app.

## **11. Hỗ trợ & Tài liệu**
- **API Documentation**: Tạo tài liệu Swagger/GraphQL.
- **User Guide**: FAQ, video hướng dẫn.
- **Technical Support**: Email, chatbot, cộng đồng.

## **12. Kết luận**
NoteFlow là giải pháp quản lý công việc và ghi chú hiệu quả cho cá nhân và nhóm nhỏ, với khả năng offline vượt trội, giao diện thân thiện, và tích hợp thông minh. Với lộ trình rõ ràng và công nghệ hiện đại, NoteFlow sẵn sàng cho thương mại hóa hoặc phát triển nội bộ doanh nghiệp.