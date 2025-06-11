# NoteFlow Backend API

## Authentication

All GraphQL operations (except health checks) require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <firebase_uid>:<email>
```

For development, use the format: `Bearer firebase-uid-123:user@example.com`

## GraphQL Endpoints

### Health Check Queries

```graphql
query {
  health
  databaseHealth
  redisHealth
  cacheHealth
}
```

### User Management

```graphql
# Get current user
query {
  me {
    id
    name
    email
    role
    group {
      id
      name
      domain
    }
  }
}

# Update user profile
mutation {
  updateProfile(input: {
    name: "New Name"
    avatarUrl: "https://example.com/avatar.jpg"
  }) {
    id
    name
    avatarUrl
  }
}

# Get users in current group
query {
  usersInGroup {
    id
    name
    email
    role
  }
}
```

### Group Management

```graphql
# Get current user's group
query {
  myGroup {
    id
    name
    domain
    users {
      id
      name
      email
      role
    }
  }
}

# Get group statistics
query {
  groupStats
}

# Update group settings (admin only)
mutation {
  updateGroupSettings(settings: "{\"theme\": \"dark\"}") {
    id
    name
  }
}
```

### Notes Management

```graphql
# Create a note
mutation {
  createNote(input: {
    title: "My Note"
    content: "Note content"
    type: note
  }) {
    id
    title
    content
    type
    status
    creator {
      name
    }
  }
}

# Get all notes
query {
  notes {
    id
    title
    content
    type
    status
    createdAt
    creator {
      name
    }
  }
}

# Get notes by type
query {
  notesByType(type: "task") {
    id
    title
    status
  }
}

# Search notes
query {
  searchNotes(query: "search term") {
    id
    title
    content
  }
}

# Update note
mutation {
  updateNote(id: "note-id", input: {
    title: "Updated Title"
    status: completed
  }) {
    id
    title
    status
  }
}

# Delete note
mutation {
  deleteNote(id: "note-id")
}
```

### Comments Management

```graphql
# Create comment
mutation {
  createComment(input: {
    noteId: "note-id"
    content: "This is a comment"
  }) {
    id
    content
    createdAt
    author {
      name
    }
  }
}

# Get comments for a note
query {
  commentsByNote(noteId: "note-id") {
    id
    content
    createdAt
    author {
      name
    }
  }
}

# Update comment
mutation {
  updateComment(id: "comment-id", content: "Updated content") {
    id
    content
  }
}

# Delete comment
mutation {
  deleteComment(id: "comment-id")
}
```

### Activity Tracking

```graphql
# Get group activity feed
query {
  groupActivity(limit: 50) {
    id
    action
    details
    createdAt
    user {
      name
    }
    note {
      title
    }
  }
}

# Get current user's activity
query {
  myActivity(limit: 20) {
    id
    action
    details
    createdAt
    note {
      title
    }
  }
}

# Get activity for a specific note
query {
  noteActivity(noteId: "note-id") {
    id
    action
    details
    createdAt
    user {
      name
    }
  }
}
```

## Note Types

- `note` - Regular note
- `task` - Task/todo item
- `meeting` - Meeting notes
- `announcement` - Announcements

## Note Status

- `open` - Open/active
- `in_progress` - In progress
- `completed` - Completed
- `archived` - Archived

## User Roles

- `member` - Regular user
- `admin` - Administrator with elevated permissions

## Activity Actions

The system automatically tracks these activities:
- `note_created` - When a note is created
- `note_updated` - When a note is modified
- `note_deleted` - When a note is deleted
- `comment_created` - When a comment is added
- `user_joined` - When a user joins a group

## Architecture

### Core Features Implemented

- **Authentication**: Token-based authentication with auto user/group creation
- **Authorization**: Role-based access control with group-level isolation
- **Users**: Complete user management with profile updates
- **Groups**: Domain-based group auto-creation with admin controls
- **Notes**: Full CRUD for notes/tasks/meetings with versioning
- **Comments**: Thread-based comment system with permissions
- **Activity Logging**: Comprehensive audit trail of all actions
- **GraphQL**: Type-safe API with automatic schema generation

### Security

- All operations are group-scoped (users can only access their group's data)
- Role-based permissions for admin operations
- Input validation on all mutations
- Proper error handling and authorization checks

### Database Schema

The backend uses Prisma ORM with PostgreSQL, supporting:
- Users with Firebase authentication integration
- Groups with domain-based organization
- Notes with versioning and metadata
- Comments with threaded discussions
- Files for attachments
- Activity logs for audit trails
- Sync logs for offline support

## Development Server

Start the development server:
```bash
npm run start:dev
```

The GraphQL playground will be available at: http://localhost:3000/graphql

## Testing Authentication

For development testing, use this format for the Authorization header:
```
Authorization: Bearer test-uid:test@example.com
```

This will automatically create a user and group for the `example.com` domain.

## Docker Support

The backend includes full Docker support:

```bash
# Start all services (PostgreSQL, Redis, Backend)
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```