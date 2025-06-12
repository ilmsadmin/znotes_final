import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.dto';
import { Note } from './note.dto';

@ObjectType()
export class ActivityLog {
  @Field(() => ID)
  id: string;

  @Field()
  action: string;

  @Field()
  details: string; // JSON string

  @Field()
  createdAt: Date;

  @Field(() => User)
  user: User;

  @Field(() => Note, { nullable: true })
  note?: Note;
}