# API Documentation - NoteFlow

## Tổng quan

NoteFlow API được xây dựng với GraphQL, cung cấp một endpoint duy nhất với khả năng query linh hoạt và type-safe. API hỗ trợ real-time subscriptions và batch operations cho offline sync.

## Base URL
```
Production: https://api.noteflow.app/graphql
Staging: https://staging-api.noteflow.app/graphql  
Development: http://localhost:4000/graphql
```

## Authentication

### Header Format
```http
Authorization: Bearer <firebase_jwt_token>
Content-Type: application/json
```

### Authentication Flow
1. Client authenticates với Firebase Auth
2. Nhận JWT token từ Firebase
3. Gửi token trong Authorization header
4. Server verify token và extract user context

## GraphQL Schema

### Types

#### User
```graphql
type User {
  id: ID!
  name: String!
  email: String!
  avatarUrl: String
  groups: [GroupMember!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum UserRole {
  ADMIN
  MEMBER
}
```

#### Group
```graphql
type Group {
  id: ID!
  name: String!
  description: String
  avatarUrl: String
  creatorId: ID!
  creator: User!
  maxMembers: Int!
  members: [GroupMember!]!
  memberCount: Int!
  invitations: [GroupInvitation!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

#### GroupMember
```graphql
type GroupMember {
  id: ID!
  groupId: ID!
  userId: ID!
  user: User!
  group: Group!
  role: UserRole!
  joinedAt: DateTime!
}
```

#### GroupInvitation
```graphql
type GroupInvitation {
  id: ID!
  groupId: ID!
  group: Group!
  invitedBy: ID!
  inviter: User!
  email: String!
  token: String!
  status: InvitationStatus!
  expiresAt: DateTime!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum InvitationStatus {
  PENDING
  ACCEPTED
  DECLINED
  EXPIRED
}
```

#### UserGroupLimits
```graphql
type UserGroupLimits {
  userId: ID!
  createdGroupsCount: Int!
  maxGroupsAllowed: Int!
  planType: PlanType!
  updatedAt: DateTime!
}

enum PlanType {
  FREE
  PREMIUM
}
```

#### Note
```graphql
type Note {
  id: ID!
  groupId: ID!
  creatorId: ID!
  parentId: ID
  title: String!
  content: String!
  type: NoteType!
  status: String!
  priority: Priority
  severity: Severity
  deadline: DateTime
  estimatedTime: Int
  tags: [String!]!
  isPinned: Boolean!
  assignments: [Assignment!]!
  comments: [Comment!]!
  files: [File!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum NoteType {
  NOTE
  TASK
  ISSUE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

enum Severity {
  LOW
  MEDIUM
  CRITICAL
}
```

#### Assignment
```graphql
type Assignment {
  id: ID!
  noteId: ID!
  assigneeId: ID!
  assignee: User!
  createdAt: DateTime!
}
```

#### Comment
```graphql
type Comment {
  id: ID!
  noteId: ID!
  userId: ID!
  parentCommentId: ID
  content: String!
  user: User!
  replies: [Comment!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

#### File
```graphql
type File {
  id: ID!
  noteId: ID!
  fileUrl: String!
  fileName: String!
  fileType: String!
  fileSize: Int!
  uploadedBy: ID!
  uploader: User!
  createdAt: DateTime!
}
```

#### Notification
```graphql
type Notification {
  id: ID!
  userId: ID!
  type: NotificationType!
  noteId: ID
  message: String!
  read: Boolean!
  createdAt: DateTime!
}

enum NotificationType {
  COMMENT
  ASSIGN
  DEADLINE
  MENTION
}
```

## Queries

### Get Current User
```graphql
query GetMe {
  me {
    id
    name
    email
    avatarUrl
    groups {
      id
      group {
        id
        name
        description
        memberCount
      }
      role
      joinedAt
    }
    groupLimits {
      createdGroupsCount
      maxGroupsAllowed
      planType
    }
  }
}
```

### Get User's Groups
```graphql
query GetMyGroups {
  myGroups {
    id
    group {
      id
      name
      description
      avatarUrl
      memberCount
      maxMembers
      creator {
        id
        name
      }
      createdAt
    }
    role
    joinedAt
  }
}
```

### Get Group Details
```graphql
query GetGroup($id: ID!) {
  group(id: $id) {
    id
    name
    description
    avatarUrl
    maxMembers
    memberCount
    creator {
      id
      name
      avatarUrl
    }
    members {
      id
      role
      joinedAt
      user {
        id
        name
        email
        avatarUrl
      }
    }
    invitations {
      id
      email
      status
      expiresAt
      inviter {
        id
        name
      }
    }
    createdAt
  }
}
```

### Get Available Team Members (for assignments)
```graphql
query GetTeamMembers($groupId: ID!) {
  groupMembers(groupId: $groupId) {
    id
    user {
      id
      name
      email
      avatarUrl
    }
    role
  }
}
```

### Get Notes with Filtering (Group-based)
```graphql
query GetNotes(
  $groupId: ID!
  $type: NoteType
  $status: String
  $assignedToMe: Boolean
  $search: String
  $limit: Int = 20
  $offset: Int = 0
) {
  notes(
    groupId: $groupId
    type: $type
    status: $status
    assignedToMe: $assignedToMe
    search: $search
    limit: $limit
    offset: $offset
  ) {
    id
    title
    content
    type
    status
    priority
    deadline
    isPinned
    createdAt
    updatedAt
    creator {
      id
      name
      avatarUrl
    }
    assignments {
      assignee {
        id
        name
        avatarUrl
      }
    }
  }
}
```

### Get Note Details
```graphql
query GetNote($id: ID!) {
  note(id: $id) {
    id
    title
    content
    type
    status
    priority
    severity
    deadline
    estimatedTime
    tags
    isPinned
    creator {
      id
      name
      avatarUrl
    }
    assignments {
      id
      assignee {
        id
        name
        email
        avatarUrl
      }
    }
    comments {
      id
      content
      createdAt
      user {
        id
        name
        avatarUrl
      }
      replies {
        id
        content
        createdAt
        user {
          id
          name
          avatarUrl
        }
      }
    }
    files {
      id
      fileName
      fileUrl
      fileType
      fileSize
      uploader {
        id
        name
      }
    }
  }
}
```


### Get Notifications
```graphql
query GetNotifications($unreadOnly: Boolean = false) {
  notifications(unreadOnly: $unreadOnly) {
    id
    type
    message
    read
    createdAt
    note {
      id
      title
    }
  }
}
```

## Mutations

### Group Management

#### Create Group
```graphql
mutation CreateGroup($input: CreateGroupInput!) {
  createGroup(input: $input) {
    id
    name
    description
    avatarUrl
    maxMembers
    creator {
      id
      name
    }
    createdAt
  }
}

input CreateGroupInput {
  name: String!
  description: String
  avatarUrl: String
}
```

#### Update Group
```graphql
mutation UpdateGroup($id: ID!, $input: UpdateGroupInput!) {
  updateGroup(id: $id, input: $input) {
    id
    name
    description
    avatarUrl
    updatedAt
  }
}

input UpdateGroupInput {
  name: String
  description: String
  avatarUrl: String
}
```

#### Invite Members to Group
```graphql
mutation InviteMembers($groupId: ID!, $emails: [String!]!) {
  inviteMembers(groupId: $groupId, emails: $emails) {
    id
    email
    status
    expiresAt
    inviter {
      id
      name
    }
  }
}
```

#### Accept Group Invitation
```graphql
mutation AcceptInvitation($token: String!) {
  acceptInvitation(token: $token) {
    id
    group {
      id
      name
      description
    }
    role
    joinedAt
  }
}
```

#### Remove Group Member
```graphql
mutation RemoveGroupMember($groupId: ID!, $userId: ID!) {
  removeGroupMember(groupId: $groupId, userId: $userId) {
    success
    message
  }
}
```

#### Update Member Role
```graphql
mutation UpdateMemberRole($groupId: ID!, $userId: ID!, $role: UserRole!) {
  updateMemberRole(groupId: $groupId, userId: $userId, role: $role) {
    id
    role
    user {
      id
      name
    }
  }
}
```

### Note Management

### Create Note
```graphql
mutation CreateNote($input: CreateNoteInput!) {
  createNote(input: $input) {
    id
    title
    content
    type
    status
    createdAt
  }
}

input CreateNoteInput {
  groupId: ID!
  title: String!
  content: String!
  type: NoteType!
  status: String
  priority: Priority
  severity: Severity
  deadline: DateTime
  estimatedTime: Int
  tags: [String!]
  assigneeIds: [ID!]
}
```

### Update Note
```graphql
mutation UpdateNote($id: ID!, $input: UpdateNoteInput!) {
  updateNote(id: $id, input: $input) {
    id
    title
    content
    status
    updatedAt
  }
}

input UpdateNoteInput {
  title: String
  content: String
  status: String
  priority: Priority
  severity: Severity
  deadline: DateTime
  estimatedTime: Int
  tags: [String!]
  isPinned: Boolean
}
```

### Delete Note
```graphql
mutation DeleteNote($id: ID!) {
  deleteNote(id: $id)
}
```

### Add Comment
```graphql
mutation AddComment($input: AddCommentInput!) {
  addComment(input: $input) {
    id
    content
    createdAt
    user {
      id
      name
      avatarUrl
    }
  }
}

input AddCommentInput {
  noteId: ID!
  content: String!
  parentCommentId: ID
}
```

### Assign Users
```graphql
mutation AssignUsers($noteId: ID!, $userIds: [ID!]!) {
  assignUsers(noteId: $noteId, userIds: $userIds) {
    id
    assignee {
      id
      name
      email
    }
  }
}
```

### Upload File
```graphql
mutation UploadFile($noteId: ID!, $file: Upload!) {
  uploadFile(noteId: $noteId, file: $file) {
    id
    fileName
    fileUrl
    fileType
    fileSize
  }
}
```

### Mark Notification as Read
```graphql
mutation MarkNotificationAsRead($id: ID!) {
  markNotificationAsRead(id: $id) {
    id
    read
  }
}
```

## Subscriptions

### Note Updates
```graphql
subscription NoteUpdated($noteId: ID!) {
  noteUpdated(noteId: $noteId) {
    id
    title
    content
    status
    updatedAt
  }
}
```

### New Comments
```graphql
subscription CommentAdded($noteId: ID!) {
  commentAdded(noteId: $noteId) {
    id
    content
    createdAt
    user {
      id
      name
      avatarUrl
    }
  }
}
```

### New Notifications
```graphql
subscription NotificationReceived {
  notificationReceived {
    id
    type
    message
    createdAt
    note {
      id
      title
    }
  }
}
```

## Batch Operations (Offline Sync)

### Sync Data
```graphql
mutation SyncData($operations: [SyncOperation!]!) {
  syncData(operations: $operations) {
    success
    conflicts {
      operationId: String!
      serverVersion: Note
      clientVersion: Note
    }
    results {
      operationId: String!
      success: Boolean!
      data: Note
      error: String
    }
  }
}

input SyncOperation {
  id: String! # Client-generated operation ID
  action: SyncAction!
  type: String! # "note", "comment", "assignment"
  data: JSON!
  clientTimestamp: DateTime!
}

enum SyncAction {
  CREATE
  UPDATE
  DELETE
}
```

## Advanced Sync Operations

### Initial Sync
```graphql
query InitialSync($lastSyncTime: DateTime, $tables: [String!]) {
  initialSync(lastSyncTime: $lastSyncTime, tables: $tables) {
    syncToken: String!
    serverTime: DateTime!
    data: SyncDataResponse!
    deletions: DeletionResponse!
  }
}

type SyncDataResponse {
  notes: [Note!]!
  comments: [Comment!]!
  groups: [Group!]!
}

type DeletionResponse {
  notes: [ID!]!
  comments: [ID!]!
  groups: [ID!]!
}
```

### Delta Sync
```graphql
mutation DeltaSync($syncToken: String!, $clientChanges: [ClientChange!]!) {
  deltaSync(syncToken: $syncToken, clientChanges: $clientChanges) {
    syncToken: String!
    serverTime: DateTime!
    processedChanges: [ProcessedChange!]!
    serverChanges: [ServerChange!]!
  }
}

input ClientChange {
  action: SyncAction!
  table: String!
  recordId: ID!
  data: JSON!
  localVersion: Int!
  clientTimestamp: DateTime!
}

type ProcessedChange {
  clientRecordId: ID!
  serverRecordId: ID
  status: ChangeStatus!
  serverVersion: Int
  conflictData: JSON
}

enum ChangeStatus {
  SUCCESS
  CONFLICT
  ERROR
}

type ServerChange {
  action: SyncAction!
  table: String!
  recordId: ID!
  data: JSON!
  version: Int!
}
```

### Conflict Resolution
```graphql
mutation ResolveConflict($conflictId: ID!, $resolutionStrategy: ResolutionStrategy!, $mergedData: JSON) {
  resolveConflict(conflictId: $conflictId, resolutionStrategy: $resolutionStrategy, mergedData: $mergedData) {
    status: String!
    finalData: JSON!
    newVersion: Int!
  }
}

enum ResolutionStrategy {
  LOCAL
  SERVER
  MANUAL
}
```

### Migration (Offline to Online)
```graphql
mutation MigrateOfflineData($offlineData: OfflineDataInput!, $deviceId: String!) {
  migrateOfflineData(offlineData: $offlineData, deviceId: $deviceId) {
    migrationId: ID!
    idMappings: JSON!
    conflicts: [MigrationConflict!]!
  }
}

input OfflineDataInput {
  user: JSON!
  groups: [JSON!]!
  notes: [JSON!]!
  comments: [JSON!]!
}

type MigrationConflict {
  table: String!
  localId: ID!
  conflictType: String!
  data: JSON!
}
```

> **Lưu ý**: Để biết chi tiết về cách thức hoạt động của hệ thống sync, vui lòng tham khảo [Offline/Online Sync Documentation](./offline-online-sync.md).

## Error Handling

### Error Types
```graphql
type Error {
  message: String!
  code: String!
  path: [String!]
}

enum ErrorCode {
  UNAUTHORIZED
  FORBIDDEN
  NOT_FOUND
  VALIDATION_ERROR
  CONFLICT
  RATE_LIMITED
  INTERNAL_ERROR
}
```

### Common Error Responses
```json
{
  "errors": [
    {
      "message": "Note not found",
      "code": "NOT_FOUND",
      "path": ["note"]
    }
  ]
}
```

## Rate Limiting

- **Read Operations**: 1000 requests/hour
- **Write Operations**: 500 requests/hour  
- **File Uploads**: 50 uploads/hour
- **Bulk Operations**: 20 requests/hour

## Pagination

### Cursor-based Pagination
```graphql
type NotesConnection {
  edges: [NoteEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type NoteEdge {
  node: Note!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

### Usage Example
```graphql
query GetNotesPaginated($after: String, $first: Int = 20) {
  notesConnection(after: $after, first: $first) {
    edges {
      node {
        id
        title
        createdAt
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

## File Upload

### Single File Upload
```javascript
const mutation = `
  mutation UploadFile($noteId: ID!, $file: Upload!) {
    uploadFile(noteId: $noteId, file: $file) {
      id
      fileName
      fileUrl
    }
  }
`;

// Using Apollo Client
const [uploadFile] = useMutation(mutation);

const handleFileUpload = (file) => {
  uploadFile({
    variables: {
      noteId: "note-123",
      file: file
    }
  });
};
```

### File Constraints
- **Max file size**: 10MB
- **Allowed types**: PDF, images (PNG, JPG, GIF), documents (DOC, DOCX)
- **Storage**: Firebase Cloud Storage with CDN

## Testing

### GraphQL Playground
Available at: `{BASE_URL}/graphql`

### Example Queries for Testing
```javascript
// Test authentication
headers: {
  "Authorization": "Bearer YOUR_FIREBASE_TOKEN"
}

// Test query
{
  me {
    id
    name
    email
  }
}
```