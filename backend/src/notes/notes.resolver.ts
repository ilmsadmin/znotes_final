import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth.service';
import { Note } from '../common/dto/note.dto';
import { CreateNoteInput, UpdateNoteInput } from '../common/dto/input.dto';
import { NoteType, NoteStatus } from '../common/types/prisma.types';

@Resolver(() => Note)
@UseGuards(AuthGuard)
export class NotesResolver {
  constructor(private notesService: NotesService) {}

  @Mutation(() => Note)
  async createNote(
    @CurrentUser() user: AuthUser,
    @Args('input') createNoteInput: CreateNoteInput,
  ): Promise<Note> {
    return this.notesService.create(user.id, user.groupId, createNoteInput) as Promise<Note>;
  }

  @Query(() => [Note])
  async notes(
    @CurrentUser() user: AuthUser,
    @Args('type', { type: () => String, nullable: true }) type?: string,
    @Args('status', { type: () => String, nullable: true }) status?: string,
  ): Promise<Note[]> {
    const noteType = type as NoteType | undefined;
    const noteStatus = status as NoteStatus | undefined;
    return this.notesService.findAll(user.groupId, noteType, noteStatus) as Promise<Note[]>;
  }

  @Query(() => Note, { nullable: true })
  async note(
    @CurrentUser() user: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Note | null> {
    return this.notesService.findOne(id, user.groupId) as Promise<Note | null>;
  }

  @Query(() => [Note])
  async notesByType(
    @CurrentUser() user: AuthUser,
    @Args('type', { type: () => String }) type: string,
  ): Promise<Note[]> {
    const noteType = type as NoteType;
    return this.notesService.getByType(user.groupId, noteType) as Promise<Note[]>;
  }

  @Query(() => [Note])
  async searchNotes(
    @CurrentUser() user: AuthUser,
    @Args('query') query: string,
  ): Promise<Note[]> {
    return this.notesService.search(user.groupId, query) as Promise<Note[]>;
  }

  @Mutation(() => Note)
  async updateNote(
    @CurrentUser() user: AuthUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateNoteInput: UpdateNoteInput,
  ): Promise<Note> {
    return this.notesService.update(id, user.id, user.groupId, updateNoteInput) as Promise<Note>;
  }

  @Mutation(() => Boolean)
  async deleteNote(
    @CurrentUser() user: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.notesService.remove(id, user.id, user.groupId);
  }
}