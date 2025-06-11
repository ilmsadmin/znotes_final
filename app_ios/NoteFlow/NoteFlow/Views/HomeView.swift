//
//  HomeView.swift
//  NoteFlow
//
//  Created by toan on 11/6/25.
//

import SwiftUI

// Simple data structures for mock data
struct SimpleNote {
    let id = UUID()
    let title: String
    let content: String
    let tags: [String]
    let createdAt = Date()
    let type: String
}

struct SimpleTask {
    let id = UUID()
    let title: String
    let content: String
    let priority: String
    let status: String
    let tags: [String]
    let dueDate: Date?
    let createdAt = Date()
}

struct HomeView: View {
    @State private var selectedTab: TabType = .notes
    @State private var selectedView: ViewType = .list
    @State private var searchText = ""
    @State private var showingCreateView = false
    @State private var showingSettings = false
    @State private var showingProfile = false
    @State private var showingNotifications = false
    @State private var showingSearch = false
    
    // Mock data
    private let mockNotes = [
        SimpleNote(title: "Team Meeting Notes", content: "1. Review last sprint outcomes\n2. Discuss Q4 roadmap priorities\n3. Resource allocation for new features", tags: ["meeting", "team", "roadmap"], type: "note"),
        SimpleNote(title: "Project Ideas", content: "Some interesting project concepts to explore:\n• AI-powered note organization\n• Real-time collaboration features", tags: ["ideas", "brainstorm"], type: "note"),
        SimpleNote(title: "Research Notes", content: "Key findings from user interviews:\n- Users want better search functionality\n- Mobile experience needs improvement", tags: ["research", "user-feedback"], type: "note"),
        SimpleNote(title: "Design Guidelines", content: "Color palette:\n- Primary: #6366F1\n- Secondary: #8B5CF6\n- Success: #10B981", tags: ["design", "guidelines"], type: "note")
    ]
    
    private let mockTasks = [
        SimpleTask(title: "Complete UI mockups", content: "Finalize the user interface designs for the mobile application", priority: "high", status: "inProgress", tags: ["design", "ui"], dueDate: Calendar.current.date(byAdding: .day, value: 2, to: Date())),
        SimpleTask(title: "Setup CI/CD pipeline", content: "Configure automated testing and deployment", priority: "medium", status: "inProgress", tags: ["devops", "automation"], dueDate: nil),
        SimpleTask(title: "Database schema review", content: "Review and optimize the current database structure", priority: "low", status: "done", tags: ["database", "optimization"], dueDate: nil),
        SimpleTask(title: "User testing session", content: "Conduct usability testing with 10 participants", priority: "high", status: "todo", tags: ["testing", "user-research"], dueDate: Calendar.current.date(byAdding: .day, value: 7, to: Date())),
        SimpleTask(title: "API documentation", content: "Update API documentation with latest endpoints", priority: "medium", status: "todo", tags: ["documentation", "api"], dueDate: nil)
    ]
    
    private let mockIssues = [
        SimpleNote(title: "Login page not responsive", content: "The login form doesn't adapt properly to different screen sizes on mobile devices", tags: ["bug", "mobile", "ui"], type: "issue"),
        SimpleNote(title: "Search function slow", content: "Search queries taking longer than 3 seconds to return results", tags: ["performance", "search"], type: "issue"),
        SimpleNote(title: "Data sync issues", content: "Users reporting that changes made on mobile aren't syncing to web version", tags: ["sync", "data", "critical"], type: "issue")
    ]
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Header
                headerView
                
                // Search Bar
                searchBarView
                
                // Tab Bar
                tabBarView
                
                // View Controls
                viewControlsView
                
                // Content
                contentView
                
