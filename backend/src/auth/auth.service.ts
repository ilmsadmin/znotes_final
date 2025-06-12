import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role } from '../common/types/prisma.types';

export interface AuthUser {
  id: string;
  email: string;
  firebaseUid: string;
  groupIds: string[];
  primaryGroupId?: string;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateFirebaseToken(token: string): Promise<AuthUser | null> {
    try {
      // In a real implementation, this would verify the Firebase JWT token
      // For now, we'll implement a basic validation mechanism
      if (!token || !token.startsWith('Bearer ')) {
        return null;
      }

      // Extract the actual token
      const actualToken = token.replace('Bearer ', '');
      
      // For development, we'll create a simple token format: firebaseUid:email
      const [firebaseUid, email] = actualToken.split(':');
      
      if (!firebaseUid || !email) {
        return null;
      }

      // Find or create user
      let user = await this.prisma.user.findUnique({
        where: { firebaseUid },
        include: { 
          groupMemberships: {
            include: { group: true }
          }
        }
      });

      if (!user) {
        // Auto-create user and group based on email domain
        user = await this.createUserWithGroup(firebaseUid, email);
      }

      const groupIds = user.groupMemberships.map(gm => gm.groupId);
      const primaryGroupId = groupIds[0]; // Use first group as primary

      return {
        id: user.id,
        email: user.email,
        firebaseUid: user.firebaseUid,
        groupIds,
        primaryGroupId,
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }

  private async createUserWithGroup(firebaseUid: string, email: string) {
    const domain = email.split('@')[1];
    const name = email.split('@')[0];

    // Check if group exists for this domain
    let group = await this.prisma.group.findFirst({
      where: { name: { contains: domain } }
    });

    if (!group) {
      // Create new group for this domain
      group = await this.prisma.group.create({
        data: {
          name: `${domain} Group`,
          description: `Auto-created group for ${domain}`,
          creatorId: '', // We'll update this after creating the user
          settings: {}
        }
      });
    }

    // Create user
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        firebaseUid,
      }
    });

    // If this is a new group, update it to set the user as creator
    if (group.creatorId === '') {
      await this.prisma.group.update({
        where: { id: group.id },
        data: { creatorId: user.id }
      });
    }

    // Create group membership
    await this.prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId: user.id,
        role: group.creatorId === user.id ? Role.admin : Role.member,
      }
    });

    // Create user group limits
    await this.prisma.userGroupLimits.create({
      data: {
        userId: user.id,
        createdGroupsCount: group.creatorId === user.id ? 1 : 0,
        maxGroupsAllowed: 2,
      }
    });

    // Fetch and return user with memberships
    return this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        groupMemberships: {
          include: { group: true }
        }
      }
    });
  }

  async getUser(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { 
        groupMemberships: {
          include: { group: true }
        },
        groupLimits: true,
      }
    });
  }

  async getUserPrimaryGroup(userId: string) {
    const membership = await this.prisma.groupMember.findFirst({
      where: { userId },
      include: { group: true },
      orderBy: { joinedAt: 'asc' }, // First joined group is primary
    });

    return membership?.group || null;
  }
}