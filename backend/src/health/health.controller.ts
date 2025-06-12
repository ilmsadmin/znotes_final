import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  @Get()
  async healthCheck() {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;
      
      // Check Redis connection
      const redisHealthy = await this.redisService.health();
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        services: {
          database: 'healthy',
          redis: redisHealthy ? 'healthy' : 'unhealthy',
        },
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
        services: {
          database: 'unhealthy',
          redis: 'unknown',
        },
      };
    }
  }

  @Get('database')
  async databaseHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy', service: 'database' };
    } catch (error) {
      return { status: 'unhealthy', service: 'database', error: error.message };
    }
  }

  @Get('redis')
  async redisHealth() {
    try {
      const isHealthy = await this.redisService.health();
      return { 
        status: isHealthy ? 'healthy' : 'unhealthy', 
        service: 'redis' 
      };
    } catch (error) {
      return { status: 'unhealthy', service: 'redis', error: error.message };
    }
  }
}
