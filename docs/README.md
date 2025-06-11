# NoteFlow Documentation

Chào mừng đến với tài liệu kỹ thuật của dự án NoteFlow - ứng dụng ghi chú và quản lý công việc đa năng.

## 📋 Tổng quan dự án

- **[Đặc tả dự án](./NoteFlow.md)** - Mô tả chi tiết về tính năng, mục tiêu và vision của NoteFlow
- **[User Flows](./user-flows.md)** - Luồng người dùng và các tương tác chính trong ứng dụng

## 🏗️ Architecture & Technical Design

- **[Kiến trúc kỹ thuật](./technical-architecture.md)** - Thiết kế hệ thống tổng thể, scalability và performance
- **[Database Schema](./database-schema.md)** - Thiết kế cơ sở dữ liệu PostgreSQL và SQLite
- **[API Documentation](./api-documentation.md)** - GraphQL API endpoints, schemas và examples

## 🎨 Design & User Experience

- **[UI/UX Guidelines](./ui-ux-guidelines.md)** - Design system, components và interaction patterns

## 🚀 Development & Operations

- **[Development Roadmap](./development-roadmap.md)** - Lộ trình phát triển từ MVP đến enterprise
- **[Testing Strategy](./testing-strategy.md)** - Chiến lược testing toàn diện cho tất cả platform
- **[Security & Privacy](./security-privacy.md)** - Bảo mật, privacy compliance và best practices

## 📁 Cấu trúc thư mục

```
znotes_final/
├── docs/                   # 📚 Tài liệu dự án
│   ├── README.md          # Tài liệu này
│   ├── NoteFlow.md        # Đặc tả dự án gốc
│   ├── technical-architecture.md
│   ├── api-documentation.md
│   ├── database-schema.md
│   ├── ui-ux-guidelines.md
│   ├── development-roadmap.md
│   ├── testing-strategy.md
│   ├── security-privacy.md
│   └── user-flows.md
├── backend/                # 🚀 Backend API (Node.js + GraphQL)
├── app_ios/               # 📱 iOS App (SwiftUI)
├── app_android/           # 🤖 Android App (Jetpack Compose)
└── README.md              # Tổng quan dự án
```

## 🎯 Đối tượng đọc

### Developers
- **Backend Developers**: Tham khảo [Technical Architecture](./technical-architecture.md), [API Documentation](./api-documentation.md), [Database Schema](./database-schema.md)
- **Mobile Developers**: Xem [UI/UX Guidelines](./ui-ux-guidelines.md), [User Flows](./user-flows.md), README trong các thư mục app
- **QA Engineers**: Tham khảo [Testing Strategy](./testing-strategy.md), [User Flows](./user-flows.md)

### Product & Design
- **Product Managers**: Đọc [NoteFlow.md](./NoteFlow.md), [Development Roadmap](./development-roadmap.md)
- **UX/UI Designers**: Tham khảo [UI/UX Guidelines](./ui-ux-guidelines.md), [User Flows](./user-flows.md)

### DevOps & Security
- **DevOps Engineers**: Xem [Technical Architecture](./technical-architecture.md), [Security & Privacy](./security-privacy.md)
- **Security Team**: Tham khảo [Security & Privacy](./security-privacy.md), [Testing Strategy](./testing-strategy.md)

## 🔄 Lifecycle tài liệu

### Cập nhật thường xuyên
- **API Documentation**: Cập nhật khi có thay đổi API
- **User Flows**: Cập nhật khi có tính năng mới
- **Testing Strategy**: Cập nhật khi thêm test cases

### Cập nhật theo milestone
- **Development Roadmap**: Review mỗi quarter
- **Technical Architecture**: Cập nhật khi có architectural changes
- **UI/UX Guidelines**: Cập nhật khi có design system changes

### Cập nhật hiếm
- **NoteFlow.md**: Chỉ cập nhật khi có thay đổi fundamental
- **Database Schema**: Cập nhật khi có migration lớn

## 🤝 Đóng góp tài liệu

### Quy trình cập nhật
1. **Tạo branch** cho documentation changes
2. **Cập nhật** tài liệu liên quan
3. **Review** với team members
4. **Merge** vào main branch

### Standards
- **Markdown format** cho tất cả documentation
- **Tiếng Việt** cho nội dung chính, **English** cho code examples
- **Mermaid diagrams** cho flowcharts và architecture diagrams
- **Code examples** phải working và up-to-date

### Templates
```markdown
# Document Title

## Tổng quan
Brief description of the document purpose

## Sections
### Main Section
Content with examples

### Code Examples
\`\`\`language
// Working code example
\`\`\`

## See Also
- Links to related documents
```

## 📊 Document Metrics

- **Total Documents**: 13 files
- **Lines of Documentation**: ~150,000+ lines
- **Code Examples**: 100+ examples
- **Diagrams**: 20+ flowcharts and diagrams
- **Last Updated**: 2025-06-11

## 🔗 Quick Links

### Getting Started
1. [Đọc đặc tả dự án](./NoteFlow.md)
2. [Xem kiến trúc hệ thống](./technical-architecture.md)
3. [Tham khảo API docs](./api-documentation.md)
4. [Setup development environment](../README.md)

### Development
- [Backend setup](../backend/README.md)
- [iOS setup](../app_ios/README.md)
- [Android setup](../app_android/README.md)

### Design & Testing
- [Design guidelines](./ui-ux-guidelines.md)
- [Testing strategy](./testing-strategy.md)
- [User flows](./user-flows.md)

---

**📝 Note**: Tài liệu này được cập nhật thường xuyên. Vui lòng check lại thường xuyên để có thông tin mới nhất.

**📧 Contact**: Nếu có thắc mắc về tài liệu, vui lòng tạo issue trong repository hoặc liên hệ team lead.