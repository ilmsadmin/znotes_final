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
  ): Promise<ActivityLog[]> {
    return this.activityService.getGroupActivity(user.groupId, limit) as Promise<ActivityLog[]>;
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
    // First verify the note belongs to the user's group
    const activities = await this.activityService.getNoteActivity(noteId);
    
    // Filter to only show activities from the user's group
    return activities.filter(activity => 
      activity.user && activity.user.groupId === user.groupId
    ) as ActivityLog[];
  }
}