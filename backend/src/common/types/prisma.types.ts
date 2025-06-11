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

export interface User {
  id: string;
  name: string;
  email: string;
  domain: string;
  groupId: string;
  role: Role;
  avatarUrl?: string;
  firebaseUid: string;
  lastActive?: Date;
  createdAt: Date;
  updatedAt: Date;
  group?: Group;
}

export interface Group {
  id: string;
  name: string;
  domain: string;
  settings: any;
  createdAt: Date;
  updatedAt: Date;
  users?: User[];
  notes?: Note[];
}

export interface Note {
  id: string;
  groupId: string;
  creatorId: string;
  title: string;
  content?: string;
  type: NoteType;
  status: NoteStatus;
  metadata: any;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  group?: Group;
  creator?: User;
  comments?: Comment[];
  files?: File[];
  activityLogs?: ActivityLog[];
  syncLogs?: SyncLog[];
}

export interface Comment {
  id: string;
  noteId: string;
  authorId: string;
  content: string;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
  note?: Note;
  author?: User;
}

export interface File {
  id: string;
  noteId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: bigint;
  uploadedBy: string;
  createdAt: Date;
  note?: Note;
  uploader?: User;
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