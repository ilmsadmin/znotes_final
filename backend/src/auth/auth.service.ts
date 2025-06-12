import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../common/types/prisma.types';

export interface AuthUser {
  id: string;
  email: string;
  firebaseUid: string;
  groupId: string;
  role: string;
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
        include: { group: true }
      });

      if (!user) {
        // Auto-create user and group based on email domain
        user = await this.createUserWithGroup(firebaseUid, email);
      }

      return {
        id: user.id,
        email: user.email,
        firebaseUid: user.firebaseUid,
        groupId: user.groupId,
        role: user.role,
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
    let group = await this.prisma.group.findUnique({
      where: { domain }
    });

    if (!group) {
      // Create new group for this domain
      group = await this.prisma.group.create({
        data: {
          name: `${domain} Group`,
          domain,
          settings: {}
        }
      });
    }

    // Create user
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        domain,
        firebaseUid,
        groupId: group.id,
        role: 'member'
      },
      include: { group: true }
    });

    return user;
  }

  async getUser(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { group: true }
    });
  }
}