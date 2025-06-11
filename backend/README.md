# ZNotes Backend

A modern NestJS backend with GraphQL, Prisma ORM, PostgreSQL, and Redis support.

## Features

- **NestJS** - Progressive Node.js framework
- **GraphQL** - Modern API with Apollo Server
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Robust relational database
- **Redis** - High-performance caching
- **Docker** - Containerized deployment
- **TypeScript** - Type-safe development

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (optional, can use Docker)
- Redis (optional, can use Docker)

### Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start services with Docker**
   ```bash
   npm run docker:up
   ```

4. **Generate Prisma client**
   ```bash
   npm run db:generate
   ```

5. **Push database schema**
   ```bash
   npm run db:push
   ```

6. **Start development server**
   ```bash
   npm run start:dev
   ```

### API Endpoints

- **REST API**: http://localhost:3000
  - Health check: `GET /health`
  - Main: `GET /`

- **GraphQL Playground**: http://localhost:3000/graphql
  - Interactive GraphQL interface for development

### Database Operations

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Create and apply migration
npm run db:migrate -- --name init

# Deploy migrations to production
npm run db:deploy

# Open Prisma Studio (Database GUI)
npm run db:studio
```

### Docker Commands

```bash
# Start all services
npm run docker:up

# Stop all services
npm run docker:down

# View logs
npm run docker:logs
```

### Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
src/
├── health/           # Health check endpoints
├── prisma/           # Database service and module
├── app.controller.ts # Main REST controller
├── app.module.ts     # Root application module
├── app.service.ts    # Main application service
└── main.ts          # Application entry point

prisma/
└── schema.prisma    # Database schema definition

docker-compose.yml   # Docker services configuration
Dockerfile          # Container build configuration
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# App
NODE_ENV="development"
PORT="3000"
```

## GraphQL Schema

The GraphQL schema is automatically generated from your resolvers and can be found at `src/schema.gql` after starting the application.

Example queries:

```graphql
# Health check
query {
  health
  databaseHealth
  cacheHealth
}
```

## Database Schema

The database schema is defined in `prisma/schema.prisma` and includes:

- **Users** - User management with roles
- **Groups** - Multi-tenant groups/organizations
- **Notes** - Core note-taking functionality
- **Comments** - Note discussions
- **Files** - File attachments
- **Activity Logs** - Audit trail
- **Sync Logs** - Offline synchronization support

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy database migrations**
   ```bash
   npm run db:deploy
   ```

3. **Start production server**
   ```bash
   npm run start:prod
   ```

Or use Docker:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Use meaningful commit messages

## Support

For questions and support, please check the main project documentation or create an issue in the repository.
