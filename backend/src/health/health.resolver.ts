import { Resolver, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Resolver()
export class HealthResolver {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Query(() => String)
  async health(): Promise<string> {
    return 'NoteFlow Backend is running!';
  }

  @Query(() => String)
  async databaseHealth(): Promise<string> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'Database connection is healthy';
    } catch (error) {
      return `Database connection failed: ${error.message}`;
    }
  }

  @Query(() => String)
  async redisHealth(): Promise<string> {
    try {
      const isHealthy = await this.redisService.health();
      return isHealthy ? 'Redis connection is healthy' : 'Redis connection failed';
    } catch (error) {
      return `Redis connection failed: ${error.message}`;
    }
  }

  @Query(() => String)
  async cacheHealth(): Promise<string> {
    try {
      await this.cacheManager.set('health-check', 'ok', 1000);
      const result = await this.cacheManager.get('health-check');
      return result === 'ok' ? 'Cache is healthy' : 'Cache test failed';
    } catch (error) {
      return `Cache connection failed: ${error.message}`;
    }
  }
}