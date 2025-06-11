import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { NoteType, NoteStatus } from '../types/prisma.types';

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
}

@InputType()
export class CreateCommentInput {
  @Field()
  @IsNotEmpty()
  noteId: string;

  @Field()
  @IsNotEmpty()
  content: string;
}