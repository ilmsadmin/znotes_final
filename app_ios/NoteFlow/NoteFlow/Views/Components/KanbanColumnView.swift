//
//  KanbanColumnView.swift
//  NoteFlow
//
//  Created by toan on 11/6/25.
//

import SwiftUI

struct KanbanColumnView: View {
    let title: String
    let tasks: [MockTask]
    let count: Int
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack {
                Text(title)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.primary)
                
                Spacer()
                
                Text("\(count)")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(.secondary)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.secondary.opacity(0.2))
                    .clipShape(Capsule())
            }
            
            // Tasks
            LazyVStack(spacing: 12) {
                ForEach(tasks, id: \.id) { task in
                    KanbanTaskCardView(task: task)
                }
            }
            
            Spacer()
        }
        .frame(width: 280)
        .padding(16)
        .background(Color.secondary.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

struct KanbanTaskCardView: View {
    let task: MockTask
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Priority and menu
            HStack {
                HStack(spacing: 6) {
                    Circle()
                        .fill(task.priority.color)
                        .frame(width: 8, height: 8)
                    
                    Text(task.priority.title)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                Menu {
                    Button("Edit") {}
                    Button("Move") {}
                    Button("Delete", role: .destructive) {}
                } label: {
                    Image(systemName: "ellipsis")
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                }
            }
            
            // Title
            Text(task.title)
                .font(.system(size: 15, weight: .medium))
                .foregroundColor(.primary)
                .lineLimit(2)
                .multilineTextAlignment(.leading)
            
            // Content
            if !task.content.isEmpty {
                Text(task.content)
                    .font(.system(size: 13))
                    .foregroundColor(.secondary)
                    .lineLimit(3)
                    .multilineTextAlignment(.leading)
            }
            
            // Tags
            if !task.tags.isEmpty {
                HStack(spacing: 6) {
                    ForEach(Array(task.tags.prefix(2)), id: \.self) { tag in
                        Text(tag)
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.blue)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 3)
                            .background(Color.blue.opacity(0.1))
                            .clipShape(Capsule())
                    }
                    
                    if task.tags.count > 2 {
                        Text("+\(task.tags.count - 2)")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.secondary)
                    }
                }
            }
            
            // Due date
            if let dueDate = task.dueDate {
                HStack {
                    Image(systemName: "calendar")
                        .font(.system(size: 11))
                        .foregroundColor(.secondary)
                    
                    Text(dueDate, style: .date)
                        .font(.system(size: 11))
                        .foregroundColor(.secondary)
                    
                    Spacer()
                }
            }
        }
        .padding(12)
        .background(Color.secondary.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.secondary.opacity(0.3), lineWidth: 0.5)
        )
    }
}

#Preview {
    let todoTasks = MockData.shared.sampleTasks.filter { $0.status == .todo }
    let inProgressTasks = MockData.shared.sampleTasks.filter { $0.status == .inProgress }
    
    return ScrollView(.horizontal) {
        HStack(spacing: 16) {
            KanbanColumnView(
                title: "To Do",
                tasks: Array(todoTasks),
                count: todoTasks.count
            )
            
            KanbanColumnView(
                title: "In Progress", 
                tasks: Array(inProgressTasks),
                count: inProgressTasks.count
            )
        }
        .padding()
    }
    .background(Color.secondary.opacity(0.02))
}
