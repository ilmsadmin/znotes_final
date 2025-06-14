// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  groupMemberships?: GroupMember[];
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  maxMembers: number;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  role: UserRole;
  joinedAt: string;
  user: User;
  group: Group;
}

export enum UserRole {
  MEMBER = 'member',
  ADMIN = 'admin'
}

// Note Types
export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  status: NoteStatus;
  priority?: Priority;
  severity?: Severity;
  deadline?: string;
  estimatedTime?: number;
  tags?: string[];
  isPinned?: boolean;
  createdAt: string;
  updatedAt?: string;
  creator: User;
  assignments?: Assignment[];
  comments?: Comment[];
  files?: File[];
}

export enum NoteType {
  NOTE = 'note',
  TASK = 'task',
  ISSUE = 'issue',
  MEETING = 'meeting',
  ANNOUNCEMENT = 'announcement'
}

export enum NoteStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  CRITICAL = 'critical'
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  mentions?: string[];
  createdAt: string;
  updatedAt?: string;
  author: User;
  noteId: string;
  parentComment?: Comment;
  replies?: Comment[];
}

// Assignment Types
export interface Assignment {
  id: string;
  createdAt: string;
  assignee: User;
  note?: Note;
}

// File Types
export interface File {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  uploader: User;
}

// Activity Types
export interface Activity {
  id: string;
  action: ActivityAction;
  details: string;
  createdAt: string;
  user?: User;
  note?: Note;
}

export enum ActivityAction {
  NOTE_CREATED = 'note_created',
  NOTE_UPDATED = 'note_updated',
  NOTE_DELETED = 'note_deleted',
  COMMENT_CREATED = 'comment_created',
  USER_JOINED = 'user_joined'
}

// Input Types
export interface CreateNoteInput {
  title: string;
  content: string;
  type: NoteType;
  priority?: Priority;
  severity?: Severity;
  deadline?: string;
  estimatedTime?: number;
  tags?: string[];
  parentId?: string;
  isPinned?: boolean;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  status?: NoteStatus;
  type?: NoteType;
  priority?: Priority;
  severity?: Severity;
  deadline?: string;
  estimatedTime?: number;
  tags?: string[];
  isPinned?: boolean;
}

export interface CreateCommentInput {
  noteId: string;
  content: string;
  parentCommentId?: string;
  mentions?: string[];
}

export interface UpdateCommentInput {
  content: string;
  mentions?: string[];
}

export interface CreateAssignmentInput {
  noteId: string;
  assigneeId: string;
}

export interface UpdateProfileInput {
  name?: string;
  avatarUrl?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: Array<string | number>;
  }>;
}

// Authentication Types
export interface AuthToken {
  firebaseUid: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
