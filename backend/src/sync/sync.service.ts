import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SyncAction, SyncStatus } from '../common/types/prisma.types';

export interface SyncQueueItem {
  id: string;
  tableName: string;
  recordId: string;
  action: SyncAction;
  data: any;
  clientTimestamp: Date;
}

export interface DeltaSyncRequest {
  syncToken?: string;
  clientChanges: SyncQueueItem[];
}

export interface SyncResponse {
  syncToken: string;
  serverTime: Date;
  processedChanges: Array<{
    clientRecordId: string;
    serverRecordId?: string;
    status: 'success' | 'conflict' | 'error';
    serverVersion?: number;
    error?: string;
    conflictData?: any;
  }>;
  serverChanges?: {
    notes?: any[];
    comments?: any[];
    assignments?: any[];
  };
  deletions?: {
    notes?: string[];
    comments?: string[];
    assignments?: string[];
  };
}

@Injectable()
export class SyncService {
  constructor(private prisma: PrismaService) {}

  async getInitialSync(userId: string, lastSyncTime?: Date, tables?: string[]) {
    const syncToken = this.generateSyncToken();
    const serverTime = new Date();
    
    // Get user's group memberships
    const groupMemberships = await this.prisma.groupMember.findMany({
      where: { userId },
      include: { group: true },
    });

    const groupIds = groupMemberships.map(gm => gm.groupId);

    const data: any = {};
    const requestedTables = tables || ['notes', 'comments', 'assignments'];

    // Get notes from user's groups
    if (requestedTables.includes('notes')) {
      data.notes = await this.prisma.note.findMany({
        where: {
          groupId: { in: groupIds },
          ...(lastSyncTime && { updatedAt: { gte: lastSyncTime } }),
        },
        include: {
          creator: true,
          assignments: {
            include: { assignee: true },
          },
          _count: {
            select: { comments: true },
          },
        },
      });
    }

    // Get comments from notes in user's groups
    if (requestedTables.includes('comments')) {
      data.comments = await this.prisma.comment.findMany({
        where: {
          note: {
            groupId: { in: groupIds },
          },
          ...(lastSyncTime && { updatedAt: { gte: lastSyncTime } }),
        },
        include: {
          author: true,
          note: true,
        },
      });
    }

    // Get assignments for user's group notes
    if (requestedTables.includes('assignments')) {
      data.assignments = await this.prisma.assignment.findMany({
        where: {
          note: {
            groupId: { in: groupIds },
          },
          ...(lastSyncTime && { createdAt: { gte: lastSyncTime } }),
        },
        include: {
          assignee: true,
          note: true,
        },
      });
    }

    // Get deletions (items deleted since last sync)
    const deletions: any = {};
    if (lastSyncTime) {
      // Note: In a real implementation, you'd need a separate deletions table
      // to track what was deleted since we can't query deleted records
    }

    return {
      syncToken,
      serverTime,
      data,
      deletions,
    };
  }

  async processDeltaSync(userId: string, request: DeltaSyncRequest): Promise<SyncResponse> {
    const syncToken = this.generateSyncToken();
    const serverTime = new Date();
    const processedChanges: SyncResponse['processedChanges'] = [];

    // Process client changes
    for (const change of request.clientChanges) {
      try {
        const result = await this.processClientChange(userId, change);
        processedChanges.push(result);
      } catch (error) {
        processedChanges.push({
          clientRecordId: change.recordId,
          status: 'error',
          error: error.message,
        });
      }
    }

    // Get server changes since last sync (if sync token provided)
    let serverChanges: any = {};
    let deletions: any = {};

    if (request.syncToken) {
      // In a real implementation, you'd use the sync token to determine
      // what changes happened on the server since the last sync
      const lastSyncTime = this.decodeSyncToken(request.syncToken);
      const initialSync = await this.getInitialSync(userId, lastSyncTime);
      serverChanges = initialSync.data;
      deletions = initialSync.deletions;
    }

    return {
      syncToken,
      serverTime,
      processedChanges,
      serverChanges,
      deletions,
    };
  }

  private async processClientChange(userId: string, change: SyncQueueItem) {
    const { tableName, recordId, action, data } = change;

    switch (tableName) {
      case 'notes':
        return this.processNoteChange(userId, recordId, action, data);
      case 'comments':
        return this.processCommentChange(userId, recordId, action, data);
      case 'assignments':
        return this.processAssignmentChange(userId, recordId, action, data);
      default:
        throw new Error(`Unsupported table: ${tableName}`);
    }
  }

  private async processNoteChange(userId: string, clientRecordId: string, action: SyncAction, data: any) {
    switch (action) {
      case SyncAction.create:
        const newNote = await this.prisma.note.create({
          data: {
            title: data.title,
            content: data.content,
            type: data.type,
            status: data.status,
            priority: data.priority,
            severity: data.severity,
            deadline: data.deadline ? new Date(data.deadline) : null,
            estimatedTime: data.estimatedTime,
            tags: data.tags || [],
            isPinned: data.isPinned || false,
            groupId: data.groupId,
            creatorId: userId,
            parentId: data.parentId,
          },
        });

        // Log the sync
        await this.logSync(userId, 'notes', newNote.id, action, null, newNote);

        return {
          clientRecordId,
          serverRecordId: newNote.id,
          status: 'success' as const,
          serverVersion: newNote.version,
        };

      case SyncAction.update:
        // Check for conflicts
        const existingNote = await this.prisma.note.findUnique({
          where: { id: clientRecordId },
        });

        if (!existingNote) {
          throw new Error('Note not found');
        }

        // Simple conflict detection based on version
        if (data.clientVersion && existingNote.version > data.clientVersion) {
          return {
            clientRecordId,
            status: 'conflict' as const,
            conflictData: {
              serverVersion: existingNote,
              clientVersion: data,
            },
          };
        }

        const updatedNote = await this.prisma.note.update({
          where: { id: clientRecordId },
          data: {
            title: data.title,
            content: data.content,
            status: data.status,
            priority: data.priority,
            severity: data.severity,
            deadline: data.deadline ? new Date(data.deadline) : null,
            estimatedTime: data.estimatedTime,
            tags: data.tags,
            isPinned: data.isPinned,
            version: { increment: 1 },
            lastModifiedBy: userId,
          },
        });

        // Log the sync
        await this.logSync(userId, 'notes', clientRecordId, action, existingNote, updatedNote);

        return {
          clientRecordId,
          serverRecordId: clientRecordId,
          status: 'success' as const,
          serverVersion: updatedNote.version,
        };

      case SyncAction.delete:
        await this.prisma.note.delete({
          where: { id: clientRecordId },
        });

        // Log the sync
        await this.logSync(userId, 'notes', clientRecordId, action, data, null);

        return {
          clientRecordId,
          status: 'success' as const,
        };

      default:
        throw new Error(`Unsupported action: ${action}`);
    }
  }

