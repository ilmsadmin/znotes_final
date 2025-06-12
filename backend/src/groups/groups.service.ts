import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Group } from '../common/types/prisma.types';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Group | null> {
    return this.prisma.group.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });
  }

  async findByDomain(domain: string): Promise<Group | null> {
    return this.prisma.group.findUnique({
      where: { domain },
      include: {
        users: true,
      },
    });
  }

  async getUserGroup(userId: string): Promise<Group | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        group: {
          include: {
            users: true,
          },
        },
      },
    });

    return user?.group || null;
  }

  async updateGroupSettings(groupId: string, userId: string, settings: any): Promise<Group> {
    // Verify user belongs to the group and has admin role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.groupId !== groupId) {
      throw new ForbiddenException('Access denied');
    }

    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admins can update group settings');
    }

    return this.prisma.group.update({
      where: { id: groupId },
      data: { settings },
      include: {
        users: true,
      },
    });
  }

  async getGroupStats(groupId: string): Promise<any> {
    const [usersCount, notesCount, tasksCount, issuesCount] = await Promise.all([
      this.prisma.user.count({ where: { groupId } }),
      this.prisma.note.count({ 
        where: { 
          groupId, 
          type: 'note' 
        } 
      }),
      this.prisma.note.count({ 
        where: { 
          groupId, 
          type: 'task' 
        } 
      }),
      this.prisma.note.count({ 
        where: { 
          groupId, 
          type: 'meeting' 
        } 
      }),
    ]);

    return {
      usersCount,
      notesCount,
      tasksCount,
      issuesCount,
      totalItems: notesCount + tasksCount + issuesCount,
    };
  }
}