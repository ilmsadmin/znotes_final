import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateNoteInput, UpdateNoteInput, NotesFilterInput } from '../common/dto/input.dto';
import { Note, NoteType, NoteStatus, Priority, Severity } from '../common/types/prisma.types';

@Injectable()
export class NotesService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
  ) {}

  async create(userId: string, groupId: string, createNoteInput: CreateNoteInput): Promise<Note> {
    // Verify user is member of the group
    const membership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('User is not a member of this group');
    }

    const noteData: any = {
      title: createNoteInput.title,
      content: createNoteInput.content,
      type: createNoteInput.type,
      creatorId: userId,
      groupId,
      status: NoteStatus.open,
      priority: createNoteInput.priority,
      severity: createNoteInput.severity,
      deadline: createNoteInput.deadline ? new Date(createNoteInput.deadline) : null,
      estimatedTime: createNoteInput.estimatedTime,
      tags: createNoteInput.tags || [],
      isPinned: createNoteInput.isPinned || false,
      parentId: createNoteInput.parentId,
      lastModifiedBy: userId,
    };

    // Generate content hash for sync
    if (noteData.content) {
      noteData.contentHash = this.generateContentHash(noteData.content);
    }

    const note = await this.prisma.note.create({
      data: noteData,
      include: {
        creator: true,
        parent: true,
        assignments: {
          include: {
            assignee: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
        files: true,
      },
    });

    // Log activity
    await this.activityService.logNoteCreated(userId, note.id, note.title);

    return note;
  }

  async findAll(groupIds: string[], filter?: NotesFilterInput): Promise<Note[]> {
    const where: any = { 
      groupId: { in: groupIds }
    };
    
    if (filter?.type) {
      where.type = filter.type;
    }
    
    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.assignedToMe && filter.userId) {
      where.assignments = {
        some: {
          assigneeId: filter.userId,
        },
      };
    }

    if (filter?.search) {
      where.OR = [
        {
          title: {
            contains: filter.search,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: filter.search,
            mode: 'insensitive',
          },
        },
        {
          tags: {
            hasSome: [filter.search],
          },
        },
      ];
    }

    return this.prisma.note.findMany({
      where,
      include: {
        creator: true,
        parent: true,
        assignments: {
          include: {
            assignee: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
        files: true,
        _count: {
          select: {
            comments: true,
            children: true,
          },
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { updatedAt: 'desc' },
      ],
      take: filter?.limit || 50,
      skip: filter?.offset || 0,
    });
  }

  async findOne(id: string, userGroupIds: string[]): Promise<Note | null> {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: {
        creator: true,
        parent: true,
        children: {
          include: {
            creator: true,
            assignments: {
              include: {
                assignee: true,
              },
            },
          },
        },
        assignments: {
          include: {
            assignee: true,
          },
        },
        comments: {
          include: {
            author: true,
            replies: {
              include: {
                author: true,
              },
            },
          },
          where: {
            parentCommentId: null, // Only top-level comments
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        files: true,
      },
    });

    if (!note || !userGroupIds.includes(note.groupId)) {
      return null;
    }

    return note;
  }

  async update(id: string, userId: string, userGroupIds: string[], updateNoteInput: UpdateNoteInput): Promise<Note> {
    const note = await this.prisma.note.findUnique({
      where: { id }
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (!userGroupIds.includes(note.groupId)) {
      throw new ForbiddenException('Access denied');
    }

    const updateData: any = {
      lastModifiedBy: userId,
      version: { increment: 1 },
    };

    if (updateNoteInput.title !== undefined) {
      updateData.title = updateNoteInput.title;
    }

    if (updateNoteInput.content !== undefined) {
      updateData.content = updateNoteInput.content;
      updateData.contentHash = updateNoteInput.content ? this.generateContentHash(updateNoteInput.content) : null;
    }

    if (updateNoteInput.status !== undefined) {
      updateData.status = updateNoteInput.status;
    }

    if (updateNoteInput.priority !== undefined) {
      updateData.priority = updateNoteInput.priority;
    }

    if (updateNoteInput.severity !== undefined) {
      updateData.severity = updateNoteInput.severity;
    }

    if (updateNoteInput.deadline !== undefined) {
      updateData.deadline = updateNoteInput.deadline ? new Date(updateNoteInput.deadline) : null;
    }

    if (updateNoteInput.estimatedTime !== undefined) {
      updateData.estimatedTime = updateNoteInput.estimatedTime;
    }

    if (updateNoteInput.tags !== undefined) {
      updateData.tags = updateNoteInput.tags;
    }

    if (updateNoteInput.isPinned !== undefined) {
      updateData.isPinned = updateNoteInput.isPinned;
    }

    const updatedNote = await this.prisma.note.update({
      where: { id },
      data: updateData,
      include: {
        creator: true,
        parent: true,
        assignments: {
          include: {
            assignee: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
        files: true,
      },
    });

    // Log activity
    await this.activityService.logNoteUpdated(userId, id, updateNoteInput);

    return updatedNote;
  }

  async remove(id: string, userId: string, userGroupIds: string[]): Promise<boolean> {
    const note = await this.prisma.note.findUnique({
      where: { id }
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (!userGroupIds.includes(note.groupId)) {
      throw new ForbiddenException('Access denied');
    }

    // Only creator can delete notes
    if (note.creatorId !== userId) {
      throw new ForbiddenException('Only the creator can delete this note');
    }

    await this.prisma.note.delete({
      where: { id }
    });

    // Log activity
    await this.activityService.logNoteDeleted(userId, id, note.title);

    return true;
  }

  async getByType(groupIds: string[], type: NoteType): Promise<Note[]> {
    return this.findAll(groupIds, { type });
  }

  async search(groupIds: string[], query: string): Promise<Note[]> {
    return this.findAll(groupIds, { search: query });
  }

  async getNotesAssignedToUser(userId: string, groupIds: string[]): Promise<Note[]> {
    return this.prisma.note.findMany({
      where: {
        groupId: { in: groupIds },
        assignments: {
          some: {
            assigneeId: userId,
          },
        },
      },
      include: {
        creator: true,
        assignments: {
          include: {
            assignee: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: [
        { deadline: 'asc' },
        { priority: 'desc' },
        { updatedAt: 'desc' },
      ],
    });
  }

  async getNotesWithDeadlines(groupIds: string[], upcoming = true): Promise<Note[]> {
    const now = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(now.getDate() + 7);

    return this.prisma.note.findMany({
      where: {
        groupId: { in: groupIds },
        deadline: upcoming ? {
          gte: now,
          lte: oneWeekFromNow,
        } : {
          lt: now,
        },
        status: {
          not: NoteStatus.completed,
        },
      },
      include: {
        creator: true,
        assignments: {
          include: {
            assignee: true,
          },
        },
      },
      orderBy: {
        deadline: 'asc',
      },
    });
  }

  async updateNotePinStatus(id: string, userId: string, userGroupIds: string[], isPinned: boolean): Promise<Note> {
    const note = await this.prisma.note.findUnique({
      where: { id }
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (!userGroupIds.includes(note.groupId)) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.note.update({
      where: { id },
      data: { 
        isPinned,
        lastModifiedBy: userId,
        version: { increment: 1 },
      },
      include: {
        creator: true,
        assignments: {
          include: {
            assignee: true,
          },
        },
      },
    });
  }

  private generateContentHash(content: string): string {
    // Simple hash function - in production you'd use crypto.createHash
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }
}