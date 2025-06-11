//
//  CommentRowView.swift
//  NoteFlow
//
//  Created by GitHub Copilot
//

import SwiftUI

struct CommentRowView: View {
    let comment: Comment
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            // User avatar placeholder
            Circle()
                .fill(Color.gray.opacity(0.3))
                .frame(width: 32, height: 32)
                .overlay(
                    Text("U")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.secondary)
                )
            
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text("User")
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
    CommentRowView(comment: Comment(
        noteId: UUID(),
        userId: UUID(),
        content: "This is a sample comment for preview purposes. It shows how the comment layout will look in the app."
    ))
    .padding()
}
