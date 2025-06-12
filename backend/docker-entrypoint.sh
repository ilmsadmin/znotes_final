#!/bin/bash

# Database initialization script
set -e

echo "🚀 Starting database initialization..."

# Wait for database to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
./wait-for-it.sh postgres:5432 --timeout=30 --strict

echo "📦 Generating Prisma client..."
npx prisma generate

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "✅ Database initialization completed!"

# Start the application
echo "🚀 Starting NestJS application..."
exec "$@"
