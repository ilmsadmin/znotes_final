import { Module } from '@nestjs/common';
import { SyncResolver } from './sync.resolver';
import { SyncService } from './sync.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SyncResolver, SyncService],
  exports: [SyncService],
})
export class SyncModule {}