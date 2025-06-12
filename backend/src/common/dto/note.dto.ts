import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { NoteType, NoteStatus } from '../types/prisma.types';
import { User } from './user.dto';

registerEnumType(NoteType, {
  name: 'NoteType',
});

registerEnumType(NoteStatus, {
  name: 'NoteStatus',
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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  creator: User;

  @Field(() => [Comment])
  comments: Comment[];
}

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  author: User;

  @Field(() => Note)
  note: Note;
}