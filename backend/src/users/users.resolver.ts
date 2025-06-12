import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth.service';
import { User } from '../common/dto/user.dto';
import { UpdateUserInput } from '../common/dto/input.dto';

@Resolver(() => User)
@UseGuards(AuthGuard)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User, { name: 'me' })
  async getCurrentUser(@CurrentUser() user: AuthUser): Promise<User> {
    const currentUser = await this.usersService.findById(user.id);
    if (!currentUser) {
      throw new Error('User not found');
    }
    return currentUser as any;
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id', { type: () => ID }) id: string): Promise<User | null> {
    return this.usersService.findById(id) as any;
  }

  @Query(() => [User])
  async usersInGroup(
    @CurrentUser() user: AuthUser,
    @Args('groupId', { type: () => ID, nullable: true }) groupId?: string,
  ): Promise<User[]> {
    const targetGroupId = groupId || user.primaryGroupId;
    if (!targetGroupId) {
      throw new Error('No group specified');
    }
    return this.usersService.findUsersInGroup(targetGroupId) as any;
  }

  @Mutation(() => User)
  async updateProfile(
    @CurrentUser() user: AuthUser,
    @Args('input') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    await this.usersService.updateLastActive(user.id);
    return this.usersService.updateUser(user.id, updateUserInput) as any;
  }

  @Mutation(() => Boolean)
  async updateLastActive(@CurrentUser() user: AuthUser): Promise<boolean> {
    await this.usersService.updateLastActive(user.id);
    return true;
  }
}