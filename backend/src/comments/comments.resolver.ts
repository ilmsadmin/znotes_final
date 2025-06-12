import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth.service';
import { Comment } from '../common/dto/note.dto';
import { CreateCommentInput, UpdateCommentInput } from '../common/dto/input.dto';

@Resolver(() => Comment)
@UseGuards(AuthGuard)
export class CommentsResolver {
  constructor(private commentsService: CommentsService) {}

  @Mutation(() => Comment)
  async createComment(
    @CurrentUser() user: AuthUser,
    @Args('input') createCommentInput: CreateCommentInput,
  ): Promise<Comment> {
    return this.commentsService.create(user.id, user.groupIds, createCommentInput) as any;
  }

  @Query(() => [Comment])
  async commentsByNote(
    @CurrentUser() user: AuthUser,
    @Args('noteId', { type: () => ID }) noteId: string,
  ): Promise<Comment[]> {
    return this.commentsService.findByNoteId(noteId, user.groupIds) as any;
  }

  @Mutation(() => Comment)
  async updateComment(
    @CurrentUser() user: AuthUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateCommentInput: UpdateCommentInput,
  ): Promise<Comment> {
    return this.commentsService.update(id, user.id, user.groupIds, updateCommentInput) as any;
  }

  @Mutation(() => Boolean)
  async deleteComment(
    @CurrentUser() user: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.commentsService.remove(id, user.id, user.groupIds);
  }
}