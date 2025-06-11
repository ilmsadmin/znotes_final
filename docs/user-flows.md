# User Flows - NoteFlow

## Tổng quan

Tài liệu này mô tả chi tiết các user flows chính trong ứng dụng NoteFlow, từ onboarding đến các tính năng nâng cao. Mỗi flow được thiết kế để tối ưu trải nghiệm người dùng và đảm bảo hiệu quả công việc.

## Flow 1: User Onboarding & First Experience

### 1.1 Registration Flow

```mermaid
flowchart TD
    A[User visits app] --> B[Choose registration method]
    B --> C[Email/Password]
    B --> D[Google Sign-in]
    B --> E[Apple Sign-in]
    
    C --> F[Enter email & password]
    F --> G[Email validation]
    G --> H[Email confirmed?]
    H -->|No| I[Resend confirmation]
    H -->|Yes| J[Create profile]
    
    D --> K[Google OAuth]
    E --> L[Apple ID OAuth]
    K --> J
    L --> J
    
    J --> M[Group setup options]
    M --> N[Create new group]
    M --> O[Join via invitation]
    M --> P[Continue individual]
    
    N --> Q[Check group creation limit]
    Q -->|At limit| R[Show upgrade options]
    Q -->|Under limit| S[Create group form]
    S --> T[Set as group admin]
    
    O --> U[Validate invitation]
    U -->|Valid| V[Join as member]
    U -->|Invalid| W[Show error]
    
    T --> X[Welcome tutorial]
    V --> X
    P --> X
    X --> Y[First note prompt]
```

#### Detailed Steps

**Step 1: Landing Screen**
- Hero image showcasing app features
- "Get Started" CTA button
- "Already have an account? Sign in" link
- Brief feature highlights

**Step 2: Registration Method Selection**
```typescript
interface RegistrationOptions {
  email: boolean;
  google: boolean;
  apple: boolean; // iOS only
  microsoft: boolean; // Enterprise later
}
```

**Step 3: Email Registration**
- Email validation (format + domain check)
- Password requirements (8+ chars, special chars)
- Terms of Service & Privacy Policy agreement
- reCAPTCHA verification

**Step 4: Email Verification**
- Send verification email immediately
- Clear instructions on what to do next
- Resend option (with rate limiting)
- Alternative contact options

**Step 5: Profile Creation**
```typescript
interface UserProfile {
  name: string;
  email: string; // Pre-filled
  avatar?: File;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}
```

**Step 6: Group Setup Options**
- Show 3 options:
  - Create new group (if under limit of 2 groups)
  - Join existing group via invitation link
  - Continue without group (individual mode)
- If creating group: Show group creation form
- If joining: Show invitation validation and group info
- Track group creation limits per user

**Step 7: Welcome Tutorial**
- Interactive walkthrough of key features
- Sample data pre-populated
- Skip option for experienced users
- Progress indicators

### 1.2 Login Flow

```mermaid
flowchart TD
    A[Login screen] --> B[Enter credentials]
    B --> C[Validate credentials]
    C --> D[Credentials valid?]
    D -->|No| E[Show error message]
    D -->|Yes| F[2FA enabled?]
    
    E --> G[Forgot password?]
    G -->|Yes| H[Password reset flow]
    G -->|No| B
    
    F -->|No| I[Generate JWT tokens]
    F -->|Yes| J[Request 2FA code]
    J --> K[Enter 2FA code]
    K --> L[Validate 2FA]
    L -->|Valid| I
    L -->|Invalid| M[Show 2FA error]
    M --> J
    
    I --> N[Store tokens securely]
    N --> O[Sync offline data]
    O --> P[Navigate to dashboard]
```

#### Error Handling
- Invalid credentials: Clear, helpful error messages
- Account locked: Show unlock instructions
- Network issues: Retry mechanism with exponential backoff
- Offline mode: Allow local authentication with cached credentials

### 1.3 First-time User Experience

**Guided Tour Components:**
1. **Dashboard Overview**: Explain tabs (Notes, Tasks, Issues)
2. **Create First Note**: Interactive tutorial
3. **Team Features**: If part of a group, show collaboration features
4. **Offline Capabilities**: Demonstrate offline mode
5. **Settings Tour**: Key settings and customizations

