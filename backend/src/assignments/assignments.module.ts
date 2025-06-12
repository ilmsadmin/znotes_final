import { Module } from '@nestjs/common';
import { AssignmentsResolver } from './assignments.resolver';
import { AssignmentsService } from './assignments.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AssignmentsResolver, AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}