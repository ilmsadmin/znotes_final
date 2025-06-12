# NoteFlow Backend - Docker Setup

This document provides comprehensive instructions for running the NoteFlow backend using Docker.

## 📋 Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- Git

## 🚀 Quick Start

### Option 1: Full Stack with Docker (Recommended for Testing)

```bash
# Clone the repository
git clone <repository-url>
cd NoteFlow/backend

# Copy environment variables
cp .env.example .env

# Build and start all services
npm run docker:up

# View logs
npm run docker:logs
```

### Option 2: Database Only (Recommended for Development)

```bash
# Start only database services (PostgreSQL + Redis)
npm run docker:dev:up

# Copy environment variables for local development
cp .env.example .env

# Install dependencies locally
npm install

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Start the backend locally
npm run start:dev
```

### Option 3: Production Setup

```bash
# Copy and configure production environment
cp .env.example .env.prod

# Edit .env.prod with production values
# Make sure to set secure JWT_SECRET and database credentials

# Build and start production services
npm run docker:prod:up
```

## 🐳 Docker Services

### Development (`docker-compose.yml`)

- **Backend**: NestJS application with hot reload
- **PostgreSQL**: Database server
- **Redis**: Cache and session store

### Development DB Only (`docker-compose.dev.yml`)

- **PostgreSQL**: Database server
- **Redis**: Cache server

### Production (`docker-compose.prod.yml`)

- **Backend**: Optimized NestJS application
- **PostgreSQL**: Production database
- **Redis**: Production cache

## 📁 Docker Files

- `Dockerfile`: Multi-stage production build
- `Dockerfile.dev`: Development optimized build
- `docker-compose.yml`: Full development stack
- `docker-compose.dev.yml`: Database services only
- `docker-compose.prod.yml`: Production stack
- `.dockerignore`: Files to exclude from Docker context

## 🔧 Available Commands

### Development Commands

```bash
# Start full development stack
npm run docker:up

# Stop development stack
npm run docker:down

# View logs
npm run docker:logs

# Rebuild containers
npm run docker:build
```

### Database Only Commands

```bash
# Start database services only
npm run docker:dev:up

# Stop database services
npm run docker:dev:down

# View database logs
npm run docker:dev:logs
```

### Production Commands

```bash
# Start production stack
npm run docker:prod:up

# Stop production stack
npm run docker:prod:down

# View production logs
npm run docker:prod:logs

# Build production images
npm run docker:prod:build
```

### Utility Commands

```bash
# Clean up Docker resources
npm run docker:clean

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

## 🌍 Environment Variables

Create a `.env` file from `.env.example` and configure:

```bash
# Database Configuration
DATABASE_URL="postgresql://znotes:znotes123@localhost:5432/znotes?schema=public"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# Application Configuration
NODE_ENV="development"
PORT="3000"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# CORS Configuration
CORS_ORIGIN="http://localhost:3001,http://localhost:3000"
```

## 🔗 Service URLs

When running with Docker Compose:

- **Backend API**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/graphql
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Prisma Studio**: http://localhost:5555 (run `npm run db:studio`)

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check container logs
docker logs noteflow-backend

# Check if ports are available
lsof -i :3000
lsof -i :5432
lsof -i :6379
```

### Database Connection Issues

```bash
# Check if PostgreSQL is ready
docker exec noteflow-postgres pg_isready -U znotes

# Connect to database directly
docker exec -it noteflow-postgres psql -U znotes -d znotes
```

### Reset Everything

```bash
# Stop all containers and remove volumes
npm run docker:down
docker volume prune -f

# Start fresh
npm run docker:up
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Clean up unused images and containers
npm run docker:clean
```

## 📊 Database Management

### Run Migrations

```bash
# Inside container
docker exec noteflow-backend npm run db:migrate

# Or locally (if database is running in Docker)
npm run db:migrate
```

### Access Database

```bash
# Connect to PostgreSQL
docker exec -it noteflow-postgres psql -U znotes -d znotes

# Or use Prisma Studio
npm run db:studio
```

### Backup Database

```bash
# Create backup
docker exec noteflow-postgres pg_dump -U znotes znotes > backup.sql

# Restore backup
docker exec -i noteflow-postgres psql -U znotes -d znotes < backup.sql
```

## 🔒 Production Considerations

### Security

- Change default passwords in production
- Use strong JWT secrets
- Configure proper CORS origins
- Use environment-specific `.env` files
- Never commit `.env` files to version control

### Performance

- Use production Docker images
- Configure proper resource limits
- Set up database connection pooling
- Use Redis for session management
- Enable compression and caching

### Monitoring

- Set up health checks
- Monitor container resources
- Log aggregation
- Error tracking

## 📝 Development Tips

### Hot Reload

The development setup includes hot reload, so changes to your code will automatically restart the server.

### Debugging

```bash
# Run with debug mode
docker-compose -f docker-compose.yml run --service-ports backend npm run start:debug
```

### Testing

```bash
# Run tests inside container
docker exec noteflow-backend npm test

# Run with coverage
docker exec noteflow-backend npm run test:cov
```

## 🤝 Contributing

1. Make sure all tests pass
2. Update documentation if needed
3. Follow the existing code style
4. Test with Docker before submitting PR

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