## Flow 2: Note Management

### 2.1 Create Note Flow

```mermaid
flowchart TD
    A[Tap FAB/Create button] --> B[Select note type]
    B --> C[Note]
    B --> D[Task]
    B --> E[Issue]
    
    C --> F[Basic note form]
    D --> G[Task form with deadline]
    E --> H[Issue form with severity]
    
    F --> I[Enter title]
    G --> I
    H --> I
    
    I --> J[Enter content]
    J --> K[Add tags?]
    K -->|Yes| L[Tag selector]
    K -->|No| M[Add attachments?]
    L --> M
    
    M -->|Yes| N[File picker]
    M -->|No| O[Save note]
    N --> P[Upload files]
    P --> O
    
    O --> Q[Validation successful?]
    Q -->|No| R[Show validation errors]
    Q -->|Yes| S[Save to local DB]
    R --> I
    
    S --> T[Online?]
    T -->|Yes| U[Sync to server]
    T -->|No| V[Queue for sync]
    U --> W[Show success message]
    V --> W
    W --> X[Return to list]
```

#### Form Validation Rules
```typescript
interface NoteValidation {
  title: {
    required: true;
    maxLength: 500;
    noHtml: true;
  };
  content: {
    maxLength: 50000;
    allowedHtml: ['b', 'i', 'u', 'p', 'br', 'ul', 'ol', 'li'];
  };
  tags: {
    maxCount: 10;
    maxLength: 50;
    alphanumeric: true;
  };
  files: {
    maxSize: 10 * 1024 * 1024; // 10MB
    allowedTypes: ['pdf', 'jpg', 'png', 'gif', 'doc', 'docx'];
    maxCount: 5;
  };
}
```

### 2.2 Edit Note Flow

```mermaid
flowchart TD
    A[Tap on note] --> B[Load note details]
    B --> C[Check permissions]
    C --> D[Can edit?]
    D -->|No| E[Read-only view]
    D -->|Yes| F[Edit mode]
    
    F --> G[Modify content]
    G --> H[Auto-save enabled?]
    H -->|Yes| I[Save draft every 30s]
    H -->|No| J[Manual save only]
    
    I --> K[User finished editing?]
    J --> L[User taps save?]
    K -->|Yes| M[Final save]
    L -->|Yes| M
    
    M --> N[Validate changes]
    N --> O[Valid?]
    O -->|No| P[Show errors]
    O -->|Yes| Q[Conflict check]
    
    Q --> R[Conflicts detected?]
    R -->|Yes| S[Show conflict resolution]
    R -->|No| T[Save successfully]
    
    S --> U[User chooses resolution]
    U --> T
    T --> V[Update UI]
    V --> W[Sync if online]
```

#### Conflict Resolution UI
- Side-by-side comparison view
- Highlight differences
- Options: Keep mine, Use theirs, Merge manually
- Version history access

### 2.3 Delete Note Flow

```mermaid
flowchart TD
    A[Long press or menu] --> B[Show delete option]
    B --> C[User confirms delete?]
    C -->|No| D[Cancel action]
    C -->|Yes| E[Soft delete locally]
    
    E --> F[Show undo toast]
    F --> G[User taps undo?]
    G -->|Yes| H[Restore note]
    G -->|No| I[Wait 10 seconds]
    
    I --> J[Hard delete locally]
    J --> K[Online?]
    K -->|Yes| L[Delete from server]
    K -->|No| M[Queue delete action]
    
    L --> N[Delete successful?]
    N -->|Yes| O[Remove from UI]
    N -->|No| P[Show error, restore locally]
    M --> O
```

## Flow 3: Task Management

### 3.1 Task Creation with Assignment

```mermaid
flowchart TD
    A[Create new task] --> B[Fill basic info]
    B --> C[Set priority & deadline]
    C --> D[Assign to team members?]
    D -->|No| E[Save as personal task]
    D -->|Yes| F[Show team member list]
    
    F --> G[Select assignees]
    G --> H[Multiple assignees?]
    H -->|Yes| I[Select assignment type]
    H -->|No| J[Single assignment]
    
    I --> K[Individual tasks for each]
    I --> L[Collaborative task]
    J --> M[Create assignment]
    K --> M
    L --> M
    
    M --> N[Send notifications]
    N --> O[Save task]
    O --> P[Update all assignee dashboards]
```

