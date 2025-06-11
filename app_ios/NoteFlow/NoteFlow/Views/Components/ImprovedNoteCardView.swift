//
//  ImprovedNoteCardView.swift
//  NoteFlow
//
//  Updated by GitHub Copilot
//

import SwiftUI

struct ImprovedNoteCardView: View {
    let note: MockNote
    let viewMode: ViewMode
    
    var body: some View {
        switch viewMode {
        case .list:
            listView
        case .grid:
            gridView
        case .kanban:
            listView // Kanban uses same as list for notes
        }
    }
    
    private var listView: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(note.title)
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.primary)
                            .lineLimit(2)
                        
                        Spacer()
                        
                        if note.isPinned {
                            Image(systemName: "pin.fill")
                                .font(.system(size: 12))
                                .foregroundColor(.orange)
                        }
                    }
                    
                    Text(note.content)
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                        .lineLimit(3)
                }
                
                Spacer()
                
                Button(action: {
                    // More actions
                }) {
                    Image(systemName: "ellipsis")
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                        .frame(width: 24, height: 24)
                }
            }
            
            // Footer
            HStack {
                // Tags
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(note.tags, id: \.self) { tag in
                            Text(tag)
                                .font(.system(size: 12, weight: .medium))
                                .foregroundColor(.blue)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.blue.opacity(0.1))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                    }
                    .padding(.horizontal, 1)
                }
                
                Spacer()
                
                // Time
                Text(timeAgoString(from: note.createdAt))
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
            }
        }
        .padding(16)
        .background(Color.secondary.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.secondary.opacity(0.1), lineWidth: 1)
        )
    }
    
    private var gridView: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Header
            HStack {
                if note.isPinned {
                    Image(systemName: "pin.fill")
                        .font(.system(size: 10))
                        .foregroundColor(.orange)
                }
                
                Spacer()
                
                Button(action: {
                    // More actions
                }) {
                    Image(systemName: "ellipsis")
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                }
            }
            
            // Content
            VStack(alignment: .leading, spacing: 6) {
                Text(note.title)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.primary)
                    .lineLimit(2)
                
                Text(note.content)
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
                    .lineLimit(4)
            }
            
            Spacer()
            
            // Footer
            VStack(alignment: .leading, spacing: 6) {
                // Tags (first two only)
                if !note.tags.isEmpty {
                    HStack(spacing: 4) {
                        ForEach(Array(note.tags.prefix(2)), id: \.self) { tag in
                            Text(tag)
                                .font(.system(size: 10, weight: .medium))
                                .foregroundColor(.blue)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.blue.opacity(0.1))
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                        }
                        
                        if note.tags.count > 2 {
                            Text("+\(note.tags.count - 2)")
                                .font(.system(size: 10))
                                .foregroundColor(.secondary)
                        }
                    }
                }
                
                // Time
                Text(timeAgoString(from: note.createdAt))
                    .font(.system(size: 10))
                    .foregroundColor(.secondary)
            }
        }
        .padding(12)
        .frame(height: 160)
        .background(Color.secondary.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.secondary.opacity(0.1), lineWidth: 1)
        )
    }
    
    private func timeAgoString(from date: Date) -> String {
        let interval = Date().timeIntervalSince(date)
        
        if interval < 60 {
            return "Just now"
        } else if interval < 3600 {
            let minutes = Int(interval / 60)
            return "\(minutes)m ago"
        } else if interval < 86400 {
            let hours = Int(interval / 3600)
            return "\(hours)h ago"
        } else {
            let days = Int(interval / 86400)
            return "\(days)d ago"
        }
    }
}

#Preview {
    VStack(spacing: 16) {
        ImprovedNoteCardView(
            note: MockNote(
                title: "Team Meeting Notes",
                content: "Reviewed Q4 roadmap and discussed key priorities for the upcoming sprint.",
                tags: ["meeting", "team", "roadmap"],
                isPinned: true
            ),
            viewMode: .list
        )
        
        HStack(spacing: 16) {
            ImprovedNoteCardView(
                note: MockNote(
                    title: "Project Ideas",
                    content: "Some interesting concepts to explore for the next quarter including AI integration.",
                    tags: ["ideas", "brainstorm", "ai"],
                    isPinned: false
                ),
                viewMode: .grid
            )
            
            ImprovedNoteCardView(
                note: MockNote(
                    title: "Research Notes",
                    content: "Key findings from user interviews and usability testing sessions.",
                    tags: ["research", "ux"],
                    isPinned: false
                ),
                viewMode: .grid
            )
        }
    }
    .padding()
    .background(Color.secondary.opacity(0.1))
}
