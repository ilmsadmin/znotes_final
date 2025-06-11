import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { NotesModule } from './notes/notes.module';
import { CommentsModule } from './comments/comments.module';
import { join } from 'path';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: process.env.NODE_ENV === 'development',
      introspection: true,
      context: ({ req }) => ({ req }),
    }),
    
    // Cache (In-memory for now, Redis can be added later)
    CacheModule.register({
      isGlobal: true,
      ttl: 300, // 5 minutes default TTL
    }),
    
    // Database
    PrismaModule,
    
    // Redis
    RedisModule,
    
    // Feature modules
    HealthModule,
    AuthModule,
    UsersModule,
    GroupsModule,
    NotesModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