#### Assignment Types
```typescript
enum AssignmentType {
  INDIVIDUAL = 'individual', // Separate task for each assignee
  COLLABORATIVE = 'collaborative', // Shared task, multiple assignees
  SEQUENTIAL = 'sequential', // One person at a time
  PARALLEL = 'parallel' // Everyone works simultaneously
}
```

### 3.2 Task Status Update Flow

```mermaid
flowchart TD
    A[User views task] --> B[Current status shown]
    B --> C[User changes status]
    C --> D[Status transition valid?]
    D -->|No| E[Show error message]
    D -->|Yes| F[Update local status]
    
    F --> G[Required fields filled?]
    G -->|No| H[Show required field form]
    G -->|Yes| I[Calculate completion %]
    
    H --> J[User fills fields]
    J --> I
    
    I --> K[Update progress indicators]
    K --> L[Notify assignees/watchers]
    L --> M[Update dependencies]
    M --> N[Sync to server]
```

#### Status Transition Rules
```typescript
interface StatusTransitions {
  'todo': ['in_progress', 'cancelled'];
  'in_progress': ['done', 'blocked', 'todo'];
  'blocked': ['in_progress', 'cancelled'];
  'done': ['in_progress']; // Allow reopening
  'cancelled': ['todo'];
}
```

### 3.3 Kanban Board Interaction

```mermaid
flowchart TD
    A[User views Kanban board] --> B[Load tasks by status]
    B --> C[Render columns]
    C --> D[User drags task]
    D --> E[Drop on valid column?]
    E -->|No| F[Snap back to origin]
    E -->|Yes| G[Validate status change]
    
    G --> H[Change allowed?]
    H -->|No| I[Show error, snap back]
    H -->|Yes| J[Update task status]
    
    J --> K[Optimistic UI update]
    K --> L[Send to server]
    L --> M[Server confirms?]
    M -->|Yes| N[Keep UI change]
    M -->|No| O[Revert UI, show error]
```

## Flow 4: Group Management

### 4.1 Group Creation Flow

```mermaid
flowchart TD
    A[User clicks 'Create Group'] --> B[Check group creation limit]
    B --> C[Under limit?]
    C -->|No| D[Show upgrade message]
    C -->|Yes| E[Show group creation form]
    
    E --> F[Enter group details]
    F --> G[Group name]
    F --> H[Description (optional)]
    F --> I[Avatar (optional)]
    
    G --> J[Validate group name]
    J --> K[Name available?]
    K -->|No| L[Show error, suggest alternatives]
    K -->|Yes| M[Create group]
    
    M --> N[Set user as admin]
    N --> O[Update group creation count]
    O --> P[Show success message]
    P --> Q[Navigate to group dashboard]
```

#### Group Creation Validation
```typescript
interface GroupValidation {
  name: {
    required: true;
    minLength: 3;
    maxLength: 50;
    noSpecialChars: true;
  };
  description: {
    maxLength: 500;
  };
  memberLimit: {
    free: 5;
    premium: 50;
  };
}
```

### 4.2 Group Invitation Flow

```mermaid
flowchart TD
    A[Admin clicks 'Invite Members'] --> B[Check member limit]
    B --> C[Under limit?]
    C -->|No| D[Show upgrade message]
    C -->|Yes| E[Show invitation form]
    
    E --> F[Enter email addresses]
    F --> G[Validate emails]
    G --> H[Valid emails?]
    H -->|No| I[Show validation errors]
    H -->|Yes| J[Generate invitation tokens]
    
    J --> K[Send invitation emails]
    K --> L[Save invitations to DB]
    L --> M[Show success message]
    M --> N[Update pending invitations list]
    
    K --> O[Email delivery failed?]
    O -->|Yes| P[Mark as failed, allow resend]
    O -->|No| Q[Mark as sent]
```

