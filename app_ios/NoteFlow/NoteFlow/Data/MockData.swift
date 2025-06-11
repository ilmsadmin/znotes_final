//
//  MockData.swift
//  NoteFlow
//
//  Created by toan on 11/6/25.
//

import Foundation
import SwiftUI

// MARK: - Mock Data Structures

struct MockNote: Codable {
    let id: UUID
    let title: String
    let content: String
    let tags: [String]
    let createdAt: Date
    let type: MockNoteType
    let isPinned: Bool
    
    init(id: UUID = UUID(), title: String, content: String, tags: [String] = [], type: MockNoteType = .note, isPinned: Bool = false) {
        self.id = id
        self.title = title
        self.content = content
        self.tags = tags
        self.createdAt = Date()
        self.type = type
        self.isPinned = isPinned
    }
}

enum MockNoteType: String, CaseIterable, Codable {
    case note = "note"
    case issue = "issue"
    
    var displayName: String {
        switch self {
        case .note: return "Notes"
        case .issue: return "Issues"
        }
    }
}

struct MockComment: Codable {
    let id: UUID
    let noteId: UUID
    let content: String
    let author: String
    let createdAt: Date
    
    init(id: UUID = UUID(), noteId: UUID, content: String, author: String) {
        self.id = id
        self.noteId = noteId
        self.content = content
        self.author = author
        self.createdAt = Date()
    }
}

struct MockTask: Codable, Transferable {
    let id: UUID
    let title: String
    let content: String
    let priority: MockPriority
    let status: MockTaskStatus
    let tags: [String]
    let dueDate: Date?
    let assignee: String
    
    init(id: UUID = UUID(), title: String, content: String, priority: MockPriority = .medium, status: MockTaskStatus = .todo, tags: [String] = [], dueDate: Date? = nil, assignee: String = "") {
        self.id = id
        self.title = title
        self.content = content
        self.priority = priority
        self.status = status
        self.tags = tags
        self.dueDate = dueDate
        self.assignee = assignee
    }
    
    static var transferRepresentation: some TransferRepresentation {
        CodableRepresentation(contentType: .data)
    }
}

enum MockPriority: String, CaseIterable, Codable {
    case low = "low"
    case medium = "medium"
    case high = "high"
    
    var title: String {
        switch self {
        case .low: return "Low"
        case .medium: return "Medium"
        case .high: return "High"
        }
    }
    
    var color: Color {
        switch self {
        case .low: return .green
        case .medium: return .orange
        case .high: return .red
        }
    }
}

enum MockTaskStatus: String, CaseIterable, Codable {
    case todo = "todo"
    case inProgress = "in_progress"
    case review = "review"
    case done = "done"
    
    var title: String {
        switch self {
        case .todo: return "To Do"
        case .inProgress: return "In Progress"
        case .review: return "Review"
        case .done: return "Done"
        }
    }
    
    var color: Color {
        switch self {
        case .todo: return .gray
        case .inProgress: return .orange
        case .review: return .blue
        case .done: return .green
        }
    }
}

enum ViewMode: CaseIterable {
    case list
    case grid
    case kanban
    
    var title: String {
        switch self {
        case .list: return "List"
        case .grid: return "Grid"
        case .kanban: return "Kanban"
        }
    }
    
    var iconName: String {
        switch self {
        case .list: return "list.bullet"
        case .grid: return "square.grid.2x2"
        case .kanban: return "rectangle.3.group"
        }
    }
}

struct MockData {
    static let shared = MockData()
    
    let sampleNotes: [MockNote] = [
        MockNote(
            title: "Team Meeting Notes",
            content: "1. Review last sprint outcomes\n2. Discuss Q4 roadmap priorities\n3. Resource allocation for new features\n4. Timeline review and adjustments\n\nKey topics to cover:\n- Mobile app development progress\n- API authentication implementation\n- Design system finalization\n- User testing feedback integration",
            tags: ["meeting", "team", "roadmap"],
            type: .note
        ),
        MockNote(
            title: "Project Ideas",
            content: "Some interesting project concepts to explore:\n• AI-powered note organization\n• Real-time collaboration features\n• Voice-to-text integration\n• Smart tag suggestions",
            tags: ["ideas", "brainstorm"],
            type: .note
        ),
        MockNote(
            title: "Research Notes",
            content: "Key findings from user interviews:\n- Users want better search functionality\n- Mobile experience needs improvement\n- Integration with external tools is important",
            tags: ["research", "user-feedback"],
            type: .note
        ),
        MockNote(
            title: "Design Guidelines",
            content: "Color palette:\n- Primary: #6366F1\n- Secondary: #8B5CF6\n- Success: #10B981\n- Warning: #F59E0B\n- Error: #EF4444",
            tags: ["design", "guidelines"],
            type: .note
        )
    ]
    
    let sampleTasks: [MockTask] = [
        MockTask(
            title: "Complete UI mockups",
            content: "Finalize the user interface designs for the mobile application",
            priority: .high,
            status: .inProgress,
            tags: ["design", "ui"],
            dueDate: Calendar.current.date(byAdding: .day, value: 2, to: Date()),
            assignee: "John Doe"
        ),
        MockTask(
            title: "Setup CI/CD pipeline",
            content: "Configure automated testing and deployment",
            priority: .medium,
            status: .inProgress,
            tags: ["devops", "automation"],
            assignee: "Jane Smith"
        ),
        MockTask(
            title: "Database schema review",
            content: "Review and optimize the current database structure",
            priority: .low,
            status: .done,
            tags: ["database", "optimization"],
            assignee: "Mike Wilson"
        ),
        MockTask(
            title: "User testing session",
            content: "Conduct usability testing with 10 participants",
            priority: .high,
            status: .todo,
            tags: ["testing", "user-research"],
            dueDate: Calendar.current.date(byAdding: .day, value: 7, to: Date()),
            assignee: "Sarah Johnson"
        ),
        MockTask(
            title: "API documentation",
            content: "Update API documentation with latest endpoints",
            priority: .medium,
            status: .todo,
            tags: ["documentation", "api"],
            assignee: "David Brown"
        )
    ]
    
    let sampleIssues: [MockNote] = [
        MockNote(
            title: "Login page not responsive",
            content: "The login form doesn't adapt properly to different screen sizes on mobile devices",
            tags: ["bug", "mobile", "ui"],
            type: .issue
        ),
        MockNote(
            title: "Search function slow",
            content: "Search queries taking longer than 3 seconds to return results",
            tags: ["performance", "search"],
            type: .issue
        ),
        MockNote(
            title: "Data sync issues",
            content: "Users reporting that changes made on mobile aren't syncing to web version",
            tags: ["sync", "data", "critical"],
            type: .issue
        )
    ]
    
    var sampleComments: [MockComment] {
        [
            MockComment(
                noteId: sampleNotes[0].id,
                content: "Great idea! This could really help with our quarterly planning.",
                author: "Alice Johnson"
            ),
            MockComment(
                noteId: sampleNotes[0].id,
            content: "I'll add some additional points to consider.",
            author: "Bob Smith"
        ),
        MockComment(
            noteId: sampleNotes[1].id,
            content: "The architecture looks solid. Let's proceed with this approach.",
            author: "Charlie Davis"
        )
        ]
    }
}
