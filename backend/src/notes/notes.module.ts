import { Module, forwardRef } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesResolver } from './notes.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [PrismaModule, AuthModule, forwardRef(() => ActivityModule)],
  providers: [NotesService, NotesResolver],
  exports: [NotesService],
})
export class NotesModule {}