#### Invitation Email Template
```typescript
interface InvitationEmail {
  to: string;
  subject: string;
  templateData: {
    groupName: string;
    inviterName: string;
    invitationLink: string;
    expiresAt: Date;
  };
}
```

### 4.3 Group Member Management Flow

```mermaid
flowchart TD
    A[Admin views group members] --> B[Show member list]
    B --> C[Admin actions available]
    C --> D[Remove member]
    C --> E[Change role]
    C --> F[Resend invitation]
    
    D --> G[Confirm removal]
    G --> H[User confirms?]
    H -->|Yes| I[Remove from group]
    H -->|No| J[Cancel action]
    
    I --> K[Update member count]
    K --> L[Notify removed user]
    L --> M[Refresh member list]
    
    E --> N[Select new role]
    N --> O[Update member role]
    O --> P[Notify user of role change]
    
    F --> Q[Generate new invitation]
    Q --> R[Send invitation email]
    R --> S[Update invitation status]
```

### 4.4 Group Settings Management

```mermaid
flowchart TD
    A[Admin opens group settings] --> B[Show settings form]
    B --> C[Group information]
    B --> D[Privacy settings]
    B --> E[Notification settings]
    
    C --> F[Edit name/description]
    F --> G[Validate changes]
    G --> H[Save changes]
    H --> I[Update group info]
    
    D --> J[Member visibility settings]
    J --> K[Who can invite members]
    K --> L[Content sharing rules]
    
    E --> M[Default notification preferences]
    M --> N[Group-wide announcements]
    N --> O[Activity summaries]
```

## Flow 11: Team Collaboration (Renamed from Flow 4)

### 5.1 Commenting Flow

```mermaid
flowchart TD
    A[User opens note/task] --> B[Scroll to comments section]
    B --> C[Click 'Add Comment']
    C --> D[Comment composer opens]
    D --> E[User types comment]
    
    E --> F[@mention detected?]
    F -->|Yes| G[Show mention suggestions]
    F -->|No| H[Continue typing]
    G --> I[User selects from suggestions]
    I --> H
    
    H --> J[User submits comment]
    J --> K[Validate content]
    K --> L[Valid?]
    L -->|No| M[Show validation errors]
    L -->|Yes| N[Save comment locally]
    
    N --> O[Send notifications to mentions]
    O --> P[Update UI immediately]
    P --> Q[Sync to server]
    Q --> R[Broadcast to other users]
```

#### Mention System
```typescript
interface MentionSuggestion {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member';
  lastActive: Date;
}

// Mention parsing
const mentionRegex = /@(\w+)/g;
const parseMentions = (text: string): string[] => {
  const matches = text.match(mentionRegex);
  return matches?.map(match => match.substring(1)) || [];
};
```

### 5.2 Real-time Collaboration

```mermaid
flowchart TD
    A[User opens shared note] --> B[Establish WebSocket connection]
    B --> C[Subscribe to note updates]
    C --> D[Show online users]
    D --> E[User starts editing]
    
    E --> F[Send typing indicator]
    F --> G[Broadcast to other users]
    G --> H[Show typing indicators]
    H --> I[User makes changes]
    
    I --> J[Debounce changes (500ms)]
    J --> K[Send operational transform]
    K --> L[Apply to other clients]
    L --> M[Resolve conflicts]
    M --> N[Update all UIs]
```

#### Operational Transform Example
```typescript
interface Operation {
  type: 'insert' | 'delete' | 'retain';
  position: number;
  content?: string;
  length?: number;
  author: string;
  timestamp: number;
}

class OperationalTransform {
  static transform(op1: Operation, op2: Operation): [Operation, Operation] {
    // Implement transformation logic based on operation types
    // This ensures concurrent edits don't conflict
  }
  
  static apply(document: string, operation: Operation): string {
    switch (operation.type) {
      case 'insert':
        return document.slice(0, operation.position) + 
               operation.content + 
               document.slice(operation.position);
      case 'delete':
        return document.slice(0, operation.position) + 
               document.slice(operation.position + operation.length!);
      default:
        return document;
    }
  }
}
```

### 5.3 File Sharing Flow

