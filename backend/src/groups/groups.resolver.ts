import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth.service';
import { Group } from '../common/dto/user.dto';

@Resolver(() => Group)
@UseGuards(AuthGuard)
export class GroupsResolver {
  constructor(private groupsService: GroupsService) {}

  @Query(() => Group, { nullable: true })
  async myGroup(@CurrentUser() user: AuthUser): Promise<Group | null> {
    return this.groupsService.getUserGroup(user.id) as Promise<Group | null>;
  }

  @Query(() => Group, { nullable: true })
  async group(
    @CurrentUser() user: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Group | null> {
    const group = await this.groupsService.findById(id);
    
    // Users can only view their own group
    if (!group || group.id !== user.groupId) {
      return null;
    }
    
    return group as Group;
  }

  @Mutation(() => Group)
  async updateGroupSettings(
    @CurrentUser() user: AuthUser,
    @Args('settings', { type: () => String }) settings: string,
  ): Promise<Group> {
    const parsedSettings = JSON.parse(settings);
    return this.groupsService.updateGroupSettings(user.groupId, user.id, parsedSettings) as Promise<Group>;
  }

  @Query(() => String)
  async groupStats(@CurrentUser() user: AuthUser): Promise<string> {
    const stats = await this.groupsService.getGroupStats(user.groupId);
    return JSON.stringify(stats);
  }
}