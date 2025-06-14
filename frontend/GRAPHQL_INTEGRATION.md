# NoteFlow Frontend-Backend GraphQL Integration

## 🎉 Setup Complete!

The NoteFlow frontend has been successfully integrated with the GraphQL backend API. This document provides a comprehensive overview of the integration.

## ✅ What's Been Implemented

### 1. Apollo Client Configuration
- **File**: `src/lib/apollo-client.ts`
- **Features**:
  - HTTP link to backend GraphQL endpoint
  - Authentication via Bearer tokens
  - Error handling for network and GraphQL errors
  - Cache management with type policies
  - Automatic token validation and redirect on 401 errors

### 2. GraphQL Operations
- **Auth Operations** (`src/lib/graphql/auth.ts`):
  - `GET_ME` - Get current user with group memberships
  - `UPDATE_PROFILE` - Update user profile
  - `HEALTH_CHECK` - Backend health check
  
- **Notes Operations** (`src/lib/graphql/notes.ts`):
  - `GET_NOTES` - Get all notes for current user's group
  - `GET_NOTES_BY_TYPE` - Filter notes by type
  - `SEARCH_NOTES` - Search notes by content
  - `CREATE_NOTE` - Create new note
  - `UPDATE_NOTE` - Update existing note
  - `DELETE_NOTE` - Delete note

- **Comments Operations** (`src/lib/graphql/comments.ts`):
  - `GET_COMMENTS_BY_NOTE` - Get comments for a note
  - `CREATE_COMMENT` - Add comment to note
  - `UPDATE_COMMENT` - Edit comment
  - `DELETE_COMMENT` - Remove comment

- **Activity Operations** (`src/lib/graphql/activity.ts`):
  - `GET_GROUP_ACTIVITY` - Get group activity feed
  - `GET_MY_ACTIVITY` - Get current user's activity
  - `GET_NOTE_ACTIVITY` - Get activity for specific note

### 3. TypeScript Types
- **File**: `src/types/api.ts`
- **Types**: User, Group, GroupMember, Note, Comment, Activity
- **Enums**: UserRole, NoteType, NoteStatus, ActivityAction

### 4. React Hooks
- **Authentication**: `useAuth`, `useCurrentUser`, `useUpdateProfile`
- **Notes**: `useNotes`, `useCreateNote`, `useUpdateNote`, `useDeleteNote`
- **Comments**: `useCommentsByNote`, `useCreateComment`, `useUpdateComment`, `useDeleteComment`
- **Activity**: `useGroupActivity`, `useMyActivity`, `useNoteActivity`

### 5. UI Components
- **Apollo Provider** (`src/components/providers/ApolloProvider.tsx`)
- **Dashboard Demo** (`src/components/dashboard/GraphQLDemo.tsx`)
- **Authentication Demo** (`src/components/dashboard/AuthDemo.tsx`)
- **Dashboard Stats** (`src/components/dashboard/DashboardStats.tsx`)
- **Notes Demo** (`src/components/dashboard/NotesDemo.tsx`)
- **UI Components**: LoadingSpinner, ErrorMessage

## 🚀 How to Use

### 1. Start the Application

**Backend** (already running in Docker):
```bash
cd backend
docker-compose up
```

**Frontend**:
```bash
cd frontend
npm run dev
```

### 2. Access the Demo

- **Frontend**: http://localhost:3001
- **Dashboard Demo**: http://localhost:3001/dashboard
- **GraphQL Playground**: http://localhost:3000/graphql

### 3. Test the Integration

1. **Login**: Use the demo authentication with test credentials
   - Firebase UID: `test-uid-123`
   - Email: `user@example.com`

2. **View User Info**: See your automatically created user and group

3. **Create Notes**: Test creating different types of notes (note, task, meeting, announcement)

4. **Real-time Updates**: See notes appear immediately after creation

## 🔧 Configuration

### Environment Variables
**File**: `.env.local`
```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3000/graphql
NEXT_PUBLIC_ENV=development
```

### Authentication Format
```
Authorization: Bearer <firebase_uid>:<email>
```

Example:
```
Authorization: Bearer test-uid-123:user@example.com
```

## 📊 Backend Features Tested

### ✅ Working Features
- **Health Check**: Backend status verification
- **User Auto-Creation**: Automatic user and group creation on first login
- **Group Management**: Domain-based group assignment
- **Notes CRUD**: Full create, read, update, delete operations
- **Type Safety**: GraphQL schema validation
- **Error Handling**: Proper error responses and handling

### 🔄 Auto-Generated Features
- **User**: Created automatically with email domain
- **Group**: Auto-created based on email domain (`example.com` → `example.com Group`)
- **Group Membership**: User automatically added as admin of new groups
- **Database Tables**: All Prisma models properly migrated

## 🏗️ Architecture

```
Frontend (Next.js + Apollo Client)
    ↓ GraphQL over HTTP
Backend (NestJS + GraphQL)
    ↓ Prisma ORM
Database (PostgreSQL)
    + Redis (Cache)
```

## 📋 Schema Alignment

The frontend GraphQL operations are now properly aligned with the backend schema:

- **User**: Uses `groupMemberships` array instead of single `group`
- **Group**: Includes `description`, `createdAt`, and proper relationships
- **Notes**: Full schema support with creator, type, status, timestamps
- **Authentication**: Proper token format and validation

## 🧪 Testing Commands

```bash
# Test health check
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { health }"}'

# Test authenticated query
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-uid-123:user@example.com" \
  -d '{"query": "query { me { id name email groupMemberships { role group { name } } } }"}'

# Test create note
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-uid-123:user@example.com" \
  -d '{"query": "mutation { createNote(input: { title: \"Test\", content: \"Content\", type: note }) { id title } }"}'
```

## 🎯 Next Steps

1. **Add Real Authentication**: Integrate Firebase Authentication
2. **Add Real-time Subscriptions**: WebSocket support for live updates
3. **File Upload**: Implement file attachment support
4. **Offline Support**: Add offline-first capabilities with cache
5. **Error Boundaries**: Add React error boundaries for better UX
6. **Testing**: Add comprehensive unit and integration tests
7. **Production Build**: Optimize for production deployment

## 🐛 Known Issues

1. **Development Only**: Current authentication is for development testing only
2. **No File Uploads**: File attachments not yet implemented
3. **No Subscriptions**: Real-time updates require page refresh
4. **Basic Error Handling**: Could be enhanced with retry logic

## 🎉 Success Metrics

- ✅ Frontend successfully connects to GraphQL backend
- ✅ Authentication flow working with auto user/group creation
- ✅ CRUD operations for notes working
- ✅ Type-safe GraphQL operations
- ✅ Error handling and loading states
- ✅ Responsive UI with Tailwind CSS
- ✅ Proper schema alignment between frontend and backend

The integration is now complete and ready for further development!
