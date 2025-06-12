import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentInput, UpdateCommentInput } from '../common/dto/input.dto';
import { Comment } from '../common/types/prisma.types';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, groupIds: string[], createCommentInput: CreateCommentInput): Promise<Comment> {
    // Verify that the note exists and belongs to one of the user's groups
    const note = await this.prisma.note.findUnique({
      where: { id: createCommentInput.noteId }
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (!groupIds.includes(note.groupId)) {
      throw new ForbiddenException('Access denied');
    }

    const commentData: any = {
      content: createCommentInput.content,
      noteId: createCommentInput.noteId,
      authorId: userId,
      parentCommentId: createCommentInput.parentCommentId,
      mentions: createCommentInput.mentions || [],
      lastModifiedBy: userId,
    };

    // Generate content hash for sync
    commentData.contentHash = this.generateContentHash(createCommentInput.content);

    return this.prisma.comment.create({
      data: commentData,
      include: {
        author: true,
        note: {
          include: {
            creator: true,
          }
        },
        parentComment: true,
        replies: {
          include: {
            author: true,
          },
        },
      },
    });
  }

  async findByNoteId(noteId: string, groupIds: string[]): Promise<Comment[]> {
    // Verify note belongs to one of user's groups
    const note = await this.prisma.note.findUnique({
      where: { id: noteId }
    });

    if (!note || !groupIds.includes(note.groupId)) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.comment.findMany({
      where: { 
        noteId,
        parentCommentId: null, // Only top-level comments
      },
      include: {
        author: true,
        note: {
          include: {
            creator: true,
          }
        },
        replies: {
          include: {
            author: true,
            replies: {
              include: {
                author: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async update(id: string, userId: string, groupIds: string[], updateCommentInput: UpdateCommentInput): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        note: true
      }
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (!groupIds.includes(comment.note.groupId)) {
      throw new ForbiddenException('Access denied');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('Only the author can edit this comment');
    }

    const updateData: any = {
      content: updateCommentInput.content,
      mentions: updateCommentInput.mentions || comment.mentions,
      lastModifiedBy: userId,
      version: { increment: 1 },
    };

    // Generate content hash for sync
    updateData.contentHash = this.generateContentHash(updateCommentInput.content);

    return this.prisma.comment.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
        note: {
          include: {
            creator: true,
          }
        },
        parentComment: true,
        replies: {
          include: {
            author: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string, groupIds: string[]): Promise<boolean> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        note: true
      }
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (!groupIds.includes(comment.note.groupId)) {
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