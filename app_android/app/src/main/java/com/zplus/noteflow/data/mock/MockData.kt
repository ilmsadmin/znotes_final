package com.zplus.noteflow.data.mock

import com.zplus.noteflow.data.model.*
import java.util.*

object MockData {
    
    private val sampleUser = User(
        id = "user-1",
        name = "John Doe",
        email = "john@example.com",
        role = UserRole.MEMBER,
        avatarUrl = null,
        group = Group(
            id = "group-1",
            name = "Example Team",
            domain = "example.com"
        )
    )
    
    val sampleNotes = listOf(
        Note(
            id = "note-1",
            title = "Team Meeting Notes",
            content = "1. Review last sprint outcomes\n2. Discuss Q4 roadmap priorities\n3. Resource allocation for new features\n4. Timeline review and adjustments\n\nKey topics to cover:\n- Mobile app development progress\n- API authentication implementation\n- Design system finalization\n- User testing feedback integration",
            type = NoteType.NOTE,
            status = NoteStatus.ACTIVE,
            tags = listOf("meeting", "team", "roadmap"),
            createdAt = Date(),
            updatedAt = Date(),
            isPinned = true,
            creator = sampleUser
        ),
        Note(
            id = "note-2", 
            title = "Project Ideas",
            content = "Some interesting project concepts to explore:\n• AI-powered note organization\n• Real-time collaboration features\n• Voice-to-text integration\n• Smart tag suggestions",
            type = NoteType.NOTE,
            status = NoteStatus.ACTIVE,
            tags = listOf("ideas", "brainstorm"),
            createdAt = Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, -1) }.time,
            updatedAt = Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, -1) }.time,
            creator = sampleUser
        ),
        Note(
            id = "note-3",
            title = "Research Notes", 
            content = "Key findings from user interviews:\n- Users want better search functionality\n- Mobile experience needs improvement\n- Integration with external tools is important",
            type = NoteType.NOTE,
            status = NoteStatus.ACTIVE,
            tags = listOf("research", "user-feedback"),
            createdAt = Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, -2) }.time,
            updatedAt = Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, -2) }.time,
            creator = sampleUser
        )
    )
    
    val sampleTasks = listOf(
        Task(
            id = "task-1",
            title = "Complete UI mockups",
            content = "Finalize the user interface designs for the mobile application",
            priority = TaskPriority.HIGH,
            status = TaskStatus.IN_PROGRESS,
            tags = listOf("design", "ui"),
            dueDate = Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, 2) }.time,
            assignee = "John Doe",
            createdAt = Date(),
            updatedAt = Date()
        ),
        Task(
            id = "task-2",
            title = "Setup CI/CD pipeline",
            content = "Configure automated testing and deployment",
            priority = TaskPriority.MEDIUM,
            status = TaskStatus.IN_PROGRESS,
            tags = listOf("devops", "automation"),
            assignee = "Jane Smith",
            createdAt = Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, -1) }.time,
            updatedAt = Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, -1) }.time
        ),
        Task(
            id = "task-3",
            title = "Database schema review",
            content = "Review and optimize the current database structure",
            priority = TaskPriority.LOW,
            status = TaskStatus.DONE,
            tags = listOf("database", "optimization"),
            assignee = "Mike Wilson",
            createdAt = Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, -3) }.time,
            updatedAt = Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, -1) }.time
        ),
        Task(
            id = "task-4",
            title = "User testing session",
            content = "Conduct usability testing with 10 participants",
            priority = TaskPriority.HIGH,
            status = TaskStatus.TODO,
            tags = listOf("testing", "ux"),
            dueDate = Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, 5) }.time,
            assignee = "Sarah Johnson",
            createdAt = Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, -2) }.time,
            updatedAt = Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, -2) }.time
        )
    )
    
    val sampleIssues = listOf(
        Issue(
            id = "issue-1",
            title = "Login button not responding",
            description = "Users report that the login button becomes unresponsive after multiple attempts",
            type = IssueType.BUG,
            severity = IssueSeverity.HIGH,
            status = IssueStatus.OPEN,
            assignee = "John Doe",
            reporter = "Support Team",
            tags = listOf("ui", "authentication", "critical"),
            createdAt = Date(),
            updatedAt = Date()
        ),
        Issue(
            id = "issue-2",
            title = "Add dark mode support",
            description = "Implement dark mode theme throughout the application",
            type = IssueType.FEATURE,
            severity = IssueSeverity.MEDIUM,
            status = IssueStatus.IN_PROGRESS,
            assignee = "Jane Smith",
            reporter = "Product Team",
            tags = listOf("ui", "theme", "enhancement"),
            createdAt = Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, -1) }.time,
            updatedAt = Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, -1) }.time
        ),
        Issue(
            id = "issue-3",
            title = "Data sync issues",
            description = "Users reporting that changes made on mobile aren't syncing to web version",
            type = IssueType.BUG,
            severity = IssueSeverity.CRITICAL,
            status = IssueStatus.OPEN,
            assignee = null,
            reporter = "Customer Support",
            tags = listOf("sync", "data", "critical"),
            createdAt = Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, -2) }.time,
            updatedAt = Calendar.getInstance().apply { add(Calendar.DAY_OF_MONTH, -2) }.time
        )
    )
    
    val sampleComments = listOf(
        Comment(
            id = "comment-1",
            noteId = "note-1",
            content = "Great idea! This could really help with our quarterly planning.",
            author = User(
                id = "user-2",
                name = "Alice Johnson",
                email = "alice@example.com",
                role = UserRole.MEMBER
            ),
            createdAt = Calendar.getInstance().apply { add(Calendar.HOUR, -2) }.time,
            updatedAt = Calendar.getInstance().apply { add(Calendar.HOUR, -2) }.time
        ),
        Comment(
            id = "comment-2",
            noteId = "note-1",
            content = "I'll add some additional points to consider.",
            author = User(
                id = "user-3",
                name = "Bob Smith",
                email = "bob@example.com",
                role = UserRole.MEMBER
            ),
            createdAt = Calendar.getInstance().apply { add(Calendar.HOUR, -1) }.time,
            updatedAt = Calendar.getInstance().apply { add(Calendar.HOUR, -1) }.time
        ),
        Comment(
            id = "comment-3",
            noteId = "note-2",
            content = "The architecture looks solid. Let's proceed with this approach.",
            author = User(
                id = "user-4",
                name = "Charlie Davis", 
                email = "charlie@example.com",
                role = UserRole.ADMIN
            ),
            createdAt = Calendar.getInstance().apply { add(Calendar.MINUTE, -30) }.time,
            updatedAt = Calendar.getInstance().apply { add(Calendar.MINUTE, -30) }.time
        )
    )
}