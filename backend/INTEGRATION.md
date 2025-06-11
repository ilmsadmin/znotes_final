# Integration Guide - NoteFlow Backend

## Quick Start

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database and Redis URLs
   ```

3. **Start with Docker (Recommended)**
   ```bash
   npm run docker:up
   ```

4. **Or start manually**
   ```bash
   # Make sure PostgreSQL and Redis are running
   npm run start:dev
   ```

5. **Access GraphQL Playground**
   Open http://localhost:3000/graphql

## Testing the API

### 1. Health Check
```graphql
query {
  health
  databaseHealth
  redisHealth
  cacheHealth
}
```

### 2. Authentication Test
Set Authorization header:
```
Authorization: Bearer test-uid:john@company.com
```

### 3. Create Your First Note
```graphql
mutation {
  createNote(input: {
    title: "Welcome to NoteFlow"
    content: "This is my first note!"
    type: note
  }) {
    id
    title
    creator {
      name
      email
    }
  }
}
```

### 4. View Group Activity
```graphql
query {
  groupActivity {
    action
    details
    createdAt
    user {
      name
    }
  }
}
```

## Mobile App Integration

### Authentication Flow

1. User authenticates with Firebase on mobile
2. Mobile app receives Firebase JWT token
3. For development, format token as: `${firebaseUid}:${email}`
4. Send in Authorization header: `Bearer ${token}`
5. Backend auto-creates user and group based on email domain

### Key Endpoints for Mobile

- `me` - Get current user info
- `notes` - Get all notes for user's group
- `createNote` - Create new note
- `updateNote` - Update existing note
- `createComment` - Add comment to note
- `groupActivity` - Get recent activity feed

### Offline Support

The backend includes sync logging to support offline functionality:
- All changes are logged in `sync_log` table
- Mobile apps can query for changes since last sync
- Conflict resolution can be implemented using version numbers

## Production Deployment

### 1. Environment Variables
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
REDIS_URL="redis://host:6379"
JWT_SECRET="your-production-secret"
NODE_ENV="production"
PORT="3000"
```

### 2. Database Setup
```bash
npm run db:generate
npm run db:deploy
```

### 3. Build and Start
```bash
npm run build
npm run start:prod
```

### 4. Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Security Considerations

### 1. Firebase Integration (Production)
- Replace mock token validation with actual Firebase Admin SDK
- Verify JWT signatures properly
- Handle token expiration and refresh

### 2. Rate Limiting
- Add rate limiting middleware
- Implement per-user query limits
- Monitor for abuse patterns

### 3. Input Validation
- All inputs are validated with class-validator
- XSS protection for content fields
- SQL injection protection via Prisma

### 4. CORS Configuration
- Configure CORS for production domains
- Restrict GraphQL introspection in production

## Performance Optimization

### 1. Database
- Indexes are already configured in Prisma schema
- Consider read replicas for large deployments
- Implement query result caching

### 2. GraphQL
- Use DataLoader for N+1 query prevention
- Implement query complexity limits
- Add query depth limiting

### 3. Caching
- Redis caching is configured
- Consider CDN for static assets
- Cache frequently accessed data

## Monitoring

### 1. Health Checks
- Database connectivity
- Redis connectivity  
- Application health

### 2. Logging
- All activities are logged
- Error tracking with stack traces
- Performance monitoring

### 3. Metrics
- GraphQL query performance
- Database query performance
- User activity patterns

## Future Enhancements

### 1. Real-time Features
- GraphQL subscriptions for live updates
- WebSocket connections for instant notifications
- Real-time collaboration features

### 2. File Management
- File upload/download endpoints
- Image processing and thumbnails
- Cloud storage integration

### 3. Advanced Features
- Full-text search with Elasticsearch
- Advanced permissions and roles
- Notification system
- Email integration
- Backup and restore functionality