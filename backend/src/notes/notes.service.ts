import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateNoteInput, UpdateNoteInput } from '../common/dto/input.dto';
import { Note, NoteType, NoteStatus } from '../common/types/prisma.types';

@Injectable()
export class NotesService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
  ) {}

  async create(userId: string, groupId: string, createNoteInput: CreateNoteInput): Promise<Note> {
    const note = await this.prisma.note.create({
      data: {
        ...createNoteInput,
        creatorId: userId,
        groupId,
        status: NoteStatus.open,
      },
      include: {
        creator: {
          include: { group: true }
        },
        comments: {
          include: {
            author: {
              include: { group: true }
            }
          }
        }
      },
    });

    // Log activity
    await this.activityService.logNoteCreated(userId, note.id, note.title);

    return note;
  }

  async findAll(groupId: string, type?: NoteType, status?: NoteStatus): Promise<Note[]> {
    const where: any = { groupId };
    
    if (type) {
      where.type = type;
    }
    
    if (status) {
      where.status = status;
    }

    return this.prisma.note.findMany({
      where,
      include: {
        creator: {
          include: { group: true }
        },
        comments: {
          include: {
            author: {
              include: { group: true }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(id: string, groupId: string): Promise<Note | null> {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: {
        creator: {
          include: { group: true }
        },
        comments: {
          include: {
            author: {
              include: { group: true }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
    });

    if (!note || note.groupId !== groupId) {
      return null;
    }

    return note;
  }

  async update(id: string, userId: string, groupId: string, updateNoteInput: UpdateNoteInput): Promise<Note> {
    const note = await this.prisma.note.findUnique({
      where: { id }
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.groupId !== groupId) {
      throw new ForbiddenException('Access denied');
    }

    const updatedNote = await this.prisma.note.update({
      where: { id },
      data: {
        ...updateNoteInput,
        version: note.version + 1,
      },
      include: {
        creator: {
          include: { group: true }
        },
        comments: {
          include: {
            author: {
              include: { group: true }
            }
          }
        }
      },
    });

    // Log activity
    await this.activityService.logNoteUpdated(userId, id, updateNoteInput);

    return updatedNote;
  }

  async remove(id: string, userId: string, groupId: string): Promise<boolean> {
    const note = await this.prisma.note.findUnique({
      where: { id }
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.groupId !== groupId) {
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

  async getByType(groupId: string, type: NoteType): Promise<Note[]> {
    return this.findAll(groupId, type);
  }

  async search(groupId: string, query: string): Promise<Note[]> {
    return this.prisma.note.findMany({
      where: {
        groupId,
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        creator: {
          include: { group: true }
        },
        comments: {
          include: {
            author: {
              include: { group: true }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }
}