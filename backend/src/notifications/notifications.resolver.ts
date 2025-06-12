import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth.service';
import { Notification } from '../common/dto/note.dto';

@Resolver(() => Notification)
@UseGuards(AuthGuard)
export class NotificationsResolver {
  constructor(private notificationsService: NotificationsService) {}

  @Query(() => [Notification])
  async notifications(
    @CurrentUser() user: AuthUser,
    @Args('limit', { type: () => Number, nullable: true, defaultValue: 50 }) limit: number,
    @Args('offset', { type: () => Number, nullable: true, defaultValue: 0 }) offset: number,
  ): Promise<Notification[]> {
    return this.notificationsService.findByUserId(user.id, limit, offset) as Promise<Notification[]>;
  }

  @Query(() => [Notification])
  async unreadNotifications(@CurrentUser() user: AuthUser): Promise<Notification[]> {
    return this.notificationsService.findUnreadByUserId(user.id) as Promise<Notification[]>;
  }

  @Query(() => Number)
  async unreadNotificationCount(@CurrentUser() user: AuthUser): Promise<number> {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @Mutation(() => Notification)
  async markNotificationAsRead(
    @CurrentUser() user: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Notification> {
    return this.notificationsService.markAsRead(id, user.id) as Promise<Notification>;
  }

  @Mutation(() => Boolean)
  async markAllNotificationsAsRead(@CurrentUser() user: AuthUser): Promise<boolean> {
    return this.notificationsService.markAllAsRead(user.id);
  }
}