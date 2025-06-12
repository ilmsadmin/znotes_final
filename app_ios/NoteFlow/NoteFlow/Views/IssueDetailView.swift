//
//  IssueDetailView.swift
//  NoteFlow
//
//  Created by GitHub Copilot
//

import SwiftUI
import SwiftData

// Type aliases to avoid conflicts
typealias AppIssue = Note
typealias AppIssueComment = Comment

struct IssueDetailView: View {
    let issue: AppIssue
    @Environment(\.dismiss) private var dismiss
    @State private var showingEditView = false
    @State private var showingDeleteAlert = false
    @State private var showingAssigneeSheet = false
    @State private var currentSeverity: IssueSeverity
    @State private var currentStatus: IssueStatus
    @State private var assignees: [TeamMember] = []
    @State private var comments: [MockComment] = []
    @State private var newComment = ""
    
    init(issue: AppIssue) {
        self.issue = issue
        // Derive status and severity from tags
        let severity = IssueSeverity.fromTags(issue.tags)
        let status = IssueStatus.fromTags(issue.tags)
        self._currentSeverity = State(initialValue: severity)
        self._currentStatus = State(initialValue: status)
    }
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Header Section
                headerSection
                
                // Status & Severity Section
                statusSeveritySection
                
                // Assignees Section
                assigneesSection
                
                // Reported Date Section
                reportedDateSection
                
                // Content Section
                contentSection
                
                // Tags Section
                if !issue.tags.isEmpty {
                    tagsSection
                }
                
                // Timeline Section
                timelineSection
                
