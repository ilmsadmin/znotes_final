import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLog } from '../common/types/prisma.types';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async logActivity(
    userId: string,
    action: string,
    details: any,
    noteId?: string,
  ): Promise<void> {
    await this.prisma.activityLog.create({
      data: {
        userId,
        action,
        details,
        noteId,
      },
    });
  }

  async getGroupActivity(groupId: string, limit: number = 50): Promise<ActivityLog[]> {
    return this.prisma.activityLog.findMany({
      where: {
        user: {
          groupId,
        },
      },
      include: {
        user: {
          include: { group: true },
        },
        note: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async getUserActivity(userId: string, limit: number = 20): Promise<ActivityLog[]> {
    return this.prisma.activityLog.findMany({
      where: { userId },
      include: {
        user: {
          include: { group: true },
        },
        note: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async getNoteActivity(noteId: string): Promise<ActivityLog[]> {
    return this.prisma.activityLog.findMany({
      where: { noteId },
      include: {
        user: {
          include: { group: true },
        },
        note: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Helper methods to log common activities
  async logNoteCreated(userId: string, noteId: string, noteTitle: string): Promise<void> {
    await this.logActivity(userId, 'note_created', { noteTitle }, noteId);
  }

  async logNoteUpdated(userId: string, noteId: string, changes: any): Promise<void> {
    await this.logActivity(userId, 'note_updated', changes, noteId);
  }

  async logNoteDeleted(userId: string, noteId: string, noteTitle: string): Promise<void> {
    await this.logActivity(userId, 'note_deleted', { noteTitle }, noteId);
  }

  async logCommentCreated(userId: string, noteId: string, commentId: string): Promise<void> {
    await this.logActivity(userId, 'comment_created', { commentId }, noteId);
  }

  async logUserJoined(userId: string, groupId: string): Promise<void> {
    await this.logActivity(userId, 'user_joined', { groupId });
  }
}