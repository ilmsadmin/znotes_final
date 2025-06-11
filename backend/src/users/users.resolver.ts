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
    return currentUser as User;
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id', { type: () => ID }) id: string): Promise<User | null> {
    return this.usersService.findById(id) as Promise<User | null>;
  }

  @Query(() => [User])
  async usersInGroup(@CurrentUser() user: AuthUser): Promise<User[]> {
    return this.usersService.findUsersInGroup(user.groupId) as Promise<User[]>;
  }

  @Mutation(() => User)
  async updateProfile(
    @CurrentUser() user: AuthUser,
    @Args('input') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    await this.usersService.updateLastActive(user.id);
    return this.usersService.updateUser(user.id, updateUserInput) as Promise<User>;
  }

  @Mutation(() => Boolean)
  async updateLastActive(@CurrentUser() user: AuthUser): Promise<boolean> {
    await this.usersService.updateLastActive(user.id);
    return true;
  }
}