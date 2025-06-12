import { Module } from '@nestjs/common';
import { AssignmentsResolver } from './assignments.resolver';
import { AssignmentsService } from './assignments.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [AssignmentsResolver, AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}