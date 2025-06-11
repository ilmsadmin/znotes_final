# Kiến trúc kỹ thuật - NoteFlow

## Tổng quan kiến trúc

NoteFlow được thiết kế theo mô hình client-server với khả năng offline-first, đảm bảo trải nghiệm người dùng mượt mà ngay cả khi không có kết nối mạng.

## Kiến trúc tổng thể

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   iOS App       │    │  Android App    │    │   Web App       │
│   (SwiftUI)     │    │ (Jetpack Compose)│   │ (React + TS)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                       │
         └────────────────────────┼───────────────────────┘
                                  │
                    ┌─────────────────┐
                    │   API Gateway   │
                    │   (GraphQL)     │
                    └─────────────────┘
                             │
                    ┌─────────────────┐
                    │  Backend API    │
                    │  (Node.js)      │
                    └─────────────────┘
                             │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    └─────────────────┘
```

## Công nghệ stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **API Layer**: GraphQL (Apollo Server)
- **Database**: PostgreSQL 15+
- **Cache**: Redis
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Task Queue**: Bull Queue (Redis-based)

### Mobile Apps

#### iOS
- **Framework**: SwiftUI (iOS 15+)
- **Local Database**: SQLite + FMDB
- **Networking**: URLSession + GraphQL
- **State Management**: Combine + MVVM
- **Offline Storage**: Core Data

#### Android  
- **Framework**: Jetpack Compose
- **Local Database**: Room (SQLite)
- **Networking**: Retrofit + GraphQL
- **State Management**: ViewModel + StateFlow
- **Offline Storage**: Room Database

### Web (v3)
- **Framework**: React 18 + TypeScript
- **State Management**: Redux Toolkit
- **UI Components**: Tailwind CSS + Headless UI
- **Build Tool**: Vite
- **Local Storage**: IndexedDB

## Offline/Online Synchronization

### Chiến lược sync
1. **Offline-first**: Mọi thao tác được lưu local trước
2. **Queue-based**: Actions được queue khi offline
3. **Conflict Resolution**: Version-based merging
4. **Smart Sync**: Chỉ sync delta changes

### Quy trình sync

```
Local Action → Queue → Network Available? 
                          ↓ Yes
                      Send to Server → Merge Response → Update Local
                          ↓ No  
                      Store in Queue → Retry Later
```

### Conflict Resolution
- **Last-Write-Wins**: Cho metadata (title, status)
- **Operational Transform**: Cho nội dung text
- **Manual Resolution**: Cho conflicts phức tạp

## Database Design

### Local Database (SQLite)
```sql
-- Sync metadata
CREATE TABLE sync_queue (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL, -- 'create', 'update', 'delete'
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    data TEXT NOT NULL, -- JSON payload
    created_at INTEGER NOT NULL,
    retry_count INTEGER DEFAULT 0
);

-- Local version tracking
CREATE TABLE local_versions (
    record_id TEXT PRIMARY KEY,
    table_name TEXT NOT NULL,
    version INTEGER NOT NULL,
    last_synced INTEGER
);
```

### Server Database (PostgreSQL)
- Xem [database-schema.md](./database-schema.md) cho chi tiết

## Security Architecture

### Authentication Flow
1. **Client** → Firebase Auth (Email/Google/Apple)
2. **Firebase** → Custom token với group claims
3. **Backend** → Verify token + Extract user/group context
4. **API** → Role-based access control

### Data Security
- **Encryption in Transit**: TLS 1.3
- **Encryption at Rest**: AES-256 cho local storage
- **API Security**: JWT tokens, rate limiting
- **Data Isolation**: Group-based data segregation

## Performance Considerations

### Caching Strategy
- **Client**: SQLite cache cho frequently accessed data
- **Server**: Redis cache cho user sessions, group metadata
- **CDN**: Static assets caching

### Optimization
- **Lazy Loading**: Incremental data loading
- **Pagination**: Server-side pagination với cursors
- **Image Optimization**: Multiple resolutions, WebP format
- **Database Indexing**: Optimized queries với proper indexes

## Monitoring & Observability

### Metrics
- **Application**: Response time, error rate, throughput
- **Business**: DAU, retention, feature usage
- **Infrastructure**: CPU, memory, disk usage

### Logging
- **Structured Logging**: JSON format với correlation IDs
- **Log Levels**: ERROR, WARN, INFO, DEBUG
- **Centralized**: ELK stack hoặc cloud logging

### Error Tracking
- **Client Crashes**: Firebase Crashlytics
- **Server Errors**: Sentry
- **User Feedback**: In-app feedback system

## Deployment Architecture

### Backend Deployment
```
Internet → Load Balancer → API Servers (N instances)
                       → Redis Cluster
                       → PostgreSQL Primary/Replica
```

### CI/CD Pipeline
1. **Code Push** → GitHub Actions
2. **Tests** → Unit + Integration tests
3. **Build** → Docker images
4. **Deploy** → Staging → Production
5. **Monitor** → Health checks + Rollback if needed

## Scalability Planning

### Horizontal Scaling
- **API Servers**: Stateless, auto-scaling
- **Database**: Read replicas, connection pooling
- **Redis**: Cluster mode cho caching
- **File Storage**: CDN distribution

### Performance Targets
- **API Response**: < 200ms (95th percentile)
- **Sync Time**: < 5s cho typical dataset
- **App Launch**: < 2s cold start
- **Offline Performance**: Tương đương online

## Future Architecture Considerations

### Microservices Migration (v4+)
- **User Service**: Authentication, profiles
- **Note Service**: CRUD operations
- **Notification Service**: Push notifications
- **Sync Service**: Offline/online synchronization

### Real-time Features
- **WebSocket**: Live collaboration
- **Operational Transform**: Real-time text editing
- **Event Sourcing**: Audit trail, undo/redo functionality