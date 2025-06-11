# Database Schema - NoteFlow

## Tổng quan

NoteFlow sử dụng PostgreSQL cho server database và SQLite cho local storage trên mobile devices. Thiết kế database được tối ưu cho performance và hỗ trợ offline synchronization.

> **Lưu ý**: Để hiểu chi tiết về cách thức hoạt động của hệ thống sync và các bảng liên quan, vui lòng tham khảo [Offline/Online Sync Documentation](./offline-online-sync.md).

## Server Database (PostgreSQL)

### Schema Overview

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';
```

### Tables

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    last_active TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_firebase_uid ON users (firebase_uid);
```

#### groups
```sql
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar_url TEXT,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    max_members INTEGER DEFAULT 5, -- Free tier limit
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_groups_creator_id ON groups (creator_id);
CREATE INDEX idx_groups_name ON groups (name);
```

#### group_members
```sql
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(group_id, user_id)
);

-- Indexes
CREATE INDEX idx_group_members_group_id ON group_members (group_id);
CREATE INDEX idx_group_members_user_id ON group_members (user_id);
CREATE INDEX idx_group_members_role ON group_members (role);
```

#### group_invitations
```sql
CREATE TABLE group_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_group_invitations_group_id ON group_invitations (group_id);
CREATE INDEX idx_group_invitations_email ON group_invitations (email);
CREATE INDEX idx_group_invitations_token ON group_invitations (token);
CREATE INDEX idx_group_invitations_status ON group_invitations (status);
CREATE INDEX idx_group_invitations_expires_at ON group_invitations (expires_at);
```

#### user_group_limits
```sql
CREATE TABLE user_group_limits (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    created_groups_count INTEGER DEFAULT 0,
    max_groups_allowed INTEGER DEFAULT 2, -- Free tier limit
    plan_type VARCHAR(20) DEFAULT 'free' CHECK (plan_type IN ('free', 'premium')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_group_limits_plan_type ON user_group_limits (plan_type);
```

#### notes
```sql
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES notes(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('note', 'task', 'issue')),
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')),
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'critical')),
    deadline TIMESTAMP WITH TIME ZONE,
    estimated_time INTEGER, -- in hours
    tags TEXT[] DEFAULT '{}',
    is_pinned BOOLEAN DEFAULT FALSE,
    
    -- Sync metadata for offline/online synchronization
    version INTEGER DEFAULT 1,
    content_hash VARCHAR(64), -- SHA-256 of content for change detection
    last_modified_by UUID REFERENCES users(id),
    conflict_data JSONB, -- Data for conflict resolution
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Check that creator is a member of the group
    CONSTRAINT fk_creator_group_member 
        FOREIGN KEY (group_id, creator_id) 
        REFERENCES group_members(group_id, user_id) DEFERRABLE INITIALLY DEFERRED
);

-- Indexes
CREATE INDEX idx_notes_group_id ON notes (group_id);
CREATE INDEX idx_notes_creator_id ON notes (creator_id);
CREATE INDEX idx_notes_parent_id ON notes (parent_id);
CREATE INDEX idx_notes_type ON notes (type);
CREATE INDEX idx_notes_status ON notes (status);
CREATE INDEX idx_notes_deadline ON notes (deadline);
CREATE INDEX idx_notes_created_at ON notes (created_at DESC);
CREATE INDEX idx_notes_updated_at ON notes (updated_at DESC);
CREATE INDEX idx_notes_tags ON notes USING GIN (tags);

-- Full-text search index
CREATE INDEX idx_notes_search ON notes USING GIN (
    to_tsvector('english', title || ' ' || COALESCE(content, ''))
);
```

