import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserInput } from '../common/dto/input.dto';
import { User } from '../common/types/prisma.types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        group: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        group: true,
      },
    });
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        group: true,
      },
    });
  }

  async updateUser(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserInput,
      include: {
        group: true,
      },
    });
  }

  async findUsersInGroup(groupId: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { groupId },
      include: {
        group: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async updateLastActive(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        lastActive: new Date(),
      },
    });
  }
}