                // Comments Section
                commentsSection
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 100)
        }
        .background(Color(.systemBackground))
        .navigationBarTitleDisplayMode(.inline)
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button(action: {
                    dismiss()
                }) {
                    HStack(spacing: 4) {
                        Image(systemName: "chevron.left")
                            .font(.system(size: 16, weight: .semibold))
                        Text("Back")
                            .font(.system(size: 16))
                    }
                    .foregroundColor(.blue)
                }
            }
            
            ToolbarItem(placement: .navigationBarTrailing) {
                Menu {
                    Button("Edit") {
                        showingEditView = true
                    }
                    Button("Duplicate") {
                        // TODO: Implement duplicate
                    }
                    Divider()
                    Button("Delete", role: .destructive) {
                        showingDeleteAlert = true
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                        .font(.system(size: 18))
                        .foregroundColor(.blue)
                }
            }
        }
        .overlay(
            // Floating Comment Bar
            VStack {
                Spacer()
                commentInputBar
            }
        )
        .sheet(isPresented: $showingEditView) {
            EditIssueView(issue: issue)
        }
        .sheet(isPresented: $showingAssigneeSheet) {
            AssigneeSelectionView(selectedAssignees: $assignees)
        }
        .alert("Delete Issue", isPresented: $showingDeleteAlert) {
            Button("Cancel", role: .cancel) { }
            Button("Delete", role: .destructive) {
                // TODO: Implement delete
                dismiss()
            }
        } message: {
            Text("This action cannot be undone.")
        }
        .onAppear {
            loadIssueData()
        }
    }
    
    // MARK: - Header Section
    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: "exclamationmark.triangle")
                    .font(.system(size: 20))
                    .foregroundColor(.red)
                    .frame(width: 32, height: 32)
                    .background(Color.red.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("Issue")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.secondary)
                    
                    Text("Reported " + RelativeDateTimeFormatter().localizedString(for: issue.createdAt, relativeTo: Date()))
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                }
                
                Spacer()
            }
            
            Text(issue.title)
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(.primary)
                .multilineTextAlignment(.leading)
        }
        .padding(.top, 16)
    }
    
    // MARK: - Status & Severity Section
    private var statusSeveritySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Status & Severity")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.primary)
            
            HStack(spacing: 12) {
                // Status Selector
                Menu {
                    ForEach(IssueStatus.allCases, id: \.self) { status in
                        Button(action: {
                            updateStatus(to: status)
                        }) {
                            HStack {
                                Text(status.displayName)
                                Spacer()
                                if currentStatus == status {
                                    Image(systemName: "checkmark")
                                        .foregroundColor(.blue)
                                }
                            }
                        }
                    }
                } label: {
                    HStack(spacing: 8) {
                        Circle()
                            .fill(currentStatus.color)
                            .frame(width: 8, height: 8)
                        
                        Text(currentStatus.displayName)
                            .font(.system(size: 14, weight: .medium))
                        
                        Image(systemName: "chevron.down")
                            .font(.system(size: 12))
                            .foregroundColor(.secondary)
                    }
                    .foregroundColor(.primary)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color(.secondarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                }
                
                // Severity Selector
                Menu {
                    ForEach(IssueSeverity.allCases, id: \.self) { severity in
                        Button(action: {
                            updateSeverity(to: severity)
                        }) {
                            HStack {
                                Text(severity.displayName)
                                Spacer()
                                if currentSeverity == severity {
                                    Image(systemName: "checkmark")
                                        .foregroundColor(.blue)
                                }
                            }
                        }
                    }
                } label: {
                    HStack(spacing: 8) {
                        Circle()
                            .fill(currentSeverity.color)
                            .frame(width: 8, height: 8)
                        
                        Text(currentSeverity.displayName)
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.primary)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color(.secondarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                }
                
                Spacer()
            }
        }
    }
    
    // MARK: - Assignees Section
    private var assigneesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Assignees")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.primary)
                
                Spacer()
                
                Button(action: {
                    showingAssigneeSheet = true
                }) {
                    Image(systemName: "person.badge.plus")
                        .font(.system(size: 14))
                        .foregroundColor(.blue)
                        .frame(width: 32, height: 32)
                        .background(Color.blue.opacity(0.1))
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }
            }
            
            if assignees.isEmpty {
                HStack {
                    Image(systemName: "person.slash")
                        .font(.system(size: 16))
                        .foregroundColor(.secondary)
                    
                    Text("No assignees")
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                    
                    Spacer()
                    
                    Button("Assign") {
                        showingAssigneeSheet = true
                    }
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.blue)
                }
                .padding(16)
                .background(Color(.secondarySystemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 12))
            } else {
                LazyVStack(spacing: 8) {
                    ForEach(assignees, id: \.id) { assignee in
                        AssigneeRowView(assignee: assignee) {
                            removeAssignee(assignee)
                        }
                    }
                }
            }
        }
    }
    
    // MARK: - Reported Date Section
    private var reportedDateSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Reported Date")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.primary)
            
            HStack {
                Image(systemName: "calendar")
                    .font(.system(size: 16))
                    .foregroundColor(.blue)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(issue.createdAt.formatted(date: .abbreviated, time: .omitted))
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.primary)
                    
                    Text(issueAgeStatus())
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                }
                
                Spacer()
            }
            .padding(16)
            .background(Color(.secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }
    
    // MARK: - Content Section
    private var contentSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Description")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.primary)
            
            Text(issue.content.isEmpty ? "No description provided" : issue.content)
                .font(.system(size: 16))
                .foregroundColor(issue.content.isEmpty ? .secondary : .primary)
                .lineSpacing(4)
                .multilineTextAlignment(.leading)
                .padding(16)
                .background(Color(.secondarySystemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }
    
    // MARK: - Tags Section
    private var tagsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Tags")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.primary)
            
            LazyVGrid(columns: [
                GridItem(.adaptive(minimum: 80))
            ], spacing: 8) {
                ForEach(issue.tags, id: \.self) { tag in
                    Text(tag)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(tagColor(for: tag))
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(tagBackgroundColor(for: tag))
                        .clipShape(Capsule())
                }
            }
        }
    }
    
    // MARK: - Timeline Section
    private var timelineSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Timeline")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.primary)
            
            VStack(spacing: 12) {
                TimelineEventView(
                    icon: "exclamationmark.triangle",
                    iconColor: .red,
                    title: "Issue reported",
                    description: "Issue was created and opened for investigation",
                    timestamp: issue.createdAt
                )
                
                if currentStatus != .open {
                    TimelineEventView(
                        icon: "arrow.clockwise",
                        iconColor: .orange,
                        title: "Status changed to \(currentStatus.displayName)",
                        description: "Issue status was updated",
                        timestamp: Date().addingTimeInterval(-3600) // Mock timestamp
                    )
                }
                
                if currentStatus == .resolved {
                    TimelineEventView(
                        icon: "checkmark.circle",
                        iconColor: .green,
                        title: "Issue resolved",
                        description: "Issue has been resolved and closed",
                        timestamp: Date() // Mock timestamp
                    )
                }
            }
            .padding(16)
            .background(Color(.secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }
    
    // MARK: - Comments Section
    private var commentsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Comments")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.primary)
                
                Spacer()
                
                Text("\(comments.count)")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.secondary)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color(.systemGray5))
                    .clipShape(Capsule())
            }
            
            if comments.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "bubble.left.and.bubble.right")
                        .font(.system(size: 32))
                        .foregroundColor(.secondary)
                    
                    Text("No comments yet")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.secondary)
                    
                    Text("Start a discussion about this issue")
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 32)
                .background(Color(.secondarySystemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 12))
            } else {
                LazyVStack(spacing: 12) {
                    ForEach(comments, id: \.id) { comment in
                        MockCommentRowView(comment: comment)
                    }
                }
            }
        }
    }
    
    // MARK: - Comment Input Bar
    private var commentInputBar: some View {
        HStack(spacing: 12) {
            TextField("Add a comment...", text: $newComment, axis: .vertical)
                .font(.system(size: 16))
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Color(.secondarySystemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 20))
                .lineLimit(1...4)
            
            Button(action: addComment) {
                Image(systemName: "paperplane.fill")
                    .font(.system(size: 16))
                    .foregroundColor(.white)
                    .frame(width: 44, height: 44)
                    .background(newComment.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? Color.gray : Color.blue)
                    .clipShape(Circle())
            }
            .disabled(newComment.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color(.systemBackground))
        .overlay(
            Rectangle()
                .fill(Color(.separator))
                .frame(height: 0.5),
            alignment: .top
        )
    }
    
    // MARK: - Helper Functions
    private func updateStatus(to newStatus: IssueStatus) {
        currentStatus = newStatus
        // TODO: Update status in data source
    }
    
    private func updateSeverity(to newSeverity: IssueSeverity) {
        currentSeverity = newSeverity
        // TODO: Update severity in data source
    }
    
    private func removeAssignee(_ assignee: TeamMember) {
        assignees.removeAll { $0.id == assignee.id }
        // TODO: Update assignees in data source
    }
    
    private func issueAgeStatus() -> String {
        let timeInterval = Date().timeIntervalSince(issue.createdAt)
        let days = Int(timeInterval / (24 * 3600))
        
        if days == 0 {
            return "Reported today"
        } else if days == 1 {
            return "Reported yesterday"
        } else if days < 7 {
            return "Reported \(days) days ago"
        } else if days < 30 {
            let weeks = days / 7
            return "Reported \(weeks) week\(weeks == 1 ? "" : "s") ago"
        } else {
            let months = days / 30
            return "Reported \(months) month\(months == 1 ? "" : "s") ago"
        }
    }
    
    private func tagColor(for tag: String) -> Color {
        switch tag.lowercased() {
        case "critical": return .white
        case "bug": return .red
        case "feature": return .blue
        case "enhancement": return .purple
        default: return .primary
        }
    }
    
    private func tagBackgroundColor(for tag: String) -> Color {
        switch tag.lowercased() {
        case "critical": return .red
        case "bug": return .red.opacity(0.1)
        case "feature": return .blue.opacity(0.1)
        case "enhancement": return .purple.opacity(0.1)
        default: return .secondary.opacity(0.1)
        }
    }
    
    private func loadIssueData() {
        // TODO: Load assignees and comments from data source
        assignees = [
            TeamMember(id: UUID(), name: "John Doe", email: "john@company.com", avatar: nil),
            TeamMember(id: UUID(), name: "Jane Smith", email: "jane@company.com", avatar: nil)
        ]
        
        comments = [
            MockComment(
                noteId: issue.id,
                content: "I can reproduce this issue on iOS Safari. Will investigate further.",
                author: "Current User"
            )
        ]
    }
    
    private func addComment() {
        let trimmedComment = newComment.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmedComment.isEmpty else { return }
        
        let comment = MockComment(
            noteId: issue.id,
            content: trimmedComment,
            author: "Current User"
        )
        
        comments.append(comment)
        newComment = ""
        
        // TODO: Save comment to data source
    }
}

