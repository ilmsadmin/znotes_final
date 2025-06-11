//
//  TaskDetailView.swift
//  NoteFlow
//
//  Created by GitHub Copilot
//

import SwiftUI

struct TaskDetailView: View {
    let task: Task
    @Environment(\.dismiss) private var dismiss
    @State private var showingEditView = false
    @State private var showingDeleteAlert = false
    @State private var showingAssigneeSheet = false
    @State private var currentStatus: TaskStatus
    @State private var assignees: [TeamMember] = []
    @State private var comments: [Comment] = []
    @State private var newComment = ""
    
    init(task: Task) {
        self.task = task
        self._currentStatus = State(initialValue: task.status)
    }
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Header Section
                headerSection
                
                // Status & Priority Section
                statusPrioritySection
                
                // Assignees Section
                assigneesSection
                
                // Due Date Section
                if let dueDate = task.dueDate {
                    dueDateSection(dueDate)
                }
                
                // Content Section
                contentSection
                
                // Tags Section
                if !task.tags.isEmpty {
                    tagsSection
                }
                
                // Progress Section
                progressSection
                
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
            EditTaskView(task: task)
        }
        .sheet(isPresented: $showingAssigneeSheet) {
            AssigneeSelectionView(selectedAssignees: $assignees)
        }
        .alert("Delete Task", isPresented: $showingDeleteAlert) {
            Button("Cancel", role: .cancel) { }
            Button("Delete", role: .destructive) {
                // TODO: Implement delete
                dismiss()
            }
        } message: {
            Text("This action cannot be undone.")
        }
        .onAppear {
            loadTaskData()
        }
    }
    
    // MARK: - Header Section
    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: "checkmark.circle")
                    .font(.system(size: 20))
                    .foregroundColor(.blue)
                    .frame(width: 32, height: 32)
                    .background(Color.blue.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("Task")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.secondary)
                    
                    Text("Created " + RelativeDateTimeFormatter().localizedString(for: task.createdAt, relativeTo: Date()))
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                }
                
                Spacer()
            }
            
            Text(task.title)
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(.primary)
                .multilineTextAlignment(.leading)
        }
        .padding(.top, 16)
    }
    
    // MARK: - Status & Priority Section
    private var statusPrioritySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Status & Priority")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.primary)
            
            HStack(spacing: 12) {
                // Status Selector
                Menu {
                    ForEach(TaskStatus.allCases, id: \.self) { status in
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
                            .fill(statusColor(currentStatus))
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
                
                // Priority Indicator
                HStack(spacing: 8) {
                    Circle()
                        .fill(task.priority.color)
                        .frame(width: 8, height: 8)
                    
                    Text(task.priority.displayName)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.primary)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(Color(.secondarySystemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 8))
                
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
    
    // MARK: - Due Date Section
    private func dueDateSection(_ dueDate: Date) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Due Date")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.primary)
            
            HStack {
                Image(systemName: "calendar")
                    .font(.system(size: 16))
                    .foregroundColor(isOverdue(dueDate) ? .red : .blue)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(dueDate.formatted(date: .abbreviated, time: .omitted))
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.primary)
                    
                    Text(dueDateStatus(dueDate))
                        .font(.system(size: 14))
                        .foregroundColor(isOverdue(dueDate) ? .red : .secondary)
                }
                
                Spacer()
            }
            .padding(16)
            .background(Color(.secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(isOverdue(dueDate) ? Color.red.opacity(0.3) : Color.clear, lineWidth: 1)
            )
        }
    }
    
    // MARK: - Content Section
    private var contentSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Description")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.primary)
            
            Text(task.content.isEmpty ? "No description provided" : task.content)
                .font(.system(size: 16))
                .foregroundColor(task.content.isEmpty ? .secondary : .primary)
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
                ForEach(task.tags, id: \.self) { tag in
                    Text(tag)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(.blue)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Color.blue.opacity(0.1))
                        .clipShape(Capsule())
                }
            }
        }
    }
    
    // MARK: - Progress Section
    private var progressSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Progress")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.primary)
            
            VStack(spacing: 12) {
                HStack {
                    Text("Status")
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                    
                    Spacer()
                    
                    Text(currentStatus.displayName)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.primary)
                }
                
                // Progress Bar
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text("Completion")
                            .font(.system(size: 14))
                            .foregroundColor(.secondary)
                        
                        Spacer()
                        
                        Text("\(progressPercentage)%")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.primary)
                    }
                    
                    ProgressView(value: Double(progressPercentage), total: 100)
                        .progressViewStyle(LinearProgressViewStyle(tint: progressColor))
                        .scaleEffect(x: 1, y: 2, anchor: .center)
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
                    
                    Text("Start a discussion about this task")
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
                        CommentRowView(comment: comment)
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
    
    // MARK: - Computed Properties
    private var progressPercentage: Int {
        switch currentStatus {
        case .todo: return 0
        case .inProgress: return 50
        case .done: return 100
        }
    }
    
    private var progressColor: Color {
        switch currentStatus {
        case .todo: return .gray
        case .inProgress: return .orange
        case .done: return .green
        }
    }
    
    // MARK: - Helper Functions
    private func statusColor(_ status: TaskStatus) -> Color {
        switch status {
        case .todo: return .gray
        case .inProgress: return .orange
        case .done: return .green
        }
    }
    
    private func isOverdue(_ dueDate: Date) -> Bool {
        return dueDate < Date() && currentStatus != .done
    }
    
    private func dueDateStatus(_ dueDate: Date) -> String {
        if currentStatus == .done {
            return "Completed"
        } else if isOverdue(dueDate) {
            return "Overdue"
        } else {
            let timeInterval = dueDate.timeIntervalSince(Date())
            let days = Int(timeInterval / (24 * 3600))
            if days == 0 {
                return "Due today"
            } else if days == 1 {
                return "Due tomorrow"
            } else {
                return "Due in \(days) days"
            }
        }
    }
    
    private func updateStatus(to newStatus: TaskStatus) {
        currentStatus = newStatus
        // TODO: Update status in data source
    }
    
    private func removeAssignee(_ assignee: TeamMember) {
        assignees.removeAll { $0.id == assignee.id }
        // TODO: Update assignees in data source
    }
    
    private func loadTaskData() {
        // TODO: Load assignees and comments from data source
        assignees = [
            TeamMember(id: UUID(), name: "John Doe", email: "john@company.com", avatar: nil),
            TeamMember(id: UUID(), name: "Jane Smith", email: "jane@company.com", avatar: nil)
        ]
        
        comments = [
            Comment(
                noteId: task.id,
                userId: UUID(),
                content: "Started working on this task. Will update progress soon."
            )
        ]
    }
    
    private func addComment() {
        let trimmedComment = newComment.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmedComment.isEmpty else { return }
        
        let comment = Comment(
            noteId: task.id,
            userId: UUID(),
            content: trimmedComment
        )
        
        comments.append(comment)
        newComment = ""
        
        // TODO: Save comment to data source
    }
}

