import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentInput } from '../common/dto/input.dto';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAssignmentInput: CreateAssignmentInput) {
    const { noteId, assigneeId } = createAssignmentInput;

    // Check if assignment already exists
    const existingAssignment = await this.prisma.assignment.findUnique({
      where: {
        noteId_assigneeId: {
          noteId,
          assigneeId,
        },
      },
    });

    if (existingAssignment) {
      throw new Error('Assignment already exists');
    }

    // Validate that both note and assignee exist and are in the same group
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      include: { group: true },
    });

    if (!note) {
      throw new Error('Note not found');
    }

    const assigneeMembership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: note.groupId,
          userId: assigneeId,
        },
      },
    });

    if (!assigneeMembership) {
      throw new Error('Assignee is not a member of the note\'s group');
    }

    return this.prisma.assignment.create({
      data: createAssignmentInput,
      include: {
        assignee: true,
        note: {
          include: {
            creator: true,
          },
        },
      },
    });
  }

  async findByNoteId(noteId: string) {
    return this.prisma.assignment.findMany({
      where: { noteId },
      include: {
        assignee: true,
      },
    });
  }

  async findByAssigneeId(assigneeId: string) {
    return this.prisma.assignment.findMany({
      where: { assigneeId },
      include: {
        note: {
          include: {
            creator: true,
            group: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    // Only the note creator or assignee can remove an assignment
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        note: true,
      },
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    if (assignment.note.creatorId !== userId && assignment.assigneeId !== userId) {
      throw new Error('Not authorized to remove this assignment');
    }

    await this.prisma.assignment.delete({
      where: { id },
    });

    return true;
  }

  async removeByNoteAndAssignee(noteId: string, assigneeId: string, userId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: {
        noteId_assigneeId: {
          noteId,
          assigneeId,
        },
      },
      include: {
        note: true,
      },
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    if (assignment.note.creatorId !== userId && assignment.assigneeId !== userId) {
      throw new Error('Not authorized to remove this assignment');
    }

    await this.prisma.assignment.delete({
      where: {
        noteId_assigneeId: {
          noteId,
          assigneeId,
        },
      },
    });

    return true;
  }
}