//
//  CreateView.swift
//  NoteFlow
//
//  Created by GitHub Copilot
//

import SwiftUI

struct CreateView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var selectedType: NoteType = .note
    @State private var title: String = ""
    @State private var content: String = ""
    @State private var tags: [String] = []
    @State private var newTag: String = ""
    @State private var selectedPriority: Priority = .medium
    @State private var dueDate: Date = Date()
    @State private var estimatedHours: String = ""
    @State private var showingImagePicker = false
    
    // Formatting states
    @State private var isBold = false
    @State private var isItalic = false
    @State private var showingLinkDialog = false
    
    // Suggested tags
    private let suggestedTags = ["meeting", "sprint", "roadmap", "team", "weekly", "planning", "urgent", "review"]
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Content
                ScrollView {
                    VStack(spacing: 24) {
                        // Type Selector
                        typeSelector
                        
                        // Title Input
                        titleInput
                        
                        // Formatting Bar
                        formattingBar
                        
                        // Content Input
                        contentInput
                        
                        // Task-specific fields
                        if selectedType == .task || selectedType == .issue {
                            taskSpecificFields
                        }
                        
                        // Tags Section
                        tagsSection
                        
                        // Attachments Section
                        attachmentsSection
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 100) // Space for bottom toolbar
                }
                
                Spacer()
                
                // Bottom Toolbar
                bottomToolbar
            }
            .background(Color(UIColor.systemBackground))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .foregroundColor(.blue)
                }
                
                ToolbarItem(placement: .principal) {
                    Text("New Item")
                        .font(.headline)
                        .fontWeight(.semibold)
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        saveItem()
                    }
                    .foregroundColor(.blue)
                    .fontWeight(.medium)
                }
            }
        }
    }
    
    // MARK: - Type Selector
    private var typeSelector: some View {
        HStack(spacing: 4) {
            ForEach(NoteType.allCases, id: \.self) { type in
                Button(action: {
                    selectedType = type
                }) {
                    HStack(spacing: 6) {
                        Image(systemName: type.iconName)
                            .font(.system(size: 14, weight: .medium))
                        Text(type.createDisplayName)
                            .font(.system(size: 14, weight: .medium))
                    }
                    .foregroundColor(selectedType == type ? .blue : .secondary)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(
                        selectedType == type ? 
                        Color.blue.opacity(0.1) : 
                        Color.gray.opacity(0.1)
                    )
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                }
            }
        }
        .padding(4)
        .background(Color.gray.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
    
    // MARK: - Title Input
    private var titleInput: some View {
        TextField(selectedType.titlePlaceholder, text: $title)
            .font(.system(size: 20, weight: .semibold))
            .textFieldStyle(PlainTextFieldStyle())
            .padding(.vertical, 12)
    }
    
    // MARK: - Formatting Bar
    private var formattingBar: some View {
        HStack(spacing: 8) {
            FormatButton(systemName: "bold", isSelected: $isBold)
            FormatButton(systemName: "italic", isSelected: $isItalic)
            FormatButton(systemName: "link", isSelected: .constant(false)) {
                showingLinkDialog = true
            }
            FormatButton(systemName: "list.bullet", isSelected: .constant(false))
            FormatButton(systemName: "textformat.size", isSelected: .constant(false))
            FormatButton(systemName: "quote.bubble", isSelected: .constant(false))
            
            Spacer()
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(Color.gray.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
    
    // MARK: - Content Input
    private var contentInput: some View {
        VStack(alignment: .leading, spacing: 0) {
            TextEditor(text: $content)
                .font(.system(size: 16))
                .scrollContentBackground(.hidden)
                .frame(minHeight: 200)
                .padding(16)
                .background(Color.gray.opacity(0.05))
                .clipShape(RoundedRectangle(cornerRadius: 16))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                )
                .overlay(
                    // Placeholder
                    Group {
                        if content.isEmpty {
                            VStack {
                                HStack {
                                    Text(selectedType.contentPlaceholder)
                                        .foregroundColor(.secondary)
                                        .font(.system(size: 16))
                                    Spacer()
                                }
                                Spacer()
                            }
                            .padding(16)
                            .allowsHitTesting(false)
                        }
                    }
                )
        }
    }
    
    // MARK: - Task Specific Fields
    private var taskSpecificFields: some View {
        VStack(alignment: .leading, spacing: 20) {
            // Priority Selector
            VStack(alignment: .leading, spacing: 12) {
                Text("Priority")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.primary)
                
                HStack(spacing: 8) {
                    ForEach(Priority.allCases, id: \.self) { priority in
                        Button(action: {
                            selectedPriority = priority
                        }) {
                            HStack(spacing: 6) {
                                Circle()
                                    .fill(priority.color)
                                    .frame(width: 8, height: 8)
                                
                                Text(priority.displayName)
                                    .font(.system(size: 14, weight: .medium))
                            }
                            .foregroundColor(selectedPriority == priority ? .blue : .secondary)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(
                                selectedPriority == priority ?
                                Color.blue.opacity(0.1) :
                                Color.gray.opacity(0.05)
                            )
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(
                                        selectedPriority == priority ? 
                                        Color.blue : Color.gray.opacity(0.3), 
                                        lineWidth: 1
                                    )
                            )
                        }
                    }
                }
            }
            
            // Due Date
            VStack(alignment: .leading, spacing: 12) {
                Text("Due Date")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.primary)
                
                DatePicker("", selection: $dueDate, displayedComponents: .date)
                    .datePickerStyle(CompactDatePickerStyle())
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(16)
                    .background(Color.gray.opacity(0.05))
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                    )
            }
            
            // Estimated Hours
            VStack(alignment: .leading, spacing: 12) {
                Text("Estimated Time (hours)")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.primary)
                
                TextField("e.g., 4", text: $estimatedHours)
                    .keyboardType(.numberPad)
                    .padding(16)
                    .background(Color.gray.opacity(0.05))
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                    )
            }
        }
    }
    
    // MARK: - Tags Section
    private var tagsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Tags")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.primary)
            
            // Tag Input Area
            VStack(alignment: .leading, spacing: 12) {
                // Current tags + input
                tagInputArea
                
                // Suggested tags
                suggestedTagsView
            }
        }
    }
    
    private var tagInputArea: some View {
        VStack(alignment: .leading, spacing: 8) {
            LazyVGrid(columns: [
                GridItem(.adaptive(minimum: 80))
            ], spacing: 8) {
                // Existing tags
                ForEach(tags, id: \.self) { tag in
                    TagView(tag: tag) {
                        removeTag(tag)
                    }
                }
                
                // New tag input
                HStack {
                    TextField("Add tag...", text: $newTag)
                        .font(.system(size: 14))
                        .onSubmit {
                            addNewTag()
                        }
                    
                    if !newTag.isEmpty {
                        Button("Add") {
                            addNewTag()
                        }
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(.blue)
                    }
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(Color.gray.opacity(0.1))
                .clipShape(Capsule())
            }
            .padding(12)
            .background(Color.gray.opacity(0.05))
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color.gray.opacity(0.3), lineWidth: 1)
            )
        }
    }
    
    private var suggestedTagsView: some View {
        LazyVGrid(columns: [
            GridItem(.adaptive(minimum: 70))
        ], spacing: 8) {
            ForEach(suggestedTags.filter { !tags.contains($0) }, id: \.self) { tag in
                Button(action: {
                    addTag(tag)
                }) {
                    Text(tag)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(.secondary)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Color.gray.opacity(0.1))
                        .clipShape(Capsule())
                }
            }
        }
    }
    
    // MARK: - Attachments Section
    private var attachmentsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Attachments")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.primary)
            
            Button(action: {
                showingImagePicker = true
            }) {
                HStack(spacing: 12) {
                    Image(systemName: "paperclip")
                        .font(.system(size: 20))
                        .foregroundColor(.secondary)
                    
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Add files or images")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundColor(.primary)
                        
                        Text("Tap to browse or drag and drop")
                            .font(.system(size: 14))
                            .foregroundColor(.secondary)
                    }
                    
                    Spacer()
                }
                .padding(16)
                .background(Color.gray.opacity(0.05))
                .clipShape(RoundedRectangle(cornerRadius: 16))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .strokeBorder(style: StrokeStyle(lineWidth: 2, dash: [5]))
                        .foregroundColor(Color.gray.opacity(0.3))
                )
            }
        }
    }
    
    // MARK: - Bottom Toolbar
    private var bottomToolbar: some View {
        HStack(spacing: 12) {
            Button("Save Draft") {
                saveDraft()
            }
            .font(.system(size: 16, weight: .semibold))
            .foregroundColor(.primary)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(Color.gray.opacity(0.1))
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(Color.gray.opacity(0.3), lineWidth: 1)
            )
            
            Button("Publish") {
                publishItem()
            }
            .font(.system(size: 16, weight: .semibold))
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(Color.blue)
            .clipShape(RoundedRectangle(cornerRadius: 16))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 16)
        .background(Color(UIColor.systemBackground))
        .overlay(
            Rectangle()
                .fill(Color.gray.opacity(0.3))
                .frame(height: 0.5),
            alignment: .top
        )
    }
    
    // MARK: - Helper Functions
    private func addNewTag() {
        let trimmedTag = newTag.trimmingCharacters(in: .whitespacesAndNewlines)
        if !trimmedTag.isEmpty && !tags.contains(trimmedTag) {
            addTag(trimmedTag)
            newTag = ""
        }
    }
    
    private func addTag(_ tag: String) {
        if !tags.contains(tag) {
            tags.append(tag)
        }
    }
    
    private func removeTag(_ tag: String) {
        tags.removeAll { $0 == tag }
    }
    
    private func saveItem() {
        // TODO: Implement save functionality
        print("Saving item: \(title)")
        dismiss()
    }
    
    private func saveDraft() {
        // TODO: Implement draft functionality
        print("Saving draft: \(title)")
    }
    
    private func publishItem() {
        // TODO: Implement publish functionality
        print("Publishing item: \(title)")
        dismiss()
    }
}

