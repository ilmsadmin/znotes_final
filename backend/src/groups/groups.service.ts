import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Group, Role, InvitationStatus, PlanType } from '../common/types/prisma.types';
import { CreateGroupInput, UpdateGroupInput, InviteToGroupInput } from '../common/dto/input.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Group | null> {
    return this.prisma.group.findUnique({
      where: { id },
      include: {
        creator: true,
        members: {
          include: {
            user: true,
          },
        },
        invitations: {
          include: {
            inviter: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    const memberships = await this.prisma.groupMember.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            creator: true,
            members: {
              include: {
                user: true,
              },
            },
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });

    return memberships.map(m => m.group);
  }

  async getUserPrimaryGroup(userId: string): Promise<Group | null> {
    const membership = await this.prisma.groupMember.findFirst({
      where: { userId },
      include: {
        group: {
          include: {
            creator: true,
            members: {
              include: {
                user: true,
              },
            },
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });

    return membership?.group || null;
  }

  async createGroup(userId: string, createGroupInput: CreateGroupInput): Promise<Group> {
    // Check user's group creation limits
    const userLimits = await this.prisma.userGroupLimits.findUnique({
      where: { userId },
    });

    if (!userLimits) {
      throw new ForbiddenException('User limits not found');
    }

    if (userLimits.createdGroupsCount >= userLimits.maxGroupsAllowed) {
      throw new ForbiddenException('Group creation limit reached');
    }

    // Create the group
    const group = await this.prisma.group.create({
      data: {
        name: createGroupInput.name,
        description: createGroupInput.description,
        avatarUrl: createGroupInput.avatarUrl,
        creatorId: userId,
        maxMembers: createGroupInput.maxMembers || 5,
      },
      include: {
        creator: true,
        members: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    // Add creator as admin member
    await this.prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId,
        role: Role.admin,
      },
    });

    // Update user's group creation count
    await this.prisma.userGroupLimits.update({
      where: { userId },
      data: {
        createdGroupsCount: { increment: 1 },
      },
    });

    return this.findById(group.id);
  }

  async updateGroup(groupId: string, userId: string, updateGroupInput: UpdateGroupInput): Promise<Group> {
    // Verify user is admin of the group
    const membership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!membership || membership.role !== Role.admin) {
      throw new ForbiddenException('Only group admins can update group settings');
    }

    const updatedGroup = await this.prisma.group.update({
      where: { id: groupId },
      data: updateGroupInput,
      include: {
        creator: true,
        members: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    return updatedGroup;
  }

  async inviteToGroup(userId: string, inviteInput: InviteToGroupInput): Promise<any> {
    const { groupId, email } = inviteInput;

    // Verify user is admin of the group
    const membership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!membership || membership.role !== Role.admin) {
      throw new ForbiddenException('Only group admins can invite users');
    }

    // Check if user already exists and is already a member
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      include: {
        groupMemberships: {
          where: { groupId },
        },
      },
    });

    if (existingUser && existingUser.groupMemberships.length > 0) {
      throw new ForbiddenException('User is already a member of this group');
    }

    // Check for existing pending invitation
    const existingInvitation = await this.prisma.groupInvitation.findFirst({
      where: {
        groupId,
        email,
        status: InvitationStatus.PENDING,
      },
    });

    if (existingInvitation) {
      throw new ForbiddenException('Invitation already sent to this email');
    }

    // Create invitation
    const token = this.generateInvitationToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation = await this.prisma.groupInvitation.create({
      data: {
        groupId,
        invitedBy: userId,
        email,
        token,
        expiresAt,
      },
      include: {
        group: true,
        inviter: true,
      },
    });

    return invitation;
  }

  async acceptInvitation(token: string, userId: string): Promise<any> {
    const invitation = await this.prisma.groupInvitation.findUnique({
      where: { token },
      include: {
        group: true,
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new ForbiddenException('Invitation is no longer valid');
    }

    if (invitation.expiresAt < new Date()) {
      // Mark as expired
      await this.prisma.groupInvitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.EXPIRED },
      });
      throw new ForbiddenException('Invitation has expired');
    }

    // Verify user email matches invitation
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.email !== invitation.email) {
      throw new ForbiddenException('Email does not match invitation');
    }

    // Check if user is already a member
    const existingMembership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: invitation.groupId,
          userId,
        },
      },
    });

    if (existingMembership) {
      throw new ForbiddenException('User is already a member of this group');
    }

    // Add user to group
    await this.prisma.groupMember.create({
      data: {
        groupId: invitation.groupId,
        userId,
        role: Role.member,
      },
    });

    // Update invitation status
    await this.prisma.groupInvitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.ACCEPTED },
    });

    return this.findById(invitation.groupId);
  }

  async declineInvitation(token: string): Promise<boolean> {
    const invitation = await this.prisma.groupInvitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new ForbiddenException('Invitation is no longer valid');
    }

    await this.prisma.groupInvitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.DECLINED },
    });

    return true;
  }

  async removeUserFromGroup(groupId: string, adminUserId: string, userIdToRemove: string): Promise<boolean> {
    // Verify admin permissions
    const adminMembership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: adminUserId,
        },
      },
    });

    if (!adminMembership || adminMembership.role !== Role.admin) {
      throw new ForbiddenException('Only group admins can remove users');
    }

    // Don't allow removing the group creator
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (group?.creatorId === userIdToRemove) {
      throw new ForbiddenException('Cannot remove group creator');
    }

    // Remove user from group
    await this.prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId,
          userId: userIdToRemove,
        },
      },
    });

    return true;
  }

  async updateUserRole(groupId: string, adminUserId: string, userIdToUpdate: string, newRole: Role): Promise<boolean> {
    // Verify admin permissions
    const adminMembership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: adminUserId,
        },
      },
    });

    if (!adminMembership || adminMembership.role !== Role.admin) {
      throw new ForbiddenException('Only group admins can update user roles');
    }

    // Update user role
    await this.prisma.groupMember.update({
      where: {
        groupId_userId: {
          groupId,
          userId: userIdToUpdate,
        },
      },
      data: { role: newRole },
    });

    return true;
  }

  async getGroupStats(groupId: string): Promise<any> {
    const [membersCount, notesCount, tasksCount, meetingsCount, announcementsCount] = await Promise.all([
      this.prisma.groupMember.count({ where: { groupId } }),
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
      this.prisma.note.count({ 
        where: { 
          groupId, 
          type: 'announcement' 
        } 
      }),
    ]);

    return {
      membersCount,
      notesCount,
      tasksCount,
      meetingsCount,
      announcementsCount,
      totalItems: notesCount + tasksCount + meetingsCount + announcementsCount,
    };
  }

  async getGroupMembers(groupId: string) {
    return this.prisma.groupMember.findMany({
      where: { groupId },
      include: {
        user: true,
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });
  }

  private generateInvitationToken(): string {
    return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  }
}