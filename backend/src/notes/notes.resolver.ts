import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser, AuthService } from '../auth/auth.service';
import { Note } from '../common/dto/note.dto';
import { CreateNoteInput, UpdateNoteInput, NotesFilterInput } from '../common/dto/input.dto';
import { NoteType, NoteStatus } from '../common/types/prisma.types';

@Resolver(() => Note)
@UseGuards(AuthGuard)
export class NotesResolver {
  constructor(
    private notesService: NotesService,
    private authService: AuthService,
  ) {}

  @Mutation(() => Note)
  async createNote(
    @CurrentUser() user: AuthUser,
    @Args('input') createNoteInput: CreateNoteInput,
    @Args('groupId', { type: () => ID, nullable: true }) groupId?: string,
  ): Promise<Note> {
    const targetGroupId = groupId || user.primaryGroupId;
    if (!targetGroupId) {
      throw new Error('No group specified');
    }
    return this.notesService.create(user.id, targetGroupId, createNoteInput) as any;
  }

  @Query(() => [Note])
  async notes(
    @CurrentUser() user: AuthUser,
    @Args('filter', { nullable: true }) filter?: NotesFilterInput,
  ): Promise<Note[]> {
    const filterWithUser = { ...filter, userId: user.id };
    return this.notesService.findAll(user.groupIds, filterWithUser) as any;
  }

  @Query(() => Note, { nullable: true })
  async note(
    @CurrentUser() user: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Note | null> {
    return this.notesService.findOne(id, user.groupIds) as any;
  }

  @Query(() => [Note])
  async notesByType(
    @CurrentUser() user: AuthUser,
    @Args('type', { type: () => String }) type: string,
  ): Promise<Note[]> {
    const noteType = type as NoteType;
    return this.notesService.getByType(user.groupIds, noteType) as any;
  }

  @Query(() => [Note])
  async searchNotes(
    @CurrentUser() user: AuthUser,
    @Args('query') query: string,
  ): Promise<Note[]> {
    return this.notesService.search(user.groupIds, query) as any;
  }

  @Query(() => [Note])
  async myAssignedNotes(@CurrentUser() user: AuthUser): Promise<Note[]> {
    return this.notesService.getNotesAssignedToUser(user.id, user.groupIds) as any;
  }

  @Query(() => [Note])
  async upcomingDeadlines(@CurrentUser() user: AuthUser): Promise<Note[]> {
    return this.notesService.getNotesWithDeadlines(user.groupIds, true) as any;
  }

  @Query(() => [Note])
  async overdueNotes(@CurrentUser() user: AuthUser): Promise<Note[]> {
    return this.notesService.getNotesWithDeadlines(user.groupIds, false) as any;
  }

  @Mutation(() => Note)
  async updateNote(
    @CurrentUser() user: AuthUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateNoteInput: UpdateNoteInput,
  ): Promise<Note> {
    return this.notesService.update(id, user.id, user.groupIds, updateNoteInput) as any;
  }

  @Mutation(() => Note)
  async pinNote(
    @CurrentUser() user: AuthUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('isPinned', { type: () => Boolean }) isPinned: boolean,
  ): Promise<Note> {
    return this.notesService.updateNotePinStatus(id, user.id, user.groupIds, isPinned) as any;
  }

  @Mutation(() => Boolean)
  async deleteNote(
    @CurrentUser() user: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.notesService.remove(id, user.id, user.groupIds);
  }
}