// MARK: - Supporting Views

struct AssigneeRowView: View {
    let assignee: TeamMember
    let onRemove: () -> Void
    
    var body: some View {
        HStack(spacing: 12) {
            // Avatar
            Circle()
                .fill(Color.blue)
                .frame(width: 40, height: 40)
                .overlay(
                    Text(assignee.name.prefix(1))
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                )
            
            VStack(alignment: .leading, spacing: 2) {
                Text(assignee.name)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.primary)
                
                Text(assignee.email)
                    .font(.system(size: 14))
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Button(action: onRemove) {
                Image(systemName: "xmark")
                    .font(.system(size: 14))
                    .foregroundColor(.secondary)
                    .frame(width: 24, height: 24)
                    .background(Color(.systemGray5))
                    .clipShape(Circle())
            }
        }
        .padding(12)
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

struct AssigneeSelectionView: View {
    @Binding var selectedAssignees: [TeamMember]
    @Environment(\.dismiss) private var dismiss
    @State private var availableMembers: [TeamMember] = []
    
    var body: some View {
        NavigationView {
            List {
                ForEach(availableMembers, id: \.id) { member in
                    HStack {
                        Circle()
                            .fill(Color.blue)
                            .frame(width: 32, height: 32)
                            .overlay(
                                Text(member.name.prefix(1))
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundColor(.white)
                            )
                        
                        VStack(alignment: .leading, spacing: 2) {
                            Text(member.name)
                                .font(.system(size: 16, weight: .medium))
                            
                            Text(member.email)
                                .font(.system(size: 14))
                                .foregroundColor(.secondary)
                        }
                        
                        Spacer()
                        
                        if selectedAssignees.contains(where: { $0.id == member.id }) {
                            Image(systemName: "checkmark")
                                .foregroundColor(.blue)
                        }
                    }
                    .contentShape(Rectangle())
                    .onTapGesture {
                        toggleAssignee(member)
                    }
                }
            }
            .navigationTitle("Select Assignees")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
        }
        .onAppear {
            loadAvailableMembers()
        }
    }
    
    private func toggleAssignee(_ member: TeamMember) {
        if let index = selectedAssignees.firstIndex(where: { $0.id == member.id }) {
            selectedAssignees.remove(at: index)
        } else {
            selectedAssignees.append(member)
        }
    }
    
    private func loadAvailableMembers() {
        // TODO: Load from data source
        availableMembers = [
            TeamMember(id: UUID(), name: "John Doe", email: "john@company.com", avatar: nil),
            TeamMember(id: UUID(), name: "Jane Smith", email: "jane@company.com", avatar: nil),
            TeamMember(id: UUID(), name: "Mike Wilson", email: "mike@company.com", avatar: nil),
            TeamMember(id: UUID(), name: "Sarah Johnson", email: "sarah@company.com", avatar: nil)
        ]
    }
}

// MARK: - Edit Task View

struct EditTaskView: View {
    let task: Task
    @Environment(\.dismiss) private var dismiss
    @State private var title: String
    @State private var content: String
    @State private var priority: Priority
    @State private var dueDate: Date
    @State private var hasDueDate: Bool
    @State private var tags: [String]
    
    init(task: Task) {
        self.task = task
        self._title = State(initialValue: task.title)
        self._content = State(initialValue: task.content)
        self._priority = State(initialValue: task.priority)
        self._dueDate = State(initialValue: task.dueDate ?? Date())
        self._hasDueDate = State(initialValue: task.dueDate != nil)
        self._tags = State(initialValue: task.tags)
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
                        
                        // Priority Section
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Priority")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.primary)
                            
                            HStack(spacing: 8) {
                                ForEach(Priority.allCases, id: \.self) { priorityOption in
                                    Button(action: {
                                        priority = priorityOption
                                    }) {
                                        HStack(spacing: 6) {
                                            Circle()
                                                .fill(priorityOption.color)
                                                .frame(width: 8, height: 8)
                                            
                                            Text(priorityOption.displayName)
                                                .font(.system(size: 14, weight: .medium))
                                        }
                                        .foregroundColor(priority == priorityOption ? .blue : .secondary)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                        .background(
                                            priority == priorityOption ?
                                            Color.blue.opacity(0.1) :
                                            Color(.secondarySystemBackground)
                                        )
                                        .clipShape(RoundedRectangle(cornerRadius: 12))
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 12)
                                                .stroke(
                                                    priority == priorityOption ? 
                                                    Color.blue : Color.clear, 
                                                    lineWidth: 1
                                                )
                                        )
                                    }
                                }
                            }
                        }
                        
                        // Due Date Section
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Text("Due Date")
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundColor(.primary)
                                
                                Spacer()
                                
                                Toggle("", isOn: $hasDueDate)
                                    .labelsHidden()
                            }
                            
                            if hasDueDate {
                                DatePicker("", selection: $dueDate, displayedComponents: .date)
                                    .datePickerStyle(CompactDatePickerStyle())
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .padding(16)
                                    .background(Color(.secondarySystemBackground))
                                    .clipShape(RoundedRectangle(cornerRadius: 12))
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
            .navigationTitle("Edit Task")
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

// MARK: - Supporting Models

struct TeamMember {
    let id: UUID
    let name: String
    let email: String
    let avatar: String?
}

#Preview {
    NavigationView {
        TaskDetailView(task: MockData.shared.sampleTasks[0])
    }
}