#### assignments
```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    assignee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(note_id, assignee_id)
);

-- Indexes
CREATE INDEX idx_assignments_note_id ON assignments (note_id);
CREATE INDEX idx_assignments_assignee_id ON assignments (assignee_id);

-- Function to validate assignments are within the same group
CREATE OR REPLACE FUNCTION validate_assignment_within_group()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if assignee is a member of the same group as the note
    IF NOT EXISTS (
        SELECT 1 FROM notes n
        JOIN group_members gm ON n.group_id = gm.group_id
        WHERE n.id = NEW.note_id AND gm.user_id = NEW.assignee_id
    ) THEN
        RAISE EXCEPTION 'Assignee must be a member of the same group as the note';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_assignment_within_group
    BEFORE INSERT OR UPDATE ON assignments
    FOR EACH ROW
    EXECUTE FUNCTION validate_assignment_within_group();
```

#### comments
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    mentions UUID[] DEFAULT '{}', -- User IDs mentioned in comment
    
    -- Sync metadata for offline/online synchronization
    version INTEGER DEFAULT 1,
    content_hash VARCHAR(64), -- SHA-256 of content for change detection
    last_modified_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_comments_note_id ON comments (note_id);
CREATE INDEX idx_comments_user_id ON comments (user_id);
CREATE INDEX idx_comments_parent_id ON comments (parent_comment_id);
CREATE INDEX idx_comments_created_at ON comments (created_at DESC);
```

#### files
```sql
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_files_note_id ON files (note_id);
CREATE INDEX idx_files_uploaded_by ON files (uploaded_by);
```

#### notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('comment', 'assign', 'deadline', 'mention')),
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}', -- Additional notification data
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_read ON notifications (read);
CREATE INDEX idx_notifications_created_at ON notifications (created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications (user_id, read, created_at DESC);
```

#### sync_log
```sql
CREATE TABLE sync_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('create', 'update', 'delete')),
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sync_log_user_id ON sync_log (user_id);
CREATE INDEX idx_sync_log_record ON sync_log (table_name, record_id);
CREATE INDEX idx_sync_log_created_at ON sync_log (created_at DESC);
```

#### sync_queue
```sql
CREATE TABLE sync_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('create', 'update', 'delete')),
    data JSONB NOT NULL,
    client_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    retry_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    depends_on UUID REFERENCES sync_queue(id), -- For dependency handling
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sync_queue_user_id ON sync_queue (user_id);
CREATE INDEX idx_sync_queue_status ON sync_queue (status);
CREATE INDEX idx_sync_queue_depends_on ON sync_queue (depends_on);
```

#### sync_metadata
```sql
CREATE TABLE sync_metadata (
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    server_version INTEGER NOT NULL DEFAULT 0,
    local_version INTEGER NOT NULL DEFAULT 1,
    last_synced TIMESTAMP WITH TIME ZONE NOT NULL,
    checksum VARCHAR(64), -- For detecting changes
    PRIMARY KEY (table_name, record_id)
);

-- Indexes
CREATE INDEX idx_sync_metadata_last_synced ON sync_metadata (last_synced);
```

#### conflict_resolution
```sql
CREATE TABLE conflict_resolution (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    conflict_type VARCHAR(20) NOT NULL CHECK (conflict_type IN ('content', 'metadata', 'delete')),
    local_version INTEGER NOT NULL,
    server_version INTEGER NOT NULL,
    local_data JSONB NOT NULL,
    server_data JSONB NOT NULL,
    resolution_strategy VARCHAR(20) CHECK (resolution_strategy IN ('local', 'server', 'manual')),
    resolved_data JSONB,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_conflict_resolution_record ON conflict_resolution (table_name, record_id);
CREATE INDEX idx_conflict_resolution_status ON conflict_resolution (status);
CREATE INDEX idx_conflict_resolution_created_at ON conflict_resolution (created_at DESC);
```

#### offline_sessions
```sql
CREATE TABLE offline_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    actions_count INTEGER DEFAULT 0,
    notes_created INTEGER DEFAULT 0,
    notes_modified INTEGER DEFAULT 0,
    sync_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_offline_sessions_user_id ON offline_sessions (user_id);
CREATE INDEX idx_offline_sessions_device_id ON offline_sessions (device_id);
CREATE INDEX idx_offline_sessions_start_time ON offline_sessions (start_time DESC);
```