```mermaid
flowchart TD
    A[User clicks attach file] --> B[File picker opens]
    B --> C[User selects file(s)]
    C --> D[Validate file size & type]
    D --> E[Validation passed?]
    E -->|No| F[Show error message]
    E -->|Yes| G[Show upload progress]
    
    G --> H[Start upload to server]
    H --> I[Upload chunks (for large files)]
    I --> J[All chunks uploaded?]
    J -->|No| K[Continue upload]
    J -->|Yes| L[Server processing]
    
    K --> I
    L --> M[Generate thumbnails/previews]
    M --> N[Scan for viruses]
    N --> O[All checks passed?]
    O -->|No| P[Delete file, notify user]
    O -->|Yes| Q[File available for download]
    
    Q --> R[Update UI with file link]
    R --> S[Notify team members]
```

#### File Upload Security
```typescript
interface FileValidation {
  maxSize: number; // 10MB
  allowedTypes: string[];
  scanForViruses: boolean;
  generateThumbnails: boolean;
}

const validateFile = (file: File): ValidationResult => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large' };
  }
  
  // Check file type
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { valid: false, error: 'File type not allowed' };
  }
  
  // Additional MIME type validation
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file format' };
  }
  
  return { valid: true };
};
```

## Flow 11: Offline/Online Synchronization

### 5.1 Going Offline Flow

```mermaid
flowchart TD
    A[Network connection lost] --> B[Detect offline state]
    B --> C[Update UI indicators]
    C --> D[Switch to offline mode]
    D --> E[Queue all actions]
    E --> F[Show offline notice]
    
    F --> G[User continues working]
    G --> H[User makes changes]
    H --> I[Save to local database]
    I --> J[Add to sync queue]
    J --> K[Show 'will sync when online']
```

### 5.2 Coming Online Flow

```mermaid
flowchart TD
    A[Network connection restored] --> B[Detect online state]
    B --> C[Update UI indicators]
    C --> D[Start sync process]
    D --> E[Get queued actions]
    
    E --> F[Process queue in order]
    F --> G[Send action to server]
    G --> H[Server response OK?]
    H -->|Yes| I[Remove from queue]
    H -->|No| J[Conflict detected?]
    
    J -->|Yes| K[Start conflict resolution]
    J -->|No| L[Retry with exponential backoff]
    
    I --> M[More actions in queue?]
    M -->|Yes| F
    M -->|No| N[Sync complete]
    
    K --> O[Show conflict resolution UI]
    O --> P[User resolves conflict]
    P --> I
    
    L --> Q[Max retries reached?]
    Q -->|Yes| R[Mark as failed, notify user]
    Q -->|No| G
```

### 5.3 Conflict Resolution Flow

```mermaid
flowchart TD
    A[Conflict detected] --> B[Load local version]
    B --> C[Load server version]
    C --> D[Show comparison UI]
    D --> E[Highlight differences]
    
    E --> F[User chooses resolution]
    F --> G[Keep local version]
    F --> H[Use server version]
    F --> I[Merge manually]
    
    G --> J[Overwrite server with local]
    H --> K[Update local with server]
    I --> L[Show merge editor]
    
    L --> M[User edits merged version]
    M --> N[User saves merged version]
    N --> J
    
    J --> O[Update both local and server]
    K --> O
    O --> P[Mark conflict as resolved]
```

#### Conflict Resolution UI Components
```typescript
interface ConflictResolution {
  conflictType: 'content' | 'metadata' | 'delete';
  localVersion: any;
  serverVersion: any;
  baseVersion?: any; // For three-way merge
  resolution?: 'local' | 'server' | 'manual';
  mergedContent?: any;
}

const ConflictResolver: React.FC<{
  conflict: ConflictResolution;
  onResolve: (resolution: ConflictResolution) => void;
}> = ({ conflict, onResolve }) => {
  // Render side-by-side comparison
  // Provide resolution options
  // Handle manual merge editor
};
```

## Flow 11: Search & Discovery

### 6.1 Search Flow

