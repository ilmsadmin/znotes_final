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
  domain: String!
  groupId: ID!
  role: UserRole!
  avatarUrl: String
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
  domain: String!
  members: [User!]!
  createdAt: DateTime!
  updatedAt: DateTime!
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
    domain
    groupId
    role
    avatarUrl
  }
}
```

### Get Notes with Filtering
```graphql
query GetNotes(
  $type: NoteType
  $status: String
  $assignedToMe: Boolean
  $search: String
  $limit: Int = 20
  $offset: Int = 0
) {
  notes(
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

### Get Group Members
```graphql
query GetGroupMembers {
  myGroup {
    id
    name
    members {
      id
      name
      email
      role
      avatarUrl
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