// MARK: - Supporting Views

struct TagView: View {
    let tag: String
    let onRemove: () -> Void
    
    var body: some View {
        HStack(spacing: 6) {
            Text(tag)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(.blue)
            
            Button(action: onRemove) {
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

struct FormatButton: View {
    let systemName: String?
    let text: String?
    @Binding var isSelected: Bool
    let action: (() -> Void)?
    
    init(systemName: String, isSelected: Binding<Bool>, action: (() -> Void)? = nil) {
        self.systemName = systemName
        self.text = nil
        self._isSelected = isSelected
        self.action = action
    }
    
    init(text: String, isSelected: Binding<Bool>, action: (() -> Void)? = nil) {
        self.systemName = nil
        self.text = text
        self._isSelected = isSelected
        self.action = action
    }
    
    var body: some View {
        Button(action: {
            if let action = action {
                action()
            } else {
                isSelected.toggle()
            }
        }) {
            Group {
                if let systemName = systemName {
                    Image(systemName: systemName)
                        .font(.system(size: 14, weight: isSelected ? .semibold : .regular))
                } else if let text = text {
                    Text(text)
                        .font(.system(size: 14, weight: isSelected ? .bold : .regular))
                }
            }
            .foregroundColor(isSelected ? .blue : .secondary)
            .frame(width: 36, height: 36)
            .background(isSelected ? Color.blue.opacity(0.1) : Color.gray.opacity(0.05))
            .clipShape(RoundedRectangle(cornerRadius: 8))
        }
    }
}

// MARK: - Extensions

extension NoteType {
    var iconName: String {
        switch self {
        case .note: return "doc.text"
        case .task: return "checkmark.circle"
        case .issue: return "exclamationmark.triangle"
        }
    }
    
    var createDisplayName: String {
        switch self {
        case .note: return "Note"
        case .task: return "Task"
        case .issue: return "Issue"
        }
    }
    
    var titlePlaceholder: String {
        switch self {
        case .note: return "Note title"
        case .task: return "Task title"
        case .issue: return "Issue title"
        }
    }
    
    var contentPlaceholder: String {
        switch self {
        case .note: return "Write your note here..."
        case .task: return "Describe the task..."
        case .issue: return "Describe the issue..."
        }
    }
}

#Preview {
    CreateView()
}
