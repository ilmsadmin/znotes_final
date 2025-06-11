//
//  KanbanBoardView.swift
//  NoteFlow
//
//  Created by GitHub Copilot
//

import SwiftUI

struct KanbanBoardView: View {
    @State private var tasks = MockData.shared.sampleTasks
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(alignment: .top, spacing: 16) {
                // To Do Column
                KanbanColumn(
                    title: "To Do",
                    tasks: tasks.filter { $0.status == .todo },
                    color: Color.gray
                ) { task in
                    moveTask(task, to: .todo)
                }
                
                // In Progress Column
                KanbanColumn(
                    title: "In Progress",
                    tasks: tasks.filter { $0.status == .inProgress },
                    color: Color.orange
                ) { task in
                    moveTask(task, to: .inProgress)
                }
                
                // Review Column
                KanbanColumn(
                    title: "Review",
                    tasks: tasks.filter { $0.status == .review },
                    color: Color.blue
                ) { task in
                    moveTask(task, to: .review)
                }
                
                // Done Column
                KanbanColumn(
                    title: "Done",
                    tasks: tasks.filter { $0.status == .done },
                    color: Color.green
                ) { task in
                    moveTask(task, to: .done)
                }
            }
            .padding(.horizontal, 20)
        }
        .padding(.vertical, 8)
    }
    
    private func moveTask(_ task: MockTask, to status: MockTaskStatus) {
        if let index = tasks.firstIndex(where: { $0.id == task.id }) {
            tasks[index] = MockTask(
                id: task.id,
                title: task.title,
                content: task.content,
                priority: task.priority,
                status: status,
                tags: task.tags,
                dueDate: task.dueDate,
                assignee: task.assignee
            )
        }
    }
}

struct KanbanColumn: View {
    let title: String
    let tasks: [MockTask]
    let color: Color
    let onDrop: (MockTask) -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Column Header
            HStack {
                Text(title)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.primary)
                
                Spacer()
                
                Text("\(tasks.count)")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(color)
                    .clipShape(Capsule())
            }
            
            // Tasks
            LazyVStack(spacing: 12) {
                ForEach(tasks, id: \.id) { task in
                    KanbanTaskCard(task: task)
                        .draggable(task)
                }
            }
            
            // Add Task Button
            Button(action: {
                // TODO: Add new task functionality
            }) {
                HStack {
                    Image(systemName: "plus")
                        .font(.system(size: 14))
                    
                    Text("Add Task")
                        .font(.system(size: 14, weight: .medium))
                }
                .foregroundColor(.secondary)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(Color.secondary.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }
            
            Spacer()
        }
        .frame(width: 280)
        .padding(16)
        .background(Color.secondary.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .dropDestination(for: MockTask.self) { items, location in
            guard let task = items.first else { return false }
            onDrop(task)
            return true
        }
    }
}

struct KanbanTaskCard: View {
    let task: MockTask
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header with priority
            HStack {
                Circle()
                    .fill(task.priority.color)
                    .frame(width: 8, height: 8)
                
                Text(task.title)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.primary)
                    .lineLimit(2)
                
                Spacer()
                
                Menu {
                    Button("Edit") { }
                    Button("Move") { }
                    Button("Delete", role: .destructive) { }
                } label: {
                    Image(systemName: "ellipsis")
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                }
            }
            
            // Content
            if !task.content.isEmpty {
                Text(task.content)
                    .font(.system(size: 14))
                    .foregroundColor(.secondary)
                    .lineLimit(3)
            }
            
            // Tags
            if !task.tags.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(Array(task.tags.prefix(3)), id: \.self) { tag in
                            Text(tag)
                                .font(.system(size: 10, weight: .medium))
                                .foregroundColor(.secondary)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.secondary.opacity(0.15))
                                .clipShape(Capsule())
                        }
                    }
                    .padding(.horizontal, 2)
                }
            }
            
            // Footer
            HStack {
                // Assignee
                if !task.assignee.isEmpty {
                    HStack(spacing: 6) {
                        Circle()
                            .fill(Color.blue)
                            .frame(width: 20, height: 20)
                            .overlay(
                                Text(String(task.assignee.prefix(1)))
                                    .font(.system(size: 10, weight: .semibold))
                                    .foregroundColor(.white)
                            )
                        
                        Text(task.assignee)
                            .font(.system(size: 12))
                            .foregroundColor(.secondary)
                            .lineLimit(1)
                    }
                }
                
                Spacer()
                
                // Due date
                if let dueDate = task.dueDate {
                    HStack(spacing: 4) {
                        Image(systemName: "calendar")
                            .font(.system(size: 10))
                            .foregroundColor(.secondary)
                        
                        Text(dueDate, style: .date)
                            .font(.system(size: 10))
                            .foregroundColor(.secondary)
                    }
                }
            }
        }
        .padding(12)
        .background(Color.secondary.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
    }
}

#Preview {
    KanbanBoardView()
}
