import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '../common/types/prisma.types';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    type: NotificationType,
    message: string,
    noteId?: string,
    data?: any,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        message,
        noteId,
        data: data || {},
      },
      include: {
        user: true,
        note: {
          include: {
            creator: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string, limit = 50, offset = 0) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        note: {
          include: {
            creator: true,
          },
        },
      },
    });
  }

  async findUnreadByUserId(userId: string) {
    return this.prisma.notification.findMany({
      where: { 
        userId,
        read: false,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        note: {
          include: {
            creator: true,
          },
        },
      },
    });
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
      include: {
        user: true,
        note: {
          include: {
            creator: true,
          },
        },
      },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { 
        userId,
        read: false,
      },
      data: { read: true },
    });

    return true;
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { 
        userId,
        read: false,
      },
    });
  }

  // Helper methods for creating specific notification types
  async createCommentNotification(noteId: string, commentAuthorId: string, content: string) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      include: {
        creator: true,
        assignments: {
          include: {
            assignee: true,
          },
        },
      },
    });

    if (!note) return;

    // Notify note creator (unless they're the comment author)
    if (note.creator.id !== commentAuthorId) {
      await this.create(
        note.creator.id,
        NotificationType.COMMENT,
        `New comment on "${note.title}"`,
        noteId,
        { commentContent: content },
      );
    }

    // Notify assignees (unless they're the comment author)
    for (const assignment of note.assignments) {
      if (assignment.assignee.id !== commentAuthorId && assignment.assignee.id !== note.creator.id) {
        await this.create(
          assignment.assignee.id,
          NotificationType.COMMENT,
          `New comment on assigned note "${note.title}"`,
          noteId,
          { commentContent: content },
        );
      }
    }
  }

  async createAssignmentNotification(noteId: string, assigneeId: string) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note) return;

    await this.create(
      assigneeId,
      NotificationType.ASSIGN,
      `You have been assigned to "${note.title}"`,
      noteId,
    );
  }

  async createMentionNotifications(noteId: string, mentionedUserIds: string[], content: string) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note) return;

    for (const userId of mentionedUserIds) {
      await this.create(
        userId,
        NotificationType.MENTION,
        `You were mentioned in "${note.title}"`,
        noteId,
        { content },
      );
    }
  }

  async createDeadlineNotification(noteId: string, userId: string) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note) return;

    await this.create(
      userId,
      NotificationType.DEADLINE,
      `Deadline approaching for "${note.title}"`,
      noteId,
    );
  }
}