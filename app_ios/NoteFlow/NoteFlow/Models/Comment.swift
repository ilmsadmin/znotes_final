//
//  Comment.swift
//  NoteFlow
//
//  Created by GitHub Copilot
//

import Foundation
import SwiftData

@Model
final class Comment {
    var id: UUID
    var noteId: UUID
    var userId: UUID
    var content: String
    var createdAt: Date
    var updatedAt: Date
    var parentCommentId: UUID?
    
    init(noteId: UUID, userId: UUID, content: String, parentCommentId: UUID? = nil) {
        self.id = UUID()
        self.noteId = noteId
        self.userId = userId
        self.content = content
        self.createdAt = Date()
        self.updatedAt = Date()
        self.parentCommentId = parentCommentId
    }
}
