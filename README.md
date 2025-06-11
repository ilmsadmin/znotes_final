# NoteFlow

Một ứng dụng ghi chú và quản lý công việc đa năng, kết hợp ghi chú cá nhân, quản lý nhiệm vụ (task), theo dõi sự cố (issue tracking), và hỗ trợ làm việc nhóm theo domain email.

## Tính năng chính

- **Ghi chú thông minh**: Rich text editor, tags, file đính kèm
- **Quản lý Task**: Kanban board, assignment, deadline tracking
- **Issue Tracking**: Theo dõi bugs và vấn đề dự án
- **Làm việc nhóm**: Auto-grouping theo domain email
- **Offline Sync**: Hoạt động offline với đồng bộ thông minh
- **Đa nền tảng**: iOS, Android, Web

## Cấu trúc dự án

```
├── docs/          # Tài liệu dự án
├── backend/       # Backend API (Node.js)
├── app_ios/       # Ứng dụng iOS (SwiftUI)
└── app_android/   # Ứng dụng Android (Jetpack Compose)
```

## Tài liệu

Xem thư mục [docs/](./docs/) để biết thêm chi tiết về:
- [Đặc tả dự án](./docs/NoteFlow.md)
- [Kiến trúc kỹ thuật](./docs/technical-architecture.md)
- [API Documentation](./docs/api-documentation.md)
- [Database Schema](./docs/database-schema.md)
- [UI/UX Guidelines](./docs/ui-ux-guidelines.md)
- [Development Roadmap](./docs/development-roadmap.md)
- [Testing Strategy](./docs/testing-strategy.md)
- [Security & Privacy](./docs/security-privacy.md)
- [User Flows](./docs/user-flows.md)

## Lộ trình phát triển

- **MVP v1** (3 tháng): Core features - Notes, Tasks, Issues, Comments, Offline sync
- **MVP v2** (3 tháng): Group management, Notifications, Kanban board
- **v3** (4 tháng): Web version, AI features, Integrations
- **v4** (3 tháng): Advanced security, Audit logs

## Công nghệ sử dụng

- **Backend**: Node.js + Express, PostgreSQL, GraphQL
- **iOS**: SwiftUI, SQLite (offline)
- **Android**: Jetpack Compose, SQLite (offline)  
- **Auth**: Firebase Authentication
- **Sync**: Custom offline/online sync với conflict resolution

## Đối tượng người dùng

- Cá nhân cần ghi chú và quản lý công việc
- Nhóm nhỏ (5-50 người) trong doanh nghiệp
- Các team cần giải pháp quản lý nhẹ nhàng hơn Jira