### Triggers

#### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Auto-increment version
```sql
CREATE OR REPLACE FUNCTION increment_version()
RETURNS TRIGGER AS $$
BEGIN
    NEW.version = COALESCE(OLD.version, 0) + 1;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_notes_version BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION increment_version();

CREATE TRIGGER increment_comments_version BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION increment_version();
```

#### Sync logging
```sql
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO sync_log (user_id, table_name, record_id, action, old_data)
        VALUES (OLD.creator_id, TG_TABLE_NAME, OLD.id, 'delete', to_jsonb(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO sync_log (user_id, table_name, record_id, action, old_data, new_data)
        VALUES (NEW.creator_id, TG_TABLE_NAME, NEW.id, 'update', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO sync_log (user_id, table_name, record_id, action, new_data)
        VALUES (NEW.creator_id, TG_TABLE_NAME, NEW.id, 'create', to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER log_notes_changes AFTER INSERT OR UPDATE OR DELETE ON notes
    FOR EACH ROW EXECUTE FUNCTION log_changes();

CREATE TRIGGER log_comments_changes AFTER INSERT OR UPDATE OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION log_changes();
```

#### Content hash calculation for sync
```sql
CREATE OR REPLACE FUNCTION calculate_content_hash()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate SHA-256 hash of content for change detection
    IF TG_TABLE_NAME = 'notes' THEN
        NEW.content_hash = encode(digest(COALESCE(NEW.title, '') || '|' || COALESCE(NEW.content, ''), 'sha256'), 'hex');
        NEW.last_modified_by = NEW.creator_id;
    ELSIF TG_TABLE_NAME = 'comments' THEN
        NEW.content_hash = encode(digest(COALESCE(NEW.content, ''), 'sha256'), 'hex');
        NEW.last_modified_by = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_notes_content_hash BEFORE INSERT OR UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION calculate_content_hash();

CREATE TRIGGER calculate_comments_content_hash BEFORE INSERT OR UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION calculate_content_hash();
```

### Views

#### User assignments summary
```sql
CREATE VIEW user_assignments AS
SELECT 
    u.id AS user_id,
    u.name,
    u.email,
    g.id AS group_id,
    g.name AS group_name,
    COUNT(a.id) AS total_assignments,
    COUNT(CASE WHEN n.status = 'open' THEN 1 END) AS open_assignments,
    COUNT(CASE WHEN n.status = 'in_progress' THEN 1 END) AS in_progress_assignments,
    COUNT(CASE WHEN n.status = 'done' THEN 1 END) AS completed_assignments
FROM users u
JOIN group_members gm ON u.id = gm.user_id
JOIN groups g ON gm.group_id = g.id
LEFT JOIN assignments a ON u.id = a.assignee_id
LEFT JOIN notes n ON a.note_id = n.id AND n.group_id = g.id
GROUP BY u.id, u.name, u.email, g.id, g.name;
```

#### Group activity summary
```sql
CREATE VIEW group_activity AS
SELECT 
    g.id AS group_id,
    g.name AS group_name,
    g.creator_id,
    u_creator.name AS creator_name,
    COUNT(DISTINCT gm.user_id) AS member_count,
    COUNT(DISTINCT n.id) AS total_notes,
    COUNT(DISTINCT CASE WHEN n.type = 'task' THEN n.id END) AS total_tasks,
    COUNT(DISTINCT CASE WHEN n.type = 'issue' THEN n.id END) AS total_issues,
    COUNT(DISTINCT c.id) AS total_comments,
    MAX(n.created_at) AS last_activity,
    g.max_members,
    g.created_at AS group_created_at
FROM groups g
JOIN users u_creator ON g.creator_id = u_creator.id
LEFT JOIN group_members gm ON g.id = gm.group_id
LEFT JOIN notes n ON g.id = n.group_id
LEFT JOIN comments c ON n.id = c.note_id
GROUP BY g.id, g.name, g.creator_id, u_creator.name, g.max_members, g.created_at;
```

