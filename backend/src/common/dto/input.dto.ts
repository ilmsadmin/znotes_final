import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsEnum, IsArray, IsBoolean, IsNumber, IsDateString } from 'class-validator';
import { NoteType, NoteStatus, Priority, Severity } from '../types/prisma.types';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  firebaseUid: string;

  @Field({ nullable: true })
  @IsOptional()
  avatarUrl?: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  avatarUrl?: string;
}

@InputType()
export class CreateGroupInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  avatarUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  maxMembers?: number;
}

@InputType()
export class UpdateGroupInput {
  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  avatarUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  maxMembers?: number;
}

@InputType()
export class InviteToGroupInput {
  @Field()
  @IsNotEmpty()
  groupId: string;

  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class CreateNoteInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  content?: string;

  @Field(() => NoteType)
  @IsEnum(NoteType)
  type: NoteType;

  @Field({ nullable: true })
  @IsOptional()
  parentId?: string;

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @Field(() => Severity, { nullable: true })
  @IsOptional()
  @IsEnum(Severity)
  severity?: Severity;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  estimatedTime?: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

@InputType()
export class UpdateNoteInput {
  @Field({ nullable: true })
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  content?: string;

  @Field(() => NoteStatus, { nullable: true })
  @IsOptional()
  @IsEnum(NoteStatus)
  status?: NoteStatus;

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @Field(() => Severity, { nullable: true })
  @IsOptional()
  @IsEnum(Severity)
  severity?: Severity;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  estimatedTime?: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

@InputType()
export class CreateCommentInput {
  @Field()
  @IsNotEmpty()
  noteId: string;

  @Field()
  @IsNotEmpty()
  content: string;

  @Field({ nullable: true })
  @IsOptional()
  parentCommentId?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  mentions?: string[];
}

@InputType()
export class UpdateCommentInput {
  @Field()
  @IsNotEmpty()
  content: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  mentions?: string[];
}

@InputType()
export class CreateAssignmentInput {
  @Field()
  @IsNotEmpty()
  noteId: string;

  @Field()
  @IsNotEmpty()
  assigneeId: string;
}

@InputType()
export class NotesFilterInput {
  @Field(() => NoteType, { nullable: true })
  @IsOptional()
  @IsEnum(NoteType)
  type?: NoteType;

  @Field(() => NoteStatus, { nullable: true })
  @IsOptional()
  @IsEnum(NoteStatus)
  status?: NoteStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  assignedToMe?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  search?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  offset?: number;
}