# Backend - NoteFlow API

Backend service cho ứng dụng NoteFlow, cung cấp RESTful API và GraphQL endpoint.

## Công nghệ sử dụng

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **API**: GraphQL (Apollo Server)
- **Database**: PostgreSQL 15+
- **Authentication**: Firebase Auth
- **Cache**: Redis
- **Task Queue**: Bull Queue

## Cấu trúc thư mục

```
backend/
├── src/
│   ├── controllers/     # API controllers
│   ├── models/         # Database models
│   ├── services/       # Business logic
│   ├── middleware/     # Express middleware
│   ├── graphql/        # GraphQL schema & resolvers
│   ├── utils/          # Utility functions
│   └── config/         # Configuration files
├── tests/              # Test files
├── docs/               # API documentation
├── migrations/         # Database migrations
├── seeds/              # Database seed data
└── scripts/            # Build & deployment scripts
```

## Cài đặt môi trường phát triển

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 6+
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Cấu hình môi trường
```bash
cp .env.example .env
# Chỉnh sửa .env với thông tin cơ sở dữ liệu và API keys
```

### Chạy migrations
```bash
npm run migrate
```

### Seed dữ liệu test
```bash
npm run seed
```

### Khởi chạy development server
```bash
npm run dev
```

## API Endpoints

### GraphQL
- **Endpoint**: `/graphql`
- **Playground**: `/graphql` (development only)

### REST API
- **Health check**: `GET /health`
- **Authentication**: `POST /auth/*`
- **File upload**: `POST /upload`

## Testing

### Unit tests
```bash
npm run test:unit
```

### Integration tests
```bash
npm run test:integration
```

### Coverage report
```bash
npm run test:coverage
```

## Deployment

### Build production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Docker
```bash
docker build -t noteflow-backend .
docker run -p 4000:4000 noteflow-backend
```

## Documentation

- [API Documentation](../docs/api-documentation.md)
- [Database Schema](../docs/database-schema.md)
- [Technical Architecture](../docs/technical-architecture.md)

## Môi trường

### Development
- Database: PostgreSQL (local)
- Cache: Redis (local)
- File storage: Local filesystem

### Staging
- Database: PostgreSQL (cloud)
- Cache: Redis (cloud)
- File storage: Firebase Storage

### Production
- Database: PostgreSQL (cloud, multi-AZ)
- Cache: Redis Cluster
- File storage: Firebase Storage + CDN

## Monitoring

- Health checks: `/health`
- Metrics: Prometheus endpoint `/metrics`
- Logs: Structured JSON logging
- APM: Application Performance Monitoring

## Security

- JWT authentication
- Rate limiting
- Input validation
- CORS configuration
- Helmet.js security headers
- SQL injection protection

## Performance

- Database connection pooling
- Redis caching
- GraphQL query optimization
- Lazy loading
- Pagination

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

Proprietary - NoteFlow Team