import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth.service';
import { Group, GroupMember, GroupInvitation } from '../common/dto/user.dto';
import { CreateGroupInput, UpdateGroupInput, InviteToGroupInput } from '../common/dto/input.dto';
import { Role } from '../common/types/prisma.types';

@Resolver(() => Group)
@UseGuards(AuthGuard)
export class GroupsResolver {
  constructor(private groupsService: GroupsService) {}

  @Query(() => [Group])
  async myGroups(@CurrentUser() user: AuthUser): Promise<Group[]> {
    return this.groupsService.getUserGroups(user.id) as any;
  }

  @Query(() => Group, { nullable: true })
  async myGroup(@CurrentUser() user: AuthUser): Promise<Group | null> {
    return this.groupsService.getUserPrimaryGroup(user.id) as any;
  }

  @Query(() => Group, { nullable: true })
  async group(
    @CurrentUser() user: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Group | null> {
    // Users can only view groups they are members of
    const userGroups = await this.groupsService.getUserGroups(user.id);
    const hasAccess = userGroups.some(group => group.id === id);
    
    if (!hasAccess) {
      return null;
    }
    
    return this.groupsService.findById(id) as any;
  }

  @Query(() => [GroupMember])
  async groupMembers(
    @CurrentUser() user: AuthUser,
    @Args('groupId', { type: () => ID }) groupId: string,
  ): Promise<GroupMember[]> {
    // Verify user has access to this group
    const userGroups = await this.groupsService.getUserGroups(user.id);
    const hasAccess = userGroups.some(group => group.id === groupId);
    
    if (!hasAccess) {
      throw new Error('Access denied');
    }

    return this.groupsService.getGroupMembers(groupId) as any;
  }

  @Mutation(() => Group)
  async createGroup(
    @CurrentUser() user: AuthUser,
    @Args('input') createGroupInput: CreateGroupInput,
  ): Promise<Group> {
    return this.groupsService.createGroup(user.id, createGroupInput) as any;
  }

  @Mutation(() => Group)
  async updateGroup(
    @CurrentUser() user: AuthUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateGroupInput: UpdateGroupInput,
  ): Promise<Group> {
    return this.groupsService.updateGroup(id, user.id, updateGroupInput) as any;
  }

  @Mutation(() => GroupInvitation)
  async inviteToGroup(
    @CurrentUser() user: AuthUser,
    @Args('input') inviteInput: InviteToGroupInput,
  ): Promise<GroupInvitation> {
    return this.groupsService.inviteToGroup(user.id, inviteInput) as any;
  }

  @Mutation(() => Group)
  async acceptGroupInvitation(
    @CurrentUser() user: AuthUser,
    @Args('token') token: string,
  ): Promise<Group> {
    return this.groupsService.acceptInvitation(token, user.id) as any;
  }

  @Mutation(() => Boolean)
  async declineGroupInvitation(
    @Args('token') token: string,
  ): Promise<boolean> {
    return this.groupsService.declineInvitation(token);
  }

  @Mutation(() => Boolean)
  async removeUserFromGroup(
    @CurrentUser() user: AuthUser,
    @Args('groupId', { type: () => ID }) groupId: string,
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<boolean> {
    return this.groupsService.removeUserFromGroup(groupId, user.id, userId);
  }

  @Mutation(() => Boolean)
  async updateUserRole(
    @CurrentUser() user: AuthUser,
    @Args('groupId', { type: () => ID }) groupId: string,
    @Args('userId', { type: () => ID }) userId: string,
    @Args('role', { type: () => String }) role: string,
  ): Promise<boolean> {
    return this.groupsService.updateUserRole(groupId, user.id, userId, role as Role);
  }

  @Query(() => String)
  async groupStats(
    @CurrentUser() user: AuthUser,
    @Args('groupId', { type: () => ID, nullable: true }) groupId?: string,
  ): Promise<string> {
    const targetGroupId = groupId || user.primaryGroupId;
    if (!targetGroupId) {
      throw new Error('No group specified');
    }

    // Verify user has access to this group
    const userGroups = await this.groupsService.getUserGroups(user.id);
    const hasAccess = userGroups.some(group => group.id === targetGroupId);
    
    if (!hasAccess) {
      throw new Error('Access denied');
    }

    const stats = await this.groupsService.getGroupStats(targetGroupId);
    return JSON.stringify(stats);
  }
}