## Local Database (SQLite)

### Schema for Mobile Apps

```sql
-- Users (cached)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Groups (cached)
CREATE TABLE groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    avatar_url TEXT,
    creator_id TEXT NOT NULL,
    max_members INTEGER DEFAULT 5,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Group members (cached)
CREATE TABLE group_members (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    joined_at INTEGER NOT NULL,
    FOREIGN KEY(group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(group_id, user_id)
);

-- Group invitations (cached)
CREATE TABLE group_invitations (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL,
    invited_by TEXT NOT NULL,
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- User group limits (cached)
CREATE TABLE user_group_limits (
    user_id TEXT PRIMARY KEY,
    created_groups_count INTEGER DEFAULT 0,
    max_groups_allowed INTEGER DEFAULT 2,
    plan_type TEXT DEFAULT 'free',
    updated_at INTEGER NOT NULL
);

-- Notes (full data)
CREATE TABLE notes (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    parent_id TEXT,
    title TEXT NOT NULL,
    content TEXT,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    priority TEXT,
    severity TEXT,
    deadline INTEGER,
    estimated_time INTEGER,
    tags TEXT, -- JSON array as string
    is_pinned INTEGER DEFAULT 0,
    version INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    local_only INTEGER DEFAULT 0, -- 1 if not synced to server
    conflict_data TEXT -- JSON data for conflict resolution
);

-- Assignments
CREATE TABLE assignments (
    id TEXT PRIMARY KEY,
    note_id TEXT NOT NULL,
    assignee_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE
);

-- Comments
CREATE TABLE comments (
    id TEXT PRIMARY KEY,
    note_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    parent_comment_id TEXT,
    content TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    local_only INTEGER DEFAULT 0,
    FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE
);

-- Files (metadata only, files stored in app sandbox)
CREATE TABLE files (
    id TEXT PRIMARY KEY,
    note_id TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_by TEXT NOT NULL,
    local_path TEXT, -- Local file path if cached
    created_at INTEGER NOT NULL,
    FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE
);

-- Sync queue for offline operations
CREATE TABLE sync_queue (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL, -- 'create', 'update', 'delete'
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    data TEXT NOT NULL, -- JSON payload
    created_at INTEGER NOT NULL,
    retry_count INTEGER DEFAULT 0,
    last_retry INTEGER,
    error_message TEXT
);

-- Local metadata
CREATE TABLE sync_metadata (
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    server_version INTEGER NOT NULL,
    local_version INTEGER NOT NULL,
    last_synced INTEGER NOT NULL,
    PRIMARY KEY (table_name, record_id)
);

-- App settings
CREATE TABLE app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at INTEGER NOT NULL
);
```

