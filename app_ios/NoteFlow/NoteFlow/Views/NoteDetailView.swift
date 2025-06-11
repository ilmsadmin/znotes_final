//
//  NoteDetailView.swift
//  NoteFlow
//
//  Created by GitHub Copilot
//

import SwiftUI
import SwiftData

struct NoteDetailView: View {
    let note: Note
    @Environment(\.dismiss) private var dismiss
    @State private var showingEditView = false
    @State private var showingDeleteAlert = false
    @State private var newComment = ""
    @State private var comments: [MockComment] = []
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Header Section
                headerSection
                
                // Content Section
                contentSection
                
                // Tags Section
                if !note.tags.isEmpty {
                    tagsSection
                }
                
                // Metadata Section
                metadataSection
                
                // Comments Section
                commentsSection
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 100)
        }
        .background(Color.secondary.opacity(0.05))
        .navigationTitle(note.title)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Menu {
                    Button("Edit") {
                        showingEditView = true
                    }
                    Button("Share") {
                        // TODO: Implement share
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
            EditNoteView(note: note)
        }
        .alert("Delete Note", isPresented: $showingDeleteAlert) {
            Button("Cancel", role: .cancel) { }
            Button("Delete", role: .destructive) {
                // TODO: Implement delete
                dismiss()
            }
        } message: {
            Text("This action cannot be undone.")
        }
        .onAppear {
            loadComments()
        }
    }
    
    // MARK: - Header Section
    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: note.type.iconName)
                    .font(.system(size: 20))
                    .foregroundColor(.blue)
                    .frame(width: 32, height: 32)
                    .background(Color.blue.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(note.type.displayName)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.secondary)
                    
                    Text("Created " + RelativeDateTimeFormatter().localizedString(for: note.createdAt, relativeTo: Date()))
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                }
                
                Spacer()
            }
            
            Text(note.title)
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(.primary)
                .multilineTextAlignment(.leading)
        }
        .padding(.top, 16)
    }
    
    // MARK: - Content Section
    private var contentSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Content")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.primary)
            
            Text(note.content)
                .font(.system(size: 16))
                .foregroundColor(.primary)
                .lineSpacing(4)
                .multilineTextAlignment(.leading)
                .padding(16)
                .background(Color.secondary.opacity(0.1))
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
                ForEach(note.tags, id: \.self) { tag in
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
    
    // MARK: - Metadata Section
    private var metadataSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Information")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.primary)
            
            VStack(spacing: 12) {
                metadataRow(
                    icon: "calendar",
                    title: "Created",
                    value: DateFormatter.friendlyDate.string(from: note.createdAt)
                )
                
                metadataRow(
                    icon: "pencil",
                    title: "Last Modified",
                    value: DateFormatter.friendlyDate.string(from: note.updatedAt)
                )
                
                metadataRow(
                    icon: "textformat.size",
                    title: "Characters",
                    value: "\(note.content.count)"
                )
            }
            .padding(16)
            .background(Color.secondary.opacity(0.1))
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }
    
    private func metadataRow(icon: String, title: String, value: String) -> some View {
        HStack {
            Image(systemName: icon)
                .font(.system(size: 14))
                .foregroundColor(.secondary)
                .frame(width: 20)
            
            Text(title)
                .font(.system(size: 14))
                .foregroundColor(.secondary)
            
            Spacer()
            
            Text(value)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(.primary)
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
                    .background(Color.secondary.opacity(0.2))
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
                    
                    Text("Be the first to add a comment")
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 32)
                .background(Color.secondary.opacity(0.1))
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
                .background(Color(UIColor.secondarySystemBackground))
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
        .background(Color(UIColor.systemBackground))
        .overlay(
            Rectangle()
                .fill(Color.gray.opacity(0.3))
                .frame(height: 0.5),
            alignment: .top
        )
    }
    
    // MARK: - Helper Functions
    private func loadComments() {
        // Load from MockData
        comments = MockData.shared.sampleComments.filter { comment in
            comment.noteId == note.id
        }
    }
    
    private func addComment() {
        let trimmedComment = newComment.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmedComment.isEmpty else { return }
        
        let comment = MockComment(
            noteId: note.id,
            content: trimmedComment,
            author: "Current User" // Replace with actual user name when available
        )
        
        comments.append(comment)
        newComment = ""
        
        // TODO: Save comment to data source
    }
}

// MARK: - Edit Note View

struct EditNoteView: View {
    let note: Note
    @Environment(\.dismiss) private var dismiss
    @State private var title: String
    @State private var content: String
    @State private var tags: [String]
    
    init(note: Note) {
        self.note = note
        self._title = State(initialValue: note.title)
        self._content = State(initialValue: note.content)
        self._tags = State(initialValue: note.tags)
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
                                .background(Color(UIColor.secondarySystemBackground))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                        
                        // Content Input
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Content")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.primary)
                            
                            TextEditor(text: $content)
                                .font(.system(size: 16))
                                .scrollContentBackground(.hidden)
                                .frame(minHeight: 200)
                                .padding(16)
                                .background(Color(UIColor.secondarySystemBackground))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                        
                        // Tags Section
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Tags")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.primary)
                            
                            LazyVGrid(columns: [
                                GridItem(.adaptive(minimum: 80))
                            ], spacing: 8) {
                                ForEach(tags, id: \.self) { tag in
                                    HStack(spacing: 6) {
                                        Text(tag)
                                            .font(.system(size: 12, weight: .medium))
                                            .foregroundColor(.blue)
                                        
                                        Button(action: {
                                            tags.removeAll { $0 == tag }
                                        }) {
                                            Image(systemName: "xmark")
                                                .font(.system(size: 10, weight: .bold))
                                                .foregroundColor(.blue)
                                        }
                                    }
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 6)
                                    .background(Color.blue.opacity(0.1))
                                    .clipShape(Capsule())
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
                .background(Color(UIColor.systemBackground))
            }
            .background(Color(UIColor.systemBackground))
            .navigationTitle("Edit Note")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
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

// MARK: - Extensions

extension DateFormatter {
    static let friendlyDate: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter
    }()
}

// MARK: - MockCommentRowView

struct MockCommentRowView: View {
    let comment: MockComment
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            // User avatar placeholder
            Circle()
                .fill(Color.gray.opacity(0.3))
                .frame(width: 32, height: 32)
                .overlay(
                    Text(comment.author.prefix(1))
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.secondary)
                )
            
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text(comment.author)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.primary)
                    
                    Spacer()
                    
                    Text(RelativeDateTimeFormatter().localizedString(for: comment.createdAt, relativeTo: Date()))
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                }
                
                Text(comment.content)
                    .font(.system(size: 14))
                    .foregroundColor(.primary)
                    .multilineTextAlignment(.leading)
                
                HStack(spacing: 16) {
                    Button("Reply") {
                        // TODO: Implement reply functionality
                    }
                    .font(.system(size: 12))
                    .foregroundColor(.blue)
                    
                    Button("Like") {
                        // TODO: Implement like functionality
                    }
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
                }
                .padding(.top, 4)
            }
        }
        .padding(.vertical, 8)
    }
}

#Preview {
    NavigationView {
        NoteDetailView(note: Note(
            title: "Team Meeting Notes",
            content: "Reviewed Q4 roadmap and discussed key priorities for the upcoming sprint.",
            tags: ["meeting", "team", "roadmap"],
            type: .note
        ))
    }
}