// MARK: - Supporting Views

struct TimelineEventView: View {
    let icon: String
    let iconColor: Color
    let title: String
    let description: String
    let timestamp: Date
    
    var body: some View {
        HStack(spacing: 12) {
            // Icon
            Image(systemName: icon)
                .font(.system(size: 14))
                .foregroundColor(iconColor)
                .frame(width: 32, height: 32)
                .background(iconColor.opacity(0.1))
                .clipShape(Circle())
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.primary)
                
                Text(description)
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
                
                Text(timestamp.formatted(date: .abbreviated, time: .shortened))
                    .font(.system(size: 11))
                    .foregroundColor(.secondary)
            }
            
            Spacer()
        }
    }
}

// MARK: - Edit Issue View

struct EditIssueView: View {
    let issue: Note
    @Environment(\.dismiss) private var dismiss
    @State private var title: String
    @State private var content: String
    @State private var severity: IssueSeverity
    @State private var tags: [String]
    
    init(issue: Note) {
        self.issue = issue
        self._title = State(initialValue: issue.title)
        self._content = State(initialValue: issue.content)
        self._severity = State(initialValue: IssueSeverity.fromTags(issue.tags))
        self._tags = State(initialValue: issue.tags)
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                ScrollView {
                    VStack(spacing: 24) {
                        // Title Input
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Title")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.primary)
                            
                            TextField("Enter title...", text: $title)
                                .font(.system(size: 18, weight: .semibold))
                                .padding(16)
                                .background(Color(.secondarySystemBackground))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                        
                        // Content Input
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Description")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.primary)
                            
                            TextEditor(text: $content)
                                .font(.system(size: 16))
                                .scrollContentBackground(.hidden)
                                .frame(minHeight: 120)
                                .padding(16)
                                .background(Color(.secondarySystemBackground))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                        
                        // Severity Section
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Severity")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.primary)
                            
                            HStack(spacing: 8) {
                                ForEach(IssueSeverity.allCases, id: \.self) { severityOption in
                                    Button(action: {
                                        severity = severityOption
                                    }) {
                                        HStack(spacing: 6) {
                                            Circle()
                                                .fill(severityOption.color)
                                                .frame(width: 8, height: 8)
                                            
                                            Text(severityOption.displayName)
                                                .font(.system(size: 14, weight: .medium))
                                        }
                                        .foregroundColor(severity == severityOption ? .blue : .secondary)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                        .background(
                                            severity == severityOption ?
                                            Color.blue.opacity(0.1) :
                                            Color(.secondarySystemBackground)
                                        )
                                        .clipShape(RoundedRectangle(cornerRadius: 12))
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 12)
                                                .stroke(
                                                    severity == severityOption ? 
                                                    Color.blue : Color.clear, 
                                                    lineWidth: 1
                                                )
                                        )
                                    }
                                }
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 100)
                }
                
