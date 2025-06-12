// Mock types for development when Prisma client can't be generated
export enum Role {
  admin = 'admin',
  member = 'member',
}

export enum NoteType {
  note = 'note',
  task = 'task',
  meeting = 'meeting',
  announcement = 'announcement',
}

export enum NoteStatus {
  open = 'open',
  in_progress = 'in_progress',
  completed = 'completed',
  archived = 'archived',
}

export enum Priority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export enum Severity {
  low = 'low',
  medium = 'medium',
  critical = 'critical',
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
}

export enum PlanType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

export enum NotificationType {
  COMMENT = 'COMMENT',
  ASSIGN = 'ASSIGN',
  DEADLINE = 'DEADLINE',
  MENTION = 'MENTION',
}

export enum SyncAction {
  create = 'create',
  update = 'update',
  delete = 'delete',
}

export enum SyncStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  firebaseUid: string;
  lastActive?: Date;
  createdAt: Date;
  updatedAt: Date;
  groupsCreated?: Group[];
  groupMemberships?: GroupMember[];
  groupLimits?: UserGroupLimits;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  creatorId: string;
  maxMembers: number;
  settings: any;
  createdAt: Date;
  updatedAt: Date;
  creator?: User;
  members?: GroupMember[];
  invitations?: GroupInvitation[];
  notes?: Note[];
  memberCount?: number; // Computed field
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: Role;
  joinedAt: Date;
  group?: Group;
  user?: User;
}

export interface GroupInvitation {
  id: string;
  groupId: string;
  invitedBy: string;
  email: string;
  token: string;
  status: InvitationStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  group?: Group;
  inviter?: User;
}

export interface UserGroupLimits {
  userId: string;
  createdGroupsCount: number;
  maxGroupsAllowed: number;
  planType: PlanType;
  updatedAt: Date;
  user?: User;
}

export interface Note {
  id: string;
  groupId: string;
  creatorId: string;
  parentId?: string;
  title: string;
  content?: string;
  type: NoteType;
  status: NoteStatus;
  priority?: Priority;
  severity?: Severity;
  deadline?: Date;
  estimatedTime?: number;
  tags: string[];
  isPinned: boolean;
  version: number;
  contentHash?: string;
  lastModifiedBy?: string;
  conflictData?: any;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
  group?: Group;
  creator?: User;
  parent?: Note;
  children?: Note[];
  lastModifier?: User;
  assignments?: Assignment[];
  comments?: Comment[];
  files?: File[];
  notifications?: Notification[];
  activityLogs?: ActivityLog[];
  syncLogs?: SyncLog[];
}

export interface Assignment {
  id: string;
  noteId: string;
  assigneeId: string;
  createdAt: Date;
  note?: Note;
  assignee?: User;
}

export interface Comment {
  id: string;
  noteId: string;
  authorId: string;
  parentCommentId?: string;
  content: string;
  mentions: string[];
  version: number;
  contentHash?: string;
  lastModifiedBy?: string;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
  note?: Note;
  author?: User;
  parentComment?: Comment;
  replies?: Comment[];
  lastModifier?: User;
}

export interface File {
  id: string;
  noteId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: string; // Changed from bigint to string for GraphQL compatibility
  uploadedBy: string;
  createdAt: Date;
  note?: Note;
  uploader?: User;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  noteId?: string;
  message: string;
  data: any;
  read: boolean;
  createdAt: Date;
  user?: User;
  note?: Note;
}

export interface ActivityLog {
  id: string;
  userId: string;
  noteId?: string;
  action: string;
  details: any;
  createdAt: Date;
  user?: User;
  note?: Note;
}

export interface SyncLog {
  id: string;
  userId: string;
  noteId?: string;
  tableName: string;
  recordId: string;
  action: string;
  oldData?: any;
  newData?: any;
  createdAt: Date;
  user?: User;
  note?: Note;
}

export interface SyncQueue {
  id: string;
  userId: string;
  tableName: string;
  recordId: string;
  action: SyncAction;
  data: any;
  clientTimestamp: Date;
  retryCount: number;
  status: SyncStatus;
  errorMessage?: string;
  dependsOn?: string;
  createdAt: Date;
  user?: User;
  dependency?: SyncQueue;
  dependentItems?: SyncQueue[];
}