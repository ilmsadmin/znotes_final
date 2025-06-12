# NoteFlow Backend

A modern NestJS backend with GraphQL, Prisma ORM, PostgreSQL, and Redis support for the NoteFlow collaborative note-taking application.

## ✨ Features

- **NestJS** - Progressive Node.js framework with TypeScript
- **GraphQL** - Modern API with Apollo Server
- **Prisma ORM** - Type-safe database access with migrations
- **PostgreSQL** - Robust relational database with full-text search
- **Redis** - High-performance caching and session storage
- **Docker** - Containerized deployment with multi-stage builds
- **Real-time Sync** - Offline-first architecture with conflict resolution
- **Authentication** - Firebase Auth integration
- **File Upload** - Secure file handling with size limits
- **Rate Limiting** - API protection and abuse prevention

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- Git

### Option 1: Docker Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd NoteFlow/backend

# Quick setup with Makefile
make setup

# Or manual setup
cp .env.example .env
npm install
make db-only
make migrate
npm run start:dev
```

### Option 2: Full Docker Stack

```bash
# Start everything with Docker
make dev

# View logs
make logs

# Stop services
make dev-down
```

### Option 3: Database Only (Development)

```bash
# Start only PostgreSQL and Redis
make db-only

# Install and run backend locally
npm install
npm run db:generate
npm run db:migrate
npm run start:dev
```

## 🐳 Docker Commands

### Using Makefile (Recommended)

```bash
# Development
make dev                 # Start full development stack
make dev-down           # Stop development stack
make logs               # View logs

# Database only
make db-only            # Start PostgreSQL + Redis only
make db-down            # Stop database services

# Production
make prod               # Start production stack
make prod-build         # Build production images
make prod-down          # Stop production stack

# Database operations
make migrate            # Run migrations
make studio             # Open Prisma Studio
make backup             # Backup database
make seed               # Seed database

# Utilities
make clean              # Clean Docker resources
make status             # Show service status
make health             # Check service health
make setup              # Initial project setup
```

### Using npm scripts

```bash
# Development
npm run docker:up       # Start development stack
npm run docker:down     # Stop development stack
npm run docker:logs     # View logs

# Database only (for local development)
npm run docker:dev:up   # Start database services
npm run docker:dev:down # Stop database services

# Production
npm run docker:prod:up    # Start production stack
npm run docker:prod:down  # Stop production stack
npm run docker:prod:build # Build production images
```

## 🌐 API Endpoints

When running locally:

- **REST API**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/graphql
- **Health Check**: http://localhost:3000/health
- **Prisma Studio**: http://localhost:5555 (run `make studio`)

## 🗄️ Database Management

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
