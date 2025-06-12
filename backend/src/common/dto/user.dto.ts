import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Role } from '../types/prisma.types';

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field(() => Role)
  role: Role;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Group)
  group: Group;
}

@ObjectType()
export class Group {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  domain: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [User])
  users: User[];
}