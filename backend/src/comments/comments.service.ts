import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentInput } from '../common/dto/input.dto';
import { Comment } from '../common/types/prisma.types';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, groupId: string, createCommentInput: CreateCommentInput): Promise<Comment> {
    // Verify that the note exists and belongs to the user's group
    const note = await this.prisma.note.findUnique({
      where: { id: createCommentInput.noteId }
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.groupId !== groupId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.comment.create({
      data: {
        content: createCommentInput.content,
        noteId: createCommentInput.noteId,
        authorId: userId,
      },
      include: {
        author: {
          include: { group: true }
        },
        note: {
          include: {
            creator: {
              include: { group: true }
            }
          }
        }
      },
    });
  }

  async findByNoteId(noteId: string, groupId: string): Promise<Comment[]> {
    // Verify note belongs to group
    const note = await this.prisma.note.findUnique({
      where: { id: noteId }
    });

    if (!note || note.groupId !== groupId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.comment.findMany({
      where: { noteId },
      include: {
        author: {
          include: { group: true }
        },
        note: {
          include: {
            creator: {
              include: { group: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async update(id: string, userId: string, groupId: string, content: string): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        note: true
      }
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.note.groupId !== groupId) {
      throw new ForbiddenException('Access denied');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('Only the author can edit this comment');
    }

    return this.prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        author: {
          include: { group: true }
        },
        note: {
          include: {
            creator: {
              include: { group: true }
            }
          }
        }
      },
    });
  }

  async remove(id: string, userId: string, groupId: string): Promise<boolean> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        note: true
      }
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.note.groupId !== groupId) {
      throw new ForbiddenException('Access denied');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('Only the author can delete this comment');
    }

    await this.prisma.comment.delete({
      where: { id }
    });

    return true;
  }
}