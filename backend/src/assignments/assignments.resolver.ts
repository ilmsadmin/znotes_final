import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth.service';
import { Assignment } from '../common/dto/note.dto';
import { CreateAssignmentInput } from '../common/dto/input.dto';

@Resolver(() => Assignment)
@UseGuards(AuthGuard)
export class AssignmentsResolver {
  constructor(private assignmentsService: AssignmentsService) {}

  @Mutation(() => Assignment)
  async createAssignment(
    @CurrentUser() user: AuthUser,
    @Args('input') createAssignmentInput: CreateAssignmentInput,
  ): Promise<Assignment> {
    return this.assignmentsService.create(createAssignmentInput) as Promise<Assignment>;
  }

  @Query(() => [Assignment])
  async assignmentsByNote(
    @CurrentUser() user: AuthUser,
    @Args('noteId', { type: () => ID }) noteId: string,
  ): Promise<Assignment[]> {
    return this.assignmentsService.findByNoteId(noteId) as Promise<Assignment[]>;
  }

  @Query(() => [Assignment])
  async myAssignments(@CurrentUser() user: AuthUser): Promise<Assignment[]> {
    return this.assignmentsService.findByAssigneeId(user.id) as Promise<Assignment[]>;
  }

  @Mutation(() => Boolean)
  async removeAssignment(
    @CurrentUser() user: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.assignmentsService.remove(id, user.id);
  }

  @Mutation(() => Boolean)
  async unassignFromNote(
    @CurrentUser() user: AuthUser,
    @Args('noteId', { type: () => ID }) noteId: string,
    @Args('assigneeId', { type: () => ID }) assigneeId: string,
  ): Promise<boolean> {
    return this.assignmentsService.removeByNoteAndAssignee(noteId, assigneeId, user.id);
  }
}