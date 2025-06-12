import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { NoteType, NoteStatus, Priority, Severity, NotificationType } from '../types/prisma.types';
import { User } from './user.dto';

registerEnumType(NoteType, {
  name: 'NoteType',
});

registerEnumType(NoteStatus, {
  name: 'NoteStatus',
});

registerEnumType(Priority, {
  name: 'Priority',
});

registerEnumType(Severity, {
  name: 'Severity',
});

registerEnumType(NotificationType, {
  name: 'NotificationType',
});

@ObjectType()
export class Note {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => NoteType)
  type: NoteType;

  @Field(() => NoteStatus)
  status: NoteStatus;

  @Field(() => Priority, { nullable: true })
  priority?: Priority;

  @Field(() => Severity, { nullable: true })
  severity?: Severity;

  @Field({ nullable: true })
  deadline?: Date;

  @Field({ nullable: true })
  estimatedTime?: number;

  @Field(() => [String])
  tags: string[];

  @Field()
  isPinned: boolean;

  @Field()
  version: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  creator: User;

  @Field(() => Note, { nullable: true })
  parent?: Note;

  @Field(() => [Note], { nullable: true })
  children?: Note[];

  @Field(() => [Assignment])
  assignments: Assignment[];

  @Field(() => [Comment])
  comments: Comment[];

  @Field(() => [File])
  files: File[];
}

@ObjectType()
export class Assignment {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field(() => User)
  assignee: User;

  @Field(() => Note)
  note: Note;
}

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => [String])
  mentions: string[];

  @Field()
  version: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  author: User;

  @Field(() => Note)
  note: Note;

  @Field(() => Comment, { nullable: true })
  parentComment?: Comment;

  @Field(() => [Comment], { nullable: true })
  replies?: Comment[];
}

@ObjectType()
export class File {
  @Field(() => ID)
  id: string;

  @Field()
  fileUrl: string;

  @Field()
  fileName: string;

  @Field()
  fileType: string;

  @Field()
  fileSize: string; // GraphQL doesn't support BigInt, so we'll use string

  @Field()
  createdAt: Date;

  @Field(() => User)
  uploader: User;

  @Field(() => Note)
  note: Note;
}

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field({ nullable: true })
  noteId?: string;

  @Field()
  message: string;

  @Field()
  read: boolean;

  @Field()
  createdAt: Date;

  @Field(() => User)
  user: User;

  @Field(() => Note, { nullable: true })
  note?: Note;
}