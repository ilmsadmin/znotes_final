#!/bin/bash

# NoteFlow Backend Setup Script
# This script sets up the development environment

set -e

echo "🚀 NoteFlow Backend Setup"
echo "========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_step() {
    echo -e "${BLUE}➤ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
print_step "Checking prerequisites..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "All prerequisites are installed"

# Create .env file if it doesn't exist
print_step "Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    print_success "Created .env file from .env.example"
    print_warning "Please edit .env file with your configuration before proceeding"
else
    print_warning ".env file already exists"
fi

# Install dependencies
print_step "Installing npm dependencies..."
npm install
print_success "Dependencies installed"

# Ask user which setup they prefer
echo ""
echo "Choose your development setup:"
echo "1) Full Docker stack (Backend + Database in containers)"
echo "2) Database only (Backend runs locally, Database in Docker) - Recommended"
echo "3) Local setup (Backend and Database run locally)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        print_step "Setting up full Docker stack..."
        
        # Start full stack
        docker-compose up -d
        
        # Wait for services to be ready
        print_step "Waiting for services to start..."
        sleep 10
        
        # Run migrations
        print_step "Running database migrations..."
        docker exec noteflow-backend npm run db:migrate || {
            print_warning "Migration failed, trying alternative method..."
            npm run db:migrate
        }
        
        print_success "Full Docker stack is ready!"
        echo ""
        echo "Services running:"
        echo "- Backend: http://localhost:3000"
        echo "- GraphQL: http://localhost:3000/graphql"
        echo "- PostgreSQL: localhost:5432"
        echo "- Redis: localhost:6379"
        echo ""
        echo "Useful commands:"
        echo "- View logs: make logs"
        echo "- Stop services: make dev-down"
        echo "- Prisma Studio: make studio"
        ;;
        
    2)
        print_step "Setting up database-only Docker stack..."
        
        # Start database services only
        docker-compose -f docker-compose.dev.yml up -d
        
        # Wait for database to be ready
        print_step "Waiting for database to start..."
        sleep 10
        
        # Generate Prisma client
        print_step "Generating Prisma client..."
        npm run db:generate
        
        # Run migrations
        print_step "Running database migrations..."
        npm run db:migrate
        
        print_success "Database services are ready!"
        echo ""
        echo "Services running:"
        echo "- PostgreSQL: localhost:5432"
        echo "- Redis: localhost:6379"
        echo ""
        echo "To start the backend locally:"
        echo "- Development: npm run start:dev"
        echo "- Debug mode: npm run start:debug"
        echo ""
        echo "Useful commands:"
        echo "- Stop databases: make db-down"
        echo "- View logs: make db-logs"
        echo "- Prisma Studio: make studio"
        ;;
        
    3)
        print_warning "Local setup requires PostgreSQL and Redis to be installed locally"
        print_step "Generating Prisma client..."
        npm run db:generate
        
        print_step "Please ensure your local PostgreSQL and Redis are running"
        print_step "Update your .env file with local database connection strings"
        
        echo ""
        echo "Example local .env configuration:"
        echo 'DATABASE_URL="postgresql://username:password@localhost:5432/noteflow"'
        echo 'REDIS_URL="redis://localhost:6379"'
        echo ""
        echo "After configuring .env, run:"
        echo "- npm run db:migrate"
        echo "- npm run start:dev"
        ;;
        
    *)
        print_error "Invalid choice. Please run the script again and choose 1, 2, or 3."
        exit 1
        ;;
esac

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📚 Documentation:"
echo "- Docker setup: ./DOCKER.md"
echo "- API documentation: ./API.md"
echo "- Integration guide: ./INTEGRATION.md"
echo ""
echo "🛠️ Development commands:"
echo "- make help          # Show all available commands"
echo "- make status        # Check service status"
echo "- make health        # Health check"
echo "- make logs          # View logs"
echo ""
echo "Happy coding! 🚀"
