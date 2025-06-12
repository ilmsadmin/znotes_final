import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth.service';
import { ActivityLog } from '../common/dto/activity.dto';

@Resolver(() => ActivityLog)
@UseGuards(AuthGuard)
export class ActivityResolver {
  constructor(private activityService: ActivityService) {}

  @Query(() => [ActivityLog])
  async groupActivity(
    @CurrentUser() user: AuthUser,
    @Args('limit', { type: () => Number, defaultValue: 50 }) limit: number,
    @Args('groupId', { nullable: true }) groupId?: string,
  ): Promise<ActivityLog[]> {
    const targetGroupId = groupId || user.primaryGroupId;
    if (!targetGroupId) {
      throw new Error('No group specified');
    }
    return this.activityService.getGroupActivity(targetGroupId, limit) as Promise<ActivityLog[]>;
  }

  @Query(() => [ActivityLog])
  async myActivity(
    @CurrentUser() user: AuthUser,
    @Args('limit', { type: () => Number, defaultValue: 20 }) limit: number,
  ): Promise<ActivityLog[]> {
    return this.activityService.getUserActivity(user.id, limit) as Promise<ActivityLog[]>;
  }

  @Query(() => [ActivityLog])
  async noteActivity(
    @CurrentUser() user: AuthUser,
    @Args('noteId') noteId: string,
  ): Promise<ActivityLog[]> {
    // First verify the note belongs to the user's groups
    const activities = await this.activityService.getNoteActivity(noteId);
    
    // Filter to only show activities from the user's groups
    return activities.filter(activity => 
      activity.user && user.groupIds.some(groupId => 
        activity.user.groupMemberships?.some(gm => gm.groupId === groupId)
      )
    ) as ActivityLog[];
  }
}