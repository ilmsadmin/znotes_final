//
//  TaskCardView.swift
//  NoteFlow
//
//  Updated by GitHub Copilot
//

import SwiftUI

struct TaskCardView: View {
    let task: MockTask
    let viewMode: ViewMode
    
    var body: some View {
        switch viewMode {
        case .list:
            listView
        case .grid:
            gridView
        case .kanban:
            kanbanView
        }
    }
    
    private var listView: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                // Priority indicator
                Circle()
                    .fill(task.priority.color)
                    .frame(width: 8, height: 8)
                
                // Status badge
                Text(task.status.title)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(task.status.color)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(task.status.color.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                
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
            
            // Task content
            VStack(alignment: .leading, spacing: 8) {
                Text(task.title)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.primary)
                    .lineLimit(2)
                
                Text(task.content)
                    .font(.system(size: 14))
                    .foregroundColor(.secondary)
                    .lineLimit(3)
            }
            
            // Footer
            HStack {
                // Assignee
                HStack(spacing: 6) {
                    Circle()
                        .fill(Color.blue.opacity(0.2))
                        .frame(width: 20, height: 20)
                        .overlay(
                            Text(String(task.assignee.prefix(1)))
                                .font(.system(size: 10, weight: .semibold))
                                .foregroundColor(.blue)
                        )
                    
                    Text(task.assignee)
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                // Due date
                if let dueDate = task.dueDate {
                    HStack(spacing: 4) {
                        Image(systemName: "calendar")
                            .font(.system(size: 10))
                            .foregroundColor(.secondary)
                        
                        Text(dueDateString(from: dueDate))
                            .font(.system(size: 12))
                            .foregroundColor(isOverdue(dueDate) ? .red : .secondary)
                    }
                }
            }
            
            // Tags
            if !task.tags.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(task.tags, id: \.self) { tag in
                            Text(tag)
                                .font(.system(size: 12, weight: .medium))
                                .foregroundColor(.purple)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.purple.opacity(0.1))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                    }
                    .padding(.horizontal, 1)
                }
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
                Circle()
                    .fill(task.priority.color)
                    .frame(width: 6, height: 6)
                
                Text(task.status.title)
                    .font(.system(size: 10, weight: .medium))
                    .foregroundColor(task.status.color)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(task.status.color.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                
                Spacer()
                
                Button(action: {}) {
                    Image(systemName: "ellipsis")
                        .font(.system(size: 10))
                        .foregroundColor(.secondary)
                }
            }
            
            // Content
            VStack(alignment: .leading, spacing: 6) {
                Text(task.title)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.primary)
                    .lineLimit(2)
                
                Text(task.content)
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
                    .lineLimit(3)
            }
            
            Spacer()
            
            // Footer
            VStack(alignment: .leading, spacing: 8) {
                // Assignee
                HStack(spacing: 6) {
                    Circle()
                        .fill(Color.blue.opacity(0.2))
                        .frame(width: 16, height: 16)
                        .overlay(
                            Text(String(task.assignee.prefix(1)))
                                .font(.system(size: 8, weight: .semibold))
                                .foregroundColor(.blue)
                        )
                    
                    Text(task.assignee)
                        .font(.system(size: 10))
                        .foregroundColor(.secondary)
                        .lineLimit(1)
                }
                
                // Due date
                if let dueDate = task.dueDate {
                    Text(dueDateString(from: dueDate))
                        .font(.system(size: 10))
                        .foregroundColor(isOverdue(dueDate) ? .red : .secondary)
                }
                
                // Tags (first tag only)
                if let firstTag = task.tags.first {
                    Text(firstTag)
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(.purple)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.purple.opacity(0.1))
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }
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
    
    private var kanbanView: some View {
        VStack(alignment: .leading, spacing: 10) {
            // Priority and more button
            HStack {
                Circle()
                    .fill(task.priority.color)
                    .frame(width: 6, height: 6)
                
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
                Text(task.title)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.primary)
                    .lineLimit(2)
                
                Text(task.content)
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }
            
            // Footer
            HStack {
                // Assignee
                Circle()
                    .fill(Color.blue.opacity(0.2))
                    .frame(width: 20, height: 20)
                    .overlay(
                        Text(String(task.assignee.prefix(1)))
                            .font(.system(size: 10, weight: .semibold))
                            .foregroundColor(.blue)
                    )
                
                Spacer()
                
                // Due date
                if let dueDate = task.dueDate {
                    Text(dueDateString(from: dueDate))
                        .font(.system(size: 10))
                        .foregroundColor(isOverdue(dueDate) ? .red : .secondary)
                }
            }
        }
        .padding(12)
        .background(Color.secondary.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .shadow(color: Color.black.opacity(0.05), radius: 1, x: 0, y: 1)
    }
    
    // MARK: - Helper Functions
    private func dueDateString(from date: Date) -> String {
        let calendar = Calendar.current
        
        if calendar.isDateInToday(date) {
            return "Today"
        } else if calendar.isDateInTomorrow(date) {
            return "Tomorrow"
        } else if calendar.isDateInYesterday(date) {
            return "Yesterday"
        } else {
            let formatter = DateFormatter()
            formatter.dateFormat = "MMM d"
            return formatter.string(from: date)
        }
    }
    
    private func isOverdue(_ date: Date) -> Bool {
        return date < Date()
    }
}

#Preview {
    VStack(spacing: 16) {
        TaskCardView(
            task: MockData.shared.sampleTasks[0],
            viewMode: ViewMode.list
        )
        
        HStack(spacing: 16) {
            TaskCardView(
                task: MockData.shared.sampleTasks[1],
                viewMode: ViewMode.grid
            )
            
            TaskCardView(
                task: MockData.shared.sampleTasks[2],
                viewMode: ViewMode.grid
            )
        }
    }
    .padding()
    .background(Color.secondary.opacity(0.1))
}
