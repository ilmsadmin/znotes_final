import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SyncService, DeltaSyncRequest } from './sync.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth.service';

@Resolver()
@UseGuards(AuthGuard)
export class SyncResolver {
  constructor(private syncService: SyncService) {}

  @Query(() => String, { name: 'initialSync' })
  async getInitialSync(
    @CurrentUser() user: AuthUser,
    @Args('lastSyncTime', { nullable: true }) lastSyncTime?: string,
    @Args('tables', { nullable: true }) tables?: string,
  ): Promise<string> {
    const lastSync = lastSyncTime ? new Date(lastSyncTime) : undefined;
    const tableList = tables ? tables.split(',') : undefined;
    
    const result = await this.syncService.getInitialSync(user.id, lastSync, tableList);
    return JSON.stringify(result);
  }

  @Mutation(() => String, { name: 'deltaSync' })
  async processDeltaSync(
    @CurrentUser() user: AuthUser,
    @Args('request') requestJson: string,
  ): Promise<string> {
    const request: DeltaSyncRequest = JSON.parse(requestJson);
    const result = await this.syncService.processDeltaSync(user.id, request);
    return JSON.stringify(result);
  }

  @Query(() => String, { name: 'syncQueue' })
  async getSyncQueue(@CurrentUser() user: AuthUser): Promise<string> {
    const queue = await this.syncService.getSyncQueue(user.id);
    return JSON.stringify(queue);
  }

  @Mutation(() => Boolean, { name: 'processSyncQueue' })
  async processSyncQueue(@CurrentUser() user: AuthUser): Promise<boolean> {
    await this.syncService.processSyncQueue(user.id);
    return true;
  }

  @Mutation(() => String, { name: 'addToSyncQueue' })
  async addToSyncQueue(
    @CurrentUser() user: AuthUser,
    @Args('tableName') tableName: string,
    @Args('recordId') recordId: string,
    @Args('action') action: string,
    @Args('data') data: string,
    @Args('clientTimestamp') clientTimestamp: string,
  ): Promise<string> {
    const result = await this.syncService.addToSyncQueue(
      user.id,
      tableName,
      recordId,
      action as any,
      JSON.parse(data),
      new Date(clientTimestamp),
    );
    return JSON.stringify(result);
  }
}