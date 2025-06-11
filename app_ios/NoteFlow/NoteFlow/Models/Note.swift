//
//  Note.swift
//  NoteFlow
//
//  Created by toan on 11/6/25.
//

import Foundation
import SwiftData

@Model
final class Note {
    var id: UUID
    var title: String
    var content: String
    var tags: [String]
    var createdAt: Date
    var updatedAt: Date
    var type: NoteType
    
    init(title: String, content: String, tags: [String] = [], type: NoteType = .note) {
        self.id = UUID()
        self.title = title
        self.content = content
        self.tags = tags
        self.createdAt = Date()
        self.updatedAt = Date()
        self.type = type
    }
}

enum NoteType: String, CaseIterable, Codable {
    case note = "note"
    case task = "task"
    case issue = "issue"
    
    var displayName: String {
        switch self {
        case .note: return "Notes"
        case .task: return "Tasks"
        case .issue: return "Issues"
        }
    }
}

enum TaskStatus: String, CaseIterable, Codable {
    case todo = "todo"
    case inProgress = "in_progress"
    case done = "done"
    
    var displayName: String {
        switch self {
        case .todo: return "To Do"
        case .inProgress: return "In Progress"
        case .done: return "Done"
        }
    }
}

enum Priority: String, CaseIterable, Codable {
    case low = "low"
    case medium = "medium"
    case high = "high"
    
    var displayName: String {
        switch self {
        case .low: return "Low"
        case .medium: return "Medium"
        case .high: return "High"
        }
    }
    
    var color: String {
        switch self {
        case .low: return "green"
        case .medium: return "orange"
        case .high: return "red"
        }
    }
}
