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