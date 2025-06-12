import { Module } from '@nestjs/common';
import { SyncResolver } from './sync.resolver';
import { SyncService } from './sync.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [SyncResolver, SyncService],
  exports: [SyncService],
})
export class SyncModule {}