import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Role, InvitationStatus, PlanType } from '../types/prisma.types';

registerEnumType(Role, {
  name: 'Role',
});

registerEnumType(InvitationStatus, {
  name: 'InvitationStatus',
});

registerEnumType(PlanType, {
  name: 'PlanType',
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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [GroupMember], { nullable: true })
  groupMemberships?: GroupMember[];

  @Field(() => UserGroupLimits, { nullable: true })
  groupLimits?: UserGroupLimits;
}

@ObjectType()
export class Group {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field()
  maxMembers: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  creator: User;

  @Field(() => [GroupMember])
  members: GroupMember[];

  @Field(() => [GroupInvitation], { nullable: true })
  invitations?: GroupInvitation[];

  @Field(() => Number)
  memberCount: number;
}

@ObjectType()
export class GroupMember {
  @Field(() => ID)
  id: string;

  @Field(() => Role)
  role: Role;

  @Field()
  joinedAt: Date;

  @Field(() => User)
  user: User;

  @Field(() => Group)
  group: Group;
}

@ObjectType()
export class GroupInvitation {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  token: string;

  @Field(() => InvitationStatus)
  status: InvitationStatus;

  @Field()
  expiresAt: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Group)
  group: Group;

  @Field(() => User)
  inviter: User;
}

@ObjectType()
export class UserGroupLimits {
  @Field()
  createdGroupsCount: number;

  @Field()
  maxGroupsAllowed: number;

  @Field(() => PlanType)
  planType: PlanType;

  @Field()
  updatedAt: Date;
}