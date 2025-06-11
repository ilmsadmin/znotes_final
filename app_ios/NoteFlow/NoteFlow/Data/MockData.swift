//
//  MockData.swift
//  NoteFlow
//
//  Created by toan on 11/6/25.
//

import Foundation

class MockData {
    static let shared = MockData()
    
    private init() {}
    
    lazy var sampleNotes: [Note] = [
        Note(
            title: "Team Meeting Notes",
            content: "1. Review last sprint outcomes\n2. Discuss Q4 roadmap priorities\n3. Resource allocation for new features\n4. Timeline review and adjustments\n\nKey topics to cover:\n- Mobile app development progress\n- API authentication implementation\n- Design system finalization\n- User testing feedback integration",
            tags: ["meeting", "team", "roadmap"]
        ),
        Note(
            title: "Project Ideas",
            content: "Some interesting project concepts to explore:\n• AI-powered note organization\n• Real-time collaboration features\n• Voice-to-text integration\n• Smart tag suggestions",
            tags: ["ideas", "brainstorm"]
        ),
        Note(
            title: "Research Notes",
            content: "Key findings from user interviews:\n- Users want better search functionality\n- Mobile experience needs improvement\n- Integration with external tools is important",
            tags: ["research", "user-feedback"]
        ),
        Note(
            title: "Design Guidelines",
            content: "Color palette:\n- Primary: #6366F1\n- Secondary: #8B5CF6\n- Success: #10B981\n- Warning: #F59E0B\n- Error: #EF4444",
            tags: ["design", "guidelines"]
        )
    ]
    
    lazy var sampleTasks: [Task] = [
        Task(
            title: "Complete UI mockups",
            content: "Finalize the user interface designs for the mobile application",
            priority: .high,
            status: .inProgress,
            tags: ["design", "ui"],
            dueDate: Calendar.current.date(byAdding: .day, value: 2, to: Date())
        ),
        Task(
            title: "Setup CI/CD pipeline",
            content: "Configure automated testing and deployment",
            priority: .medium,
            status: .inProgress,
            tags: ["devops", "automation"]
        ),
        Task(
            title: "Database schema review",
            content: "Review and optimize the current database structure",
            priority: .low,
            status: .done,
            tags: ["database", "optimization"]
        ),
        Task(
            title: "User testing session",
            content: "Conduct usability testing with 10 participants",
            priority: .high,
            status: .todo,
            tags: ["testing", "user-research"],
            dueDate: Calendar.current.date(byAdding: .day, value: 7, to: Date())
        ),
        Task(
            title: "API documentation",
            content: "Update API documentation with latest endpoints",
            priority: .medium,
            status: .todo,
            tags: ["documentation", "api"]
        )
    ]
    
    lazy var sampleIssues: [Note] = [
        Note(
            title: "Login page not responsive",
            content: "The login form doesn't adapt properly to different screen sizes on mobile devices",
            tags: ["bug", "mobile", "ui"],
            type: .issue
        ),
        Note(
            title: "Search function slow",
            content: "Search queries taking longer than 3 seconds to return results",
            tags: ["performance", "search"],
            type: .issue
        ),
        Note(
            title: "Data sync issues",
            content: "Users reporting that changes made on mobile aren't syncing to web version",
            tags: ["sync", "data", "critical"],
            type: .issue
        )
    ]
    
    lazy var sampleComments: [Comment] = [
        Comment(
            noteId: sampleNotes[0].id,
            userId: UUID(),
            content: "Great meeting notes! I especially appreciate the detailed breakdown of Q4 priorities."
        ),
        Comment(
            noteId: sampleNotes[0].id,
            userId: UUID(),
            content: "Can we add more details about the timeline for mobile app development?"
        ),
        Comment(
            noteId: sampleNotes[1].id,
            userId: UUID(),
            content: "The AI-powered note organization idea sounds promising. Have we looked into existing solutions?"
        )
    ]
}