### SQLite Indexes
```sql
-- Performance indexes
CREATE INDEX idx_notes_group_id ON notes (group_id);
CREATE INDEX idx_notes_type ON notes (type);
CREATE INDEX idx_notes_status ON notes (status);
CREATE INDEX idx_notes_created_at ON notes (created_at DESC);
CREATE INDEX idx_notes_updated_at ON notes (updated_at DESC);
CREATE INDEX idx_notes_local_only ON notes (local_only);

CREATE INDEX idx_comments_note_id ON comments (note_id);
CREATE INDEX idx_comments_created_at ON comments (created_at DESC);

CREATE INDEX idx_assignments_note_id ON assignments (note_id);
CREATE INDEX idx_assignments_assignee_id ON assignments (assignee_id);

CREATE INDEX idx_group_members_group_id ON group_members (group_id);
CREATE INDEX idx_group_members_user_id ON group_members (user_id);
CREATE INDEX idx_group_members_role ON group_members (role);

CREATE INDEX idx_group_invitations_group_id ON group_invitations (group_id);
CREATE INDEX idx_group_invitations_email ON group_invitations (email);
CREATE INDEX idx_group_invitations_status ON group_invitations (status);

CREATE INDEX idx_sync_queue_action ON sync_queue (action);
CREATE INDEX idx_sync_queue_created_at ON sync_queue (created_at);

-- Full-text search for notes
CREATE VIRTUAL TABLE notes_fts USING fts5(
    title,
    content,
    tags,
    content='notes',
    content_rowid='rowid'
);

-- Triggers to keep FTS in sync
CREATE TRIGGER notes_ai AFTER INSERT ON notes BEGIN
    INSERT INTO notes_fts(rowid, title, content, tags) 
    VALUES (new.rowid, new.title, new.content, new.tags);
END;

CREATE TRIGGER notes_ad AFTER DELETE ON notes BEGIN
    INSERT INTO notes_fts(notes_fts, rowid, title, content, tags) 
    VALUES('delete', old.rowid, old.title, old.content, old.tags);
END;

CREATE TRIGGER notes_au AFTER UPDATE ON notes BEGIN
    INSERT INTO notes_fts(notes_fts, rowid, title, content, tags) 
    VALUES('delete', old.rowid, old.title, old.content, old.tags);
    INSERT INTO notes_fts(rowid, title, content, tags) 
    VALUES (new.rowid, new.title, new.content, new.tags);
END;
```

## Data Migration Scripts

### Initial Setup
```sql
-- Create first user (admin)
INSERT INTO users (id, name, email, firebase_uid)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Admin User',
    'admin@noteflow.app',
    'admin-firebase-uid'
);

-- Initialize user group limits
INSERT INTO user_group_limits (user_id, created_groups_count, max_groups_allowed, plan_type)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    1,
    2,
    'free'
);

-- Create default group
INSERT INTO groups (id, name, description, creator_id, max_members) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Default Group',
    'Default group for testing',
    '00000000-0000-0000-0000-000000000001',
    5
);

-- Add admin as group member
INSERT INTO group_members (id, group_id, user_id, role)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'admin'
);
```

### Sample Data
```sql
-- Sample notes
INSERT INTO notes (id, group_id, creator_id, title, content, type, status) VALUES
('note-1', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Welcome to NoteFlow', 'This is your first note! Welcome to the new group-based system.', 'note', 'open'),
('task-1', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Setup project repository', 'Create GitHub repo and initial structure', 'task', 'in_progress'),
('issue-1', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Login button not working', 'Users report login button is unresponsive on mobile', 'issue', 'open');

-- Sample assignment
INSERT INTO assignments (id, note_id, assignee_id) VALUES
('assign-1', 'task-1', '00000000-0000-0000-0000-000000000001');
```

## Performance Optimization

### Query Optimization
```sql
-- Efficient note listing with pagination
SELECT n.*, u.name as creator_name, u.avatar_url as creator_avatar
FROM notes n
JOIN users u ON n.creator_id = u.id
WHERE n.group_id = $1
  AND ($2::text IS NULL OR n.type = $2)
  AND ($3::text IS NULL OR n.status = $3)
ORDER BY n.created_at DESC
LIMIT $4 OFFSET $5;

-- Search notes with full-text search
SELECT n.*, ts_rank(
    to_tsvector('english', n.title || ' ' || COALESCE(n.content, '')),
    plainto_tsquery('english', $2)
) as rank
FROM notes n
WHERE n.group_id = $1
  AND to_tsvector('english', n.title || ' ' || COALESCE(n.content, '')) 
      @@ plainto_tsquery('english', $2)
ORDER BY rank DESC, n.created_at DESC
LIMIT $3 OFFSET $4;
```

### Connection Pooling
```javascript
// PostgreSQL connection pool config
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  min: 5, // Minimum connections
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Backup & Recovery

### Automated Backups
```bash
#!/bin/bash
# Daily backup script
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://noteflow-backups/
```

### Point-in-time Recovery
```sql
-- Enable WAL archiving
archive_mode = on
archive_command = 'aws s3 cp %p s3://noteflow-wal-archive/%f'
wal_level = replica
```