                Spacer()
            }
            .background(Color.primary.colorInvert())
        }
        .overlay(
            // Floating Action Button
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    Button(action: {
                        showingCreateView = true
                    }) {
                        Image(systemName: "plus")
                            .font(.system(size: 24, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(width: 56, height: 56)
                            .background(Color.blue)
                            .clipShape(Circle())
                            .shadow(color: Color.black.opacity(0.15), radius: 8, x: 0, y: 4)
                    }
                    .padding(.trailing, 20)
                    .padding(.bottom, 100)
                }
            }
        )
        .navigationBarHidden(true)
        .sheet(isPresented: $showingCreateView) {
            CreateView()
        }
        .sheet(isPresented: $showingSettings) {
            SettingsView()
        }
        .sheet(isPresented: $showingProfile) {
            SettingsView()
        }
        .sheet(isPresented: $showingNotifications) {
            NotificationCenterView()
        }
        .fullScreenCover(isPresented: $showingSearch) {
            SearchView(query: $searchText)
        }
    }
    
    // MARK: - Header
    private var headerView: some View {
        VStack(spacing: 16) {
            // Header Content
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Good morning!")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(.primary)
                }
                
                Spacer()
                
                HStack(spacing: 8) {
                    Button(action: {
                        showingNotifications = true
                    }) {
                        Image(systemName: "bell")
                            .font(.system(size: 18))
                            .foregroundColor(.secondary)
                            .frame(width: 40, height: 40)
                            .background(Color.gray.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                    
                    Button(action: {
                        showingProfile = true
                    }) {
                        Image(systemName: "person.circle")
                            .font(.system(size: 18))
                            .foregroundColor(.secondary)
                            .frame(width: 40, height: 40)
                            .background(Color.gray.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                }
            }
            .padding(.horizontal, 16)
        }
        .padding(.bottom, 16)
        .background(Color.primary.colorInvert())
    }
    
    // MARK: - Search Bar
    private var searchBarView: some View {
        HStack {
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.secondary)
                    .font(.system(size: 16))
                
                Button(action: {
                    showingSearch = true
                }) {
                    Text("Search notes, tasks, issues...")
                        .font(.system(size: 16))
                        .foregroundColor(.secondary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.gray.opacity(0.1))
            .clipShape(RoundedRectangle(cornerRadius: 20))
        }
        .padding(.horizontal, 16)
        .padding(.bottom, 16)
    }
    
    // MARK: - Tab Bar
    private var tabBarView: some View {
        HStack(spacing: 0) {
            ForEach(TabType.allCases, id: \.self) { tab in
                Button(action: {
                    selectedTab = tab
                    // Reset view mode based on tab
                    if tab == .tasks {
                        selectedView = .kanban
                    } else {
                        selectedView = .list
                    }
                }) {
                    VStack(spacing: 8) {
                        Text(tab.displayName)
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(selectedTab == tab ? .blue : .secondary)
                        
                        Rectangle()
                            .fill(selectedTab == tab ? Color.blue : Color.clear)
                            .frame(height: 2)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                }
            }
        }
        .background(Color.primary.colorInvert())
        .overlay(
            Rectangle()
                .fill(Color.gray.opacity(0.3))
                .frame(height: 0.5),
            alignment: .bottom
        )
    }
    
    // MARK: - View Controls
    private var viewControlsView: some View {
        HStack {
            HStack(spacing: 8) {
                if selectedTab != .tasks {
                    Button(action: { selectedView = .list }) {
                        Image(systemName: "list.bullet")
                            .font(.system(size: 14))
                            .foregroundColor(selectedView == .list ? .white : .secondary)
                            .frame(width: 36, height: 36)
                            .background(selectedView == .list ? Color.blue : Color.gray.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                    }
                    
                    Button(action: { selectedView = .grid }) {
                        Image(systemName: "square.grid.2x2")
                            .font(.system(size: 14))
                            .foregroundColor(selectedView == .grid ? .white : .secondary)
                            .frame(width: 36, height: 36)
                            .background(selectedView == .grid ? Color.blue : Color.gray.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                    }
                } else {
                    Button(action: { selectedView = .kanban }) {
                        Image(systemName: "rectangle.3.group")
                            .font(.system(size: 14))
                            .foregroundColor(selectedView == .kanban ? .white : .secondary)
                            .frame(width: 36, height: 36)
                            .background(selectedView == .kanban ? Color.blue : Color.gray.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                    }
                }
            }
            
            Spacer()
            
            Button(action: {
                showingSettings = true
            }) {
                Image(systemName: "gearshape")
                    .font(.system(size: 16))
                    .foregroundColor(.secondary)
                    .frame(width: 40, height: 40)
                    .background(Color.gray.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 16)
        .background(Color.primary.colorInvert())
    }
    
    // MARK: - Content
    private var contentView: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                switch selectedTab {
                case .notes:
                    notesContent
                case .tasks:
                    tasksContent
                case .issues:
                    issuesContent
                }
            }
            .padding(.horizontal, 16)
        }
    }
    
    // MARK: - Notes Content
    private var notesContent: some View {
        Group {
            if selectedView == .list {
                // Notes List View
                ForEach(filteredNotes, id: \.id) { note in
                    NavigationLink(destination: NoteDetailView(note: createNoteFromSimple(note))) {
                        noteCardView(note: note)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            } else {
                // Notes Grid View
                LazyVGrid(columns: [
                    GridItem(.flexible(), spacing: 12),
                    GridItem(.flexible(), spacing: 12)
                ], spacing: 12) {
                    ForEach(filteredNotes, id: \.id) { note in
                        NavigationLink(destination: NoteDetailView(note: createNoteFromSimple(note))) {
                            noteCardView(note: note, isCompact: true)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
            }
        }
    }
    
    // MARK: - Tasks Content
    private var tasksContent: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(alignment: .top, spacing: 16) {
                // To Do Column
                kanbanColumn(
                    title: "To Do",
                    tasks: mockTasks.filter { $0.status == "todo" },
                    count: mockTasks.filter { $0.status == "todo" }.count
                )
                
                // In Progress Column
                kanbanColumn(
                    title: "In Progress",
                    tasks: mockTasks.filter { $0.status == "inProgress" },
                    count: mockTasks.filter { $0.status == "inProgress" }.count
                )
                
                // Done Column
                kanbanColumn(
                    title: "Done",
                    tasks: mockTasks.filter { $0.status == "done" },
                    count: mockTasks.filter { $0.status == "done" }.count
                )
            }
            .padding(.horizontal, 16)
        }
    }
    
    // MARK: - Issues Content
    private var issuesContent: some View {
        ForEach(filteredIssues, id: \.id) { issue in
            issueCardView(issue: issue)
        }
    }
    
    // MARK: - Component Functions
    
    // Note Card Component
    private func noteCardView(note: SimpleNote, isCompact: Bool = false) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(note.title)
                        .font(.system(size: isCompact ? 16 : 18, weight: .semibold))
                        .foregroundColor(.primary)
                        .lineLimit(isCompact ? 2 : 1)
                    
                    Text(RelativeDateTimeFormatter().localizedString(for: note.createdAt, relativeTo: Date()))
                        .font(.system(size: 11))
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                if !isCompact {
                    Menu {
                        Button("Edit") {}
                        Button("Share") {}
                        Button("Delete", role: .destructive) {}
                    } label: {
                        Image(systemName: "ellipsis")
                            .font(.system(size: 14))
                            .foregroundColor(.secondary)
                            .frame(width: 32, height: 32)
                            .background(Color.gray.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                    }
                }
            }
            
            // Content
            Text(note.content)
                .font(.system(size: isCompact ? 13 : 14))
                .foregroundColor(.secondary)
                .lineLimit(isCompact ? 4 : 3)
                .multilineTextAlignment(.leading)
            
            // Footer
            HStack {
                // Tags
                HStack(spacing: 6) {
                    ForEach(Array(note.tags.prefix(isCompact ? 2 : 3)), id: \.self) { tag in
                        Text(tag)
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.blue)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.blue.opacity(0.1))
                            .clipShape(Capsule())
                    }
                    
                    if note.tags.count > (isCompact ? 2 : 3) {
                        Text("+\(note.tags.count - (isCompact ? 2 : 3))")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.secondary)
                    }
                }
                
                Spacer()
                
                if !isCompact {
                    // Action buttons
                    HStack(spacing: 8) {
                        Button(action: {}) {
                            Image(systemName: "heart")
                                .font(.system(size: 14))
                                .foregroundColor(.secondary)
                                .frame(width: 32, height: 32)
                                .background(Color.gray.opacity(0.1))
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                        }
                        
                        Button(action: {}) {
                            Image(systemName: "square.and.arrow.up")
                                .font(.system(size: 14))
                                .foregroundColor(.secondary)
                                .frame(width: 32, height: 32)
                                .background(Color.gray.opacity(0.1))
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                        }
                    }
                }
            }
        }
        .padding(16)
        .background(Color.gray.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.gray.opacity(0.3), lineWidth: 0.5)
        )
    }
    
    // Kanban Column Component
    private func kanbanColumn(title: String, tasks: [SimpleTask], count: Int) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack {
                Text(title)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.primary)
                
                Spacer()
                
                Text("\(count)")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(.secondary)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.gray.opacity(0.2))
                    .clipShape(Capsule())
            }
            
            // Tasks
            LazyVStack(spacing: 12) {
                ForEach(tasks, id: \.id) { task in
                    taskCardView(task: task)
                }
            }
            
            Spacer()
        }
        .frame(width: 280)
        .padding(16)
        .background(Color.gray.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
    
    // Task Card Component
    private func taskCardView(task: SimpleTask) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            // Priority and menu
            HStack {
                HStack(spacing: 6) {
                    Circle()
                        .fill(priorityColor(task.priority))
                        .frame(width: 8, height: 8)
                    
                    Text(task.priority.capitalized)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                Menu {
                    Button("Edit") {}
                    Button("Move") {}
                    Button("Delete", role: .destructive) {}
                } label: {
                    Image(systemName: "ellipsis")
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                }
            }
            
            // Title
            Text(task.title)
                .font(.system(size: 15, weight: .medium))
                .foregroundColor(.primary)
                .lineLimit(2)
                .multilineTextAlignment(.leading)
            
            // Content
            if !task.content.isEmpty {
                Text(task.content)
                    .font(.system(size: 13))
                    .foregroundColor(.secondary)
                    .lineLimit(3)
                    .multilineTextAlignment(.leading)
            }
            
            // Tags
            if !task.tags.isEmpty {
                HStack(spacing: 6) {
                    ForEach(Array(task.tags.prefix(2)), id: \.self) { tag in
                        Text(tag)
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.blue)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 3)
                            .background(Color.blue.opacity(0.1))
                            .clipShape(Capsule())
                    }
                    
                    if task.tags.count > 2 {
                        Text("+\(task.tags.count - 2)")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.secondary)
                    }
                }
            }
            
            // Due date
            if let dueDate = task.dueDate {
                HStack {
                    Image(systemName: "calendar")
                        .font(.system(size: 11))
                        .foregroundColor(.secondary)
                    
                    Text(dueDate, style: .date)
                        .font(.system(size: 11))
                        .foregroundColor(.secondary)
                    
                    Spacer()
                }
            }
        }
        .padding(12)
        .background(Color.gray.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.gray.opacity(0.3), lineWidth: 0.5)
        )
    }
    
    // Issue Card Component
    private func issueCardView(issue: SimpleNote) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                HStack(spacing: 8) {
                    Image(systemName: "exclamationmark.triangle")
                        .font(.system(size: 14))
                        .foregroundColor(.red)
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text(issue.title)
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.primary)
                            .lineLimit(1)
                        
                        Text("Reported " + RelativeDateTimeFormatter().localizedString(for: issue.createdAt, relativeTo: Date()))
                            .font(.system(size: 11))
                            .foregroundColor(.secondary)
                    }
                }
                
                Spacer()
                
                Menu {
                    Button("Edit") {}
                    Button("Assign") {}
                    Button("Mark as Resolved") {}
                    Button("Delete", role: .destructive) {}
                } label: {
                    Image(systemName: "ellipsis")
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                        .frame(width: 32, height: 32)
                        .background(Color.gray.opacity(0.1))
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }
            }
            
            // Content
            Text(issue.content)
                .font(.system(size: 14))
                .foregroundColor(.secondary)
                .lineLimit(3)
                .multilineTextAlignment(.leading)
            
            // Footer
            HStack {
                // Tags with priority highlighting
                HStack(spacing: 6) {
                    ForEach(Array(issue.tags.prefix(3)), id: \.self) { tag in
                        Text(tag)
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(tag == "critical" ? .white : .red)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(tag == "critical" ? Color.red : Color.red.opacity(0.1))
                            .clipShape(Capsule())
                    }
                    
                    if issue.tags.count > 3 {
                        Text("+\(issue.tags.count - 3)")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.secondary)
                    }
                }
                
                Spacer()
                
                // Action buttons
                HStack(spacing: 8) {
                    Button(action: {}) {
                        Image(systemName: "checkmark.circle")
                            .font(.system(size: 14))
                            .foregroundColor(.green)
                            .frame(width: 32, height: 32)
                            .background(Color.green.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                    }
                    
                    Button(action: {}) {
                        Image(systemName: "person.badge.plus")
                            .font(.system(size: 14))
                            .foregroundColor(.blue)
                            .frame(width: 32, height: 32)
                            .background(Color.blue.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                    }
                }
            }
        }
        .padding(16)
        .background(Color.gray.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.red.opacity(0.2), lineWidth: 1)
        )
    }
    
    // Helper function for priority colors
    private func priorityColor(_ priority: String) -> Color {
        switch priority.lowercased() {
        case "low": return .green
        case "medium": return .orange
        case "high": return .red
        default: return .gray
        }
    }
    
    // MARK: - Computed Properties
    private var filteredNotes: [SimpleNote] {
        if searchText.isEmpty {
            return mockNotes
        } else {
            return mockNotes.filter { note in
                note.title.localizedCaseInsensitiveContains(searchText) ||
                note.content.localizedCaseInsensitiveContains(searchText) ||
                note.tags.contains { $0.localizedCaseInsensitiveContains(searchText) }
            }
        }
    }
    
    private var filteredIssues: [SimpleNote] {
        if searchText.isEmpty {
            return mockIssues
        } else {
            return mockIssues.filter { issue in
                issue.title.localizedCaseInsensitiveContains(searchText) ||
                issue.content.localizedCaseInsensitiveContains(searchText) ||
                issue.tags.contains { $0.localizedCaseInsensitiveContains(searchText) }
            }
        }
    }
}

// MARK: - Supporting Types
enum TabType: CaseIterable {
    case notes, tasks, issues
    
    var displayName: String {
        switch self {
        case .notes: return "Notes"
        case .tasks: return "Tasks"
        case .issues: return "Issues"
        }
    }
}

enum ViewType {
    case list, grid, kanban
}

#Preview {
    HomeView()
}

// MARK: - Helper Functions Extension
extension HomeView {
    private func createNoteFromSimple(_ simpleNote: SimpleNote) -> Note {
        let note = Note(
            title: simpleNote.title,
            content: simpleNote.content,
            tags: simpleNote.tags,
            type: NoteType(rawValue: simpleNote.type) ?? .note
        )
        return note
    }
    
    private func createTaskFromSimple(_ simpleTask: SimpleTask) -> Task {
        let priority = Priority(rawValue: simpleTask.priority) ?? .medium
        let status = TaskStatus(rawValue: simpleTask.status) ?? .todo
        
        let task = Task(
            title: simpleTask.title,
            content: simpleTask.content,
            priority: priority,
            status: status,
            tags: simpleTask.tags,
            dueDate: simpleTask.dueDate
        )
        return task
    }
}