                // Save Button
                Button(action: saveChanges) {
                    Text("Save Changes")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(Color.blue)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 16)
                .background(Color(.systemBackground))
            }
            .background(Color(.systemBackground))
            .navigationTitle("Edit Issue")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .foregroundColor(.blue)
                }
            }
        }
    }
    
    private func saveChanges() {
        // TODO: Save changes to data source
        dismiss()
    }
}

// MARK: - Supporting Enums

enum IssueStatus: String, CaseIterable {
    case open = "open"
    case inProgress = "in_progress"
    case resolved = "resolved"
    case closed = "closed"
    
    var displayName: String {
        switch self {
        case .open: return "Open"
        case .inProgress: return "In Progress"
        case .resolved: return "Resolved"
        case .closed: return "Closed"
        }
    }
    
    var color: Color {
        switch self {
        case .open: return .red
        case .inProgress: return .orange
        case .resolved: return .green
        case .closed: return .gray
        }
    }
    
    static func fromTags(_ tags: [String]) -> IssueStatus {
        for tag in tags {
            switch tag.lowercased() {
            case "resolved": return .resolved
            case "closed": return .closed
            case "in-progress", "in_progress": return .inProgress
            default: continue
            }
        }
        return .open
    }
}

enum IssueSeverity: String, CaseIterable {
    case low = "low"
    case medium = "medium"
    case high = "high"
    case critical = "critical"
    
    var displayName: String {
        switch self {
        case .low: return "Low"
        case .medium: return "Medium"
        case .high: return "High"
        case .critical: return "Critical"
        }
    }
    
    var color: Color {
        switch self {
        case .low: return .green
        case .medium: return .yellow
        case .high: return .orange
        case .critical: return .red
        }
    }
    
    static func fromTags(_ tags: [String]) -> IssueSeverity {
        for tag in tags {
            switch tag.lowercased() {
            case "critical": return .critical
            case "high": return .high
            case "medium": return .medium
            case "low": return .low
            default: continue
            }
        }
        return .medium
    }
}

#Preview {
    NavigationView {
        IssueDetailView(issue: Note(
            title: "Login page not responsive",
            content: "The login form doesn't adapt properly to different screen sizes on mobile devices",
            tags: ["bug", "mobile", "ui", "high"],
            type: .issue
        ))
    }
}
