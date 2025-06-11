//
//  Task.swift
//  NoteFlow
//
//  Created by toan on 11/6/25.
//

import Foundation
import SwiftData

@Model
final class Task {
    var id: UUID
    var title: String
    var content: String
    var priority: Priority
    var status: TaskStatus
    var tags: [String]
    var dueDate: Date?
    var createdAt: Date
    var updatedAt: Date
    
    init(title: String, content: String, priority: Priority = .medium, status: TaskStatus = .todo, tags: [String] = [], dueDate: Date? = nil) {
        self.id = UUID()
        self.title = title
        self.content = content
        self.priority = priority
        self.status = status
        self.tags = tags
        self.dueDate = dueDate
        self.createdAt = Date()
        self.updatedAt = Date()
    }
}