  private async processCommentChange(userId: string, clientRecordId: string, action: SyncAction, data: any) {
    switch (action) {
      case SyncAction.create:
        const newComment = await this.prisma.comment.create({
          data: {
            content: data.content,
            noteId: data.noteId,
            authorId: userId,
            parentCommentId: data.parentCommentId,
            mentions: data.mentions || [],
          },
        });

        await this.logSync(userId, 'comments', newComment.id, action, null, newComment);

        return {
          clientRecordId,
          serverRecordId: newComment.id,
          status: 'success' as const,
          serverVersion: newComment.version,
        };

      case SyncAction.update:
        const existingComment = await this.prisma.comment.findUnique({
          where: { id: clientRecordId },
        });

        if (!existingComment) {
          throw new Error('Comment not found');
        }

        if (data.clientVersion && existingComment.version > data.clientVersion) {
          return {
            clientRecordId,
            status: 'conflict' as const,
            conflictData: {
              serverVersion: existingComment,
              clientVersion: data,
            },
          };
        }

        const updatedComment = await this.prisma.comment.update({
          where: { id: clientRecordId },
          data: {
            content: data.content,
            mentions: data.mentions,
            version: { increment: 1 },
            lastModifiedBy: userId,
          },
        });

        await this.logSync(userId, 'comments', clientRecordId, action, existingComment, updatedComment);

        return {
          clientRecordId,
          serverRecordId: clientRecordId,
          status: 'success' as const,
          serverVersion: updatedComment.version,
        };

      case SyncAction.delete:
        await this.prisma.comment.delete({
          where: { id: clientRecordId },
        });

        await this.logSync(userId, 'comments', clientRecordId, action, data, null);

        return {
          clientRecordId,
          status: 'success' as const,
        };

      default:
        throw new Error(`Unsupported action: ${action}`);
    }
  }

  private async processAssignmentChange(userId: string, clientRecordId: string, action: SyncAction, data: any) {
    switch (action) {
      case SyncAction.create:
        const newAssignment = await this.prisma.assignment.create({
          data: {
            noteId: data.noteId,
            assigneeId: data.assigneeId,
          },
        });

        return {
          clientRecordId,
          serverRecordId: newAssignment.id,
          status: 'success' as const,
        };

      case SyncAction.delete:
        await this.prisma.assignment.delete({
          where: { id: clientRecordId },
        });

        return {
          clientRecordId,
          status: 'success' as const,
        };

      default:
        throw new Error(`Unsupported action: ${action} for assignments`);
    }
  }

  private async logSync(userId: string, tableName: string, recordId: string, action: SyncAction, oldData: any, newData: any) {
    await this.prisma.syncLog.create({
      data: {
        userId,
        tableName,
        recordId,
        action: action.toString(),
        oldData: oldData || {},
        newData: newData || {},
      },
    });
  }

  private generateSyncToken(): string {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private decodeSyncToken(token: string): Date {
    // Extract timestamp from sync token
    const parts = token.split('_');
    if (parts.length >= 2) {
      const timestamp = parseInt(parts[1]);
      return new Date(timestamp);
    }
    return new Date(0); // Fallback to epoch
  }

  async getSyncQueue(userId: string) {
    return this.prisma.syncQueue.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async addToSyncQueue(
    userId: string,
    tableName: string,
    recordId: string,
    action: SyncAction,
    data: any,
    clientTimestamp: Date,
  ) {
    return this.prisma.syncQueue.create({
      data: {
        userId,
        tableName,
        recordId,
        action,
        data,
        clientTimestamp,
        status: SyncStatus.PENDING,
      },
    });
  }

  async processSyncQueue(userId: string) {
    const queueItems = await this.prisma.syncQueue.findMany({
      where: {
        userId,
        status: SyncStatus.PENDING,
      },
      orderBy: { createdAt: 'asc' },
    });

    for (const item of queueItems) {
      try {
        await this.prisma.syncQueue.update({
          where: { id: item.id },
          data: { status: SyncStatus.PROCESSING },
        });

        await this.processClientChange(userId, {
          id: item.id,
          tableName: item.tableName,
          recordId: item.recordId,
          action: item.action,
          data: item.data,
          clientTimestamp: item.clientTimestamp,
        });

        await this.prisma.syncQueue.update({
          where: { id: item.id },
          data: { status: SyncStatus.COMPLETED },
        });
      } catch (error) {
        await this.prisma.syncQueue.update({
          where: { id: item.id },
          data: {
            status: SyncStatus.FAILED,
            errorMessage: error.message,
            retryCount: { increment: 1 },
          },
        });
      }
    }
  }
}