```mermaid
flowchart TD
    A[User enters search query] --> B[Query length > 2 chars?]
    B -->|No| C[Show recent searches]
    B -->|Yes| D[Debounce input (300ms)]
    
    D --> E[Parse search query]
    E --> F[Extract filters]
    F --> G[Search local database first]
    G --> H[Display local results]
    
    H --> I[Online?]
    I -->|Yes| J[Search server database]
    I -->|No| K[Show 'offline results only']
    
    J --> L[Merge server results]
    L --> M[Remove duplicates]
    M --> N[Sort by relevance]
    N --> O[Display final results]
    
    C --> P[User selects recent search]
    P --> D
```

#### Search Query Parsing
```typescript
interface SearchQuery {
  text: string;
  filters: {
    type?: 'note' | 'task' | 'issue';
    status?: string;
    assignee?: string;
    dateRange?: [Date, Date];
    tags?: string[];
  };
  sortBy?: 'relevance' | 'date' | 'title';
  limit: number;
}

const parseSearchQuery = (input: string): SearchQuery => {
  const filters: any = {};
  let text = input;
  
  // Extract type filter: type:task
  const typeMatch = input.match(/type:(\w+)/);
  if (typeMatch) {
    filters.type = typeMatch[1];
    text = text.replace(typeMatch[0], '').trim();
  }
  
  // Extract assignee filter: assignee:john
  const assigneeMatch = input.match(/assignee:(\w+)/);
  if (assigneeMatch) {
    filters.assignee = assigneeMatch[1];
    text = text.replace(assigneeMatch[0], '').trim();
  }
  
  // Extract tags: #urgent #bug
  const tagMatches = input.match(/#(\w+)/g);
  if (tagMatches) {
    filters.tags = tagMatches.map(tag => tag.substring(1));
    text = text.replace(/#\w+/g, '').trim();
  }
  
  return { text, filters, limit: 20 };
};
```

### 6.2 Advanced Filter Flow

```mermaid
flowchart TD
    A[User opens filter panel] --> B[Show filter options]
    B --> C[User selects filters]
    C --> D[Apply filters to search]
    D --> E[Update URL parameters]
    E --> F[Execute filtered search]
    F --> G[Display filtered results]
    
    G --> H[Save filter as preset?]
    H -->|Yes| I[Show save dialog]
    H -->|No| J[Continue browsing]
    
    I --> K[User names filter preset]
    K --> L[Save to user preferences]
    L --> M[Add to quick filters]
```

## Flow 11: Settings & Preferences

### 7.1 Account Settings Flow

```mermaid
flowchart TD
    A[User opens settings] --> B[Show settings categories]
    B --> C[Account & Profile]
    B --> D[Notifications]
    B --> E[Privacy & Security]
    B --> F[Data & Sync]
    
    C --> G[Edit profile information]
    G --> H[Update name/email/avatar]
    H --> I[Validate changes]
    I --> J[Save to server]
    
    D --> K[Configure notification preferences]
    K --> L[Toggle notification types]
    L --> M[Set quiet hours]
    M --> N[Test notification]
    
    E --> O[Password change]
    E --> P[2FA setup]
    E --> Q[Privacy settings]
    
    F --> R[Backup/Export data]
    F --> S[Sync preferences]
    F --> T[Storage management]
```

### 7.2 Two-Factor Authentication Setup

```mermaid
flowchart TD
    A[User enables 2FA] --> B[Choose 2FA method]
    B --> C[Authenticator app]
    B --> D[SMS]
    B --> E[Email]
    
    C --> F[Generate QR code]
    F --> G[User scans QR code]
    G --> H[User enters verification code]
    H --> I[Verify code]
    I --> J[Code valid?]
    J -->|No| K[Show error, retry]
    J -->|Yes| L[Generate backup codes]
    
    D --> M[Enter phone number]
    M --> N[Send SMS code]
    N --> O[User enters SMS code]
    O --> I
    
    E --> P[Email verification code]
    P --> Q[User enters email code]
    Q --> I
    
    L --> R[Display backup codes]
    R --> S[User confirms codes saved]
    S --> T[Enable 2FA]
    T --> U[Show success message]
```

## Flow 11: Error Handling & Recovery

### 8.1 Network Error Flow

