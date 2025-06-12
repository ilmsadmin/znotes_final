.DEFAULT_GOAL := help

# NoteFlow Backend - Docker Management
.PHONY: help build up down logs clean dev prod db-only

# Default target
help: ## Show this help message
	@echo "NoteFlow Backend - Docker Commands"
	@echo "=================================="
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development Commands
dev: ## Start development environment with hot reload
	@echo "🚀 Starting development environment..."
	docker-compose up -d
	@echo "✅ Development environment started!"
	@echo "📍 Backend: http://localhost:3000"
	@echo "📍 GraphQL: http://localhost:3000/graphql"

dev-logs: ## Show development logs
	docker-compose logs -f

dev-down: ## Stop development environment
	@echo "🛑 Stopping development environment..."
	docker-compose down
	@echo "✅ Development environment stopped!"

# Database Only Commands  
db-only: ## Start only database services (PostgreSQL + Redis)
	@echo "🗄️ Starting database services..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ Database services started!"
	@echo "📍 PostgreSQL: localhost:5432"
	@echo "📍 Redis: localhost:6379"

db-logs: ## Show database logs
	docker-compose -f docker-compose.dev.yml logs -f

db-down: ## Stop database services
	@echo "🛑 Stopping database services..."
	docker-compose -f docker-compose.dev.yml down
	@echo "✅ Database services stopped!"

# Production Commands
prod: ## Start production environment
	@echo "🏭 Starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d
	@echo "✅ Production environment started!"

prod-build: ## Build production images
	@echo "🔨 Building production images..."
	docker-compose -f docker-compose.prod.yml build
	@echo "✅ Production images built!"

prod-logs: ## Show production logs
	docker-compose -f docker-compose.prod.yml logs -f

prod-down: ## Stop production environment
	@echo "🛑 Stopping production environment..."
	docker-compose -f docker-compose.prod.yml down
	@echo "✅ Production environment stopped!"

# Build Commands
build: ## Build development images
	@echo "🔨 Building development images..."
	docker-compose build
	@echo "✅ Development images built!"

build-no-cache: ## Build images without cache
	@echo "🔨 Building images without cache..."
	docker-compose build --no-cache
	@echo "✅ Images built without cache!"

# Database Commands
migrate: ## Run database migrations
	@echo "🔄 Running database migrations..."
	docker exec noteflow-backend npm run db:migrate || npm run db:migrate
	@echo "✅ Database migrations completed!"

migrate-prod: ## Run production database migrations
	@echo "🔄 Running production database migrations..."
	docker exec noteflow-backend-prod npm run db:deploy
	@echo "✅ Production database migrations completed!"

studio: ## Open Prisma Studio
	@echo "🎨 Opening Prisma Studio..."
	npm run db:studio

seed: ## Seed database with sample data
	@echo "🌱 Seeding database..."
	docker exec noteflow-backend npm run db:seed || npm run db:seed
	@echo "✅ Database seeded!"

# Utility Commands
logs: ## Show all logs
	docker-compose logs -f

ps: ## Show running containers
	@echo "📋 Running containers:"
	docker-compose ps

exec: ## Execute bash in backend container
	docker exec -it noteflow-backend sh

exec-db: ## Connect to PostgreSQL database
	docker exec -it noteflow-postgres psql -U znotes -d znotes

backup: ## Backup database
	@echo "💾 Creating database backup..."
	docker exec noteflow-postgres pg_dump -U znotes znotes > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Database backup created!"

restore: ## Restore database from backup (Usage: make restore FILE=backup.sql)
	@echo "🔄 Restoring database from $(FILE)..."
	docker exec -i noteflow-postgres psql -U znotes -d znotes < $(FILE)
	@echo "✅ Database restored!"

clean: ## Clean up Docker resources
	@echo "🧹 Cleaning up Docker resources..."
	docker system prune -f
	docker volume prune -f
	@echo "✅ Docker resources cleaned!"

clean-all: ## Remove all containers, images, and volumes
	@echo "🧹 Removing all Docker resources..."
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.dev.yml down -v --rmi all
	docker-compose -f docker-compose.prod.yml down -v --rmi all
	docker system prune -af
	@echo "✅ All Docker resources removed!"

# Status Commands
status: ## Show status of all services
	@echo "📊 Service Status:"
	@echo "=================="
	@docker-compose ps 2>/dev/null || echo "Development stack: Not running"
	@docker-compose -f docker-compose.dev.yml ps 2>/dev/null || echo "Database services: Not running"
	@docker-compose -f docker-compose.prod.yml ps 2>/dev/null || echo "Production stack: Not running"

health: ## Check health of services
	@echo "🏥 Health Check:"
	@echo "================"
	@curl -f http://localhost:3000/health 2>/dev/null && echo "✅ Backend: Healthy" || echo "❌ Backend: Unhealthy"
	@docker exec noteflow-postgres pg_isready -U znotes 2>/dev/null && echo "✅ PostgreSQL: Ready" || echo "❌ PostgreSQL: Not ready"
	@docker exec noteflow-redis redis-cli ping 2>/dev/null && echo "✅ Redis: Connected" || echo "❌ Redis: Not connected"

# Setup Commands
setup: ## Initial setup for development
	@echo "🔧 Setting up development environment..."
	@cp .env.example .env 2>/dev/null || echo ".env already exists"
	@echo "📦 Installing dependencies..."
	@npm install
	@echo "🗄️ Starting database services..."
	@make db-only
	@echo "⏳ Waiting for database to be ready..."
	@sleep 10
	@echo "🔄 Running migrations..."
	@make migrate
	@echo "✅ Development environment setup complete!"
	@echo ""
	@echo "Next steps:"
	@echo "1. Edit .env file with your configuration"
	@echo "2. Run 'make dev' to start the full development stack"
	@echo "3. Or run 'npm run start:dev' to start backend locally"

init: ## Initialize project (alias for setup)
	@make setup
