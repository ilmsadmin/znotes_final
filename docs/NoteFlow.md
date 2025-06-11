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
- Thành viên có thể tạo nhóm, làm việc và quản lý công việc theo nhóm 1 cách tiện lợi.
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

### **2.6 Nhóm làm việc (Group)**
- **Giai đoạn 1 - Miễn phí**:
  - Người dùng được tạo tối đa 2 nhóm miễn phí.
  - Người tạo trở thành admin của nhóm.
  - Admin có thể mời/thêm thành viên vào nhóm (tối đa 5 người/nhóm).
  - Chỉ thành viên trong nhóm mới thấy danh sách và thông tin thành viên khác.
- **Thông tin nhóm**:
  - Tên nhóm, admin nhóm, số lượng thành viên.
  - Avatar và mô tả nhóm (tùy chọn).
- **Vai trò**:
  - Admin: Quản lý thành viên, mời/xóa thành viên, xóa task/issue, chỉnh sửa thông tin nhóm.
  - Member: Tạo, xem, bình luận task/issue, mention và assignment các thành viên khác.
- **Quyền riêng tư**: Dữ liệu chỉ chia sẻ trong nhóm, không liên thông giữa các nhóm.
- **Tương tác**: Thành viên có thể comment, assign, mention nhau trong notes/tasks/issues.

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

### **4.1 users**
```json
{
  id: UUID,
  name: string,
  email: string,
  avatar_url: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

### **4.2 groups**
```json
{
  id: UUID,
  name: string, // tên nhóm do người dùng đặt
  description: string, // mô tả nhóm (tùy chọn)
  avatar_url: string, // avatar nhóm (tùy chọn)
  creator_id: UUID, // người tạo nhóm
  created_at: timestamp,
  updated_at: timestamp
}
```

### **4.3 group_members**
```json
{
  id: UUID,
  group_id: UUID,
  user_id: UUID,
  role: "admin" | "member",
  joined_at: timestamp
}
```

### **4.4 group_invitations**
```json
{
  id: UUID,
  group_id: UUID,
  invited_by: UUID, // admin gửi lời mời
  email: string, // email người được mời
  token: string, // token xác thực lời mời
  status: "pending" | "accepted" | "declined" | "expired",
  expires_at: timestamp,
  created_at: timestamp
}
```

### **4.5 user_group_limits**
```json
{
  user_id: UUID,
  created_groups_count: number, // số nhóm đã tạo
  max_groups_allowed: number, // giới hạn tạo nhóm (2 cho free)
  plan_type: "free" | "premium", // loại gói
  updated_at: timestamp
}
```

### **4.6 notes**
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

### **4.7 assignments**
```json
{
  id: UUID,
  note_id: UUID,
  assignee_id: UUID,
  created_at: timestamp
}
```

### **4.8 comments**
```json
{
  id: UUID,
  note_id: UUID,
  user_id: UUID,
  parent_comment_id: UUID, // cho nested comments
  content: text,
  created_at: timestamp,
  updated_at: timestamp
}
```

### **4.9 files**
```json
{
  id: UUID,
  note_id: UUID,
  file_url: string,
  file_type: string,
  file_size: number,
  uploaded_by: UUID,
  created_at: timestamp
}
```

### **4.10 notifications**
```json
{
  id: UUID,
  user_id: UUID,
  type: "comment" | "assign" | "deadline",
  note_id: UUID,
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

### **6.1 Đăng ký & Thiết lập ban đầu**
1. Người dùng đăng ký với email (VD: alice@example.com).
2. Tạo hồ sơ cá nhân (tên, avatar).
3. Hoàn tất đăng ký và xác nhận email.
4. Chuyển đến màn hình chào mừng với các tùy chọn:
   - Tạo nhóm mới (trở thành admin)
   - Tham gia nhóm qua lời mời (nếu có)
   - Bỏ qua và sử dụng cá nhân

### **6.2 Tạo & Quản lý nhóm**
1. Admin tạo nhóm mới (giới hạn 2 nhóm miễn phí).
2. Thiết lập thông tin nhóm: tên, mô tả, avatar.
3. Mời thành viên qua email hoặc chia sẻ link mời.
4. Quản lý thành viên: thêm/xóa, thay đổi vai trò.
5. Giới hạn: tối đa 5 thành viên/nhóm (gói miễn phí).

### **6.3 Tham gia nhóm qua lời mời**
1. Nhận email mời hoặc click link mời.
2. Đăng nhập hoặc đăng ký nếu chưa có tài khoản.
3. Xem thông tin nhóm: tên, admin, số thành viên.
4. Chấp nhận hoặc từ chối lời mời.
5. Nếu chấp nhận: tự động trở thành member của nhóm.

### **6.4 Giao việc & Bình luận trong nhóm**
1. Tạo task/issue, chọn assignee từ danh sách thành viên nhóm.
2. Bình luận trong task/issue, @mention thành viên cùng nhóm.
3. Gửi push notification/email khi có assign hoặc comment.
4. Chỉ thành viên cùng nhóm mới thấy được thông tin và có thể tương tác.

## **7. Phân tích cạnh tranh**

| Tính năng            | NoteFlow | Notion | Trello | Jira |
|----------------------|----------|--------|--------|------|
| Offline sync         | ✅       | ❌     | ❌     | ❌   |
| Group tạo thủ công   | ✅       | ❌     | ❌     | ✅   |
| Giới hạn miễn phí    | ✅ (2 nhóm, 5 người) | ❌ | ❌ | ❌ |
| Kanban board         | ✅       | ✅     | ✅     | ✅   |
| Giao diện đơn giản   | ✅       | ✅     | ✅     | ❌   |
| Tích hợp Google Calendar | ✅ (v2) | ✅     | ✅     | ✅   |

**USP của NoteFlow**: Giao diện đơn giản, offline sync mạnh mẽ, phù hợp nhóm nhỏ với mô hình miễn phí hấp dẫn và không cần cấu hình phức tạp.

## **8. Lộ trình triển khai (Roadmap)**

| Giai đoạn | Nội dung | Thời gian | Tiêu chí thành công |
|-----------|----------|-----------|---------------------|
| **MVP v1** | Note, Task, Issue, Comment, Assign, Offline sync, Group tạo thủ công (giai đoạn 1 miễn phí) | 3 tháng | 500 người dùng active, crash rate <1% |
| **MVP v2** | Group management nâng cao, Push/Email notification, Kanban board, Google Calendar | 3 tháng | 2000 người dùng, 90% hài lòng UX |
| **v3** | Web version, Gói premium (nhiều nhóm/thành viên), AI gợi ý ưu tiên, Export PDF | 4 tháng | 10,000 người dùng, 50 doanh nghiệp đăng ký |
| **v4** | Phân quyền nâng cao, 2FA, Audit log, Slack integration | 3 tháng | 95% uptime, 0 lỗ hổng bảo mật |

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