```mermaid
flowchart TD
    A[Network request fails] --> B[Determine error type]
    B --> C[Connection timeout]
    B --> D[Server error (5xx)]
    B --> E[Client error (4xx)]
    B --> F[Network unavailable]
    
    C --> G[Retry with exponential backoff]
    D --> G
    E --> H[Show specific error message]
    F --> I[Switch to offline mode]
    
    G --> J[Max retries reached?]
    J -->|No| K[Wait and retry]
    J -->|Yes| L[Show error, suggest actions]
    
    H --> M[User can retry manually]
    I --> N[Queue action for later sync]
```

### 8.2 Data Recovery Flow

```mermaid
flowchart TD
    A[Data corruption detected] --> B[Attempt local recovery]
    B --> C[Check local backup]
    C --> D[Backup available?]
    D -->|Yes| E[Restore from backup]
    D -->|No| F[Sync from server]
    
    E --> G[Verify restored data]
    F --> H[Server has data?]
    H -->|Yes| I[Download from server]
    H -->|No| J[Data permanently lost]
    
    G --> K[Data integrity OK?]
    I --> K
    K -->|Yes| L[Recovery successful]
    K -->|No| M[Partial recovery]
    
    J --> N[Notify user of data loss]
    M --> O[Show what was recovered]
    L --> P[Resume normal operation]
```

## Flow 11: Performance Optimization

### 9.1 Lazy Loading Flow

```mermaid
flowchart TD
    A[User scrolls list] --> B[Near bottom of list?]
    B -->|No| C[Continue normal scrolling]
    B -->|Yes| D[Load more items needed?]
    D -->|No| E[Show 'no more items']
    D -->|Yes| F[Start loading more]
    
    F --> G[Show loading indicator]
    G --> H[Fetch next page]
    H --> I[Data received?]
    I -->|Yes| J[Append to existing list]
    I -->|No| K[Show error, retry option]
    
    J --> L[Update UI smoothly]
    L --> M[Continue monitoring scroll]
    K --> N[User retries?]
    N -->|Yes| F
    N -->|No| O[Stop loading]
```

### 9.2 Cache Management Flow

```mermaid
flowchart TD
    A[App starts] --> B[Check cache size]
    B --> C[Cache size OK?]
    C -->|Yes| D[Load from cache]
    C -->|No| E[Start cache cleanup]
    
    E --> F[Remove old items]
    F --> G[Remove least used items]
    G --> H[Compress remaining data]
    H --> I[Cache size acceptable?]
    I -->|Yes| D
    I -->|No| J[Clear cache completely]
    
    D --> K[Cache hit?]
    K -->|Yes| L[Use cached data]
    K -->|No| M[Fetch from server]
    
    M --> N[Store in cache]
    N --> L
    J --> M
```

## Flow 11: Accessibility Features

### 10.1 Voice Control Flow

```mermaid
flowchart TD
    A[User activates voice control] --> B[Request microphone permission]
    B --> C[Permission granted?]
    C -->|No| D[Show permission explanation]
    C -->|Yes| E[Start listening]
    
    E --> F[User speaks command]
    F --> G[Convert speech to text]
    G --> H[Parse command]
    H --> I[Command recognized?]
    I -->|No| J[Ask for clarification]
    I -->|Yes| K[Execute command]
    
    K --> L[Provide voice feedback]
    L --> M[Continue listening?]
    M -->|Yes| E
    M -->|No| N[Stop voice control]
    
    J --> O[Suggest similar commands]
    O --> P[User tries again?]
    P -->|Yes| E
    P -->|No| N
```

### 10.2 Screen Reader Support Flow

```mermaid
flowchart TD
    A[Screen reader detected] --> B[Activate accessibility mode]
    B --> C[Enhance focus indicators]
    C --> D[Add ARIA labels]
    D --> E[Provide context descriptions]
    
    E --> F[User navigates with keyboard]
    F --> G[Announce current element]
    G --> H[Provide action hints]
    H --> I[User performs action]
    I --> J[Announce result]
    J --> K[Update focus appropriately]
```

These user flows provide comprehensive guidance for implementing a user-friendly, accessible, and robust NoteFlow application that handles various scenarios and edge cases effectively.