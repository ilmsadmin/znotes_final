//
//  NoteCardView.swift
//  NoteFlow
//
//  Created by toan on 11/6/25.
//

import SwiftUI
import SwiftData

struct SimpleNoteCardView: View {
    let note: MockNote
    var isCompact: Bool = false
    
    var body: some View {
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
                            .background(Color.secondary.opacity(0.1))
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
                                .background(Color.secondary.opacity(0.1))
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                        }
                        
                        Button(action: {}) {
                            Image(systemName: "square.and.arrow.up")
                                .font(.system(size: 14))
                                .foregroundColor(.secondary)
                                .frame(width: 32, height: 32)
                                .background(Color.secondary.opacity(0.1))
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                        }
                    }
                }
            }
        }
        .padding(16)
        .background(Color.secondary.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.secondary.opacity(0.2), lineWidth: 0.5)
        )
    }
}

#Preview {
    VStack(spacing: 16) {
        // Create MockNote objects with correct parameters
        SimpleNoteCardView(
            note: MockNote(
                title: "Meeting Notes",
                content: "Discussed Q2 roadmap and upcoming features.",
                tags: ["work", "meeting", "planning"]
            )
        )
        SimpleNoteCardView(
            note: MockNote(
                title: "Shopping List", 
                content: "Milk, eggs, bread, vegetables, fruits",
                tags: ["personal", "shopping"]
            ),
            isCompact: true
        )
    }
    .padding()
    .background(Color.secondary.opacity(0.1))
}
