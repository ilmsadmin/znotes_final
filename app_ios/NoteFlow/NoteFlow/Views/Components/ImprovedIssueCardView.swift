//
//  ImprovedIssueCardView.swift
//  NoteFlow
//
//  Created by GitHub Copilot
//

import SwiftUI

struct ImprovedIssueCardView: View {
    let issue: MockNote
    let viewMode: ViewMode
    
    // Computed properties to simulate issue-specific properties
    private var issueStatus: String {
        // Derive status from tags or use default
        if issue.tags.contains("resolved") || issue.tags.contains("closed") {
            return "Resolved"
        } else if issue.tags.contains("in-progress") {
            return "In Progress"
        } else {
            return "Open"
        }
    }
    
    private var issueStatusColor: Color {
        switch issueStatus {
        case "Resolved": return .green
        case "In Progress": return .orange
        default: return .red
        }
    }
    
    private var issuePriority: String {
        if issue.tags.contains("critical") {
            return "Critical"
        } else if issue.tags.contains("high") {
            return "High"
        } else if issue.tags.contains("medium") {
            return "Medium"
        } else {
            return "Low"
        }
    }
    
    private var issuePriorityColor: Color {
        switch issuePriority {
        case "Critical": return .red
        case "High": return .orange
        case "Medium": return .yellow
        default: return .green
        }
    }
    
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
    
    // MARK: - List View
    private var listView: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                HStack(spacing: 8) {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .font(.system(size: 16))
                        .foregroundColor(issueStatusColor)
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text(issue.title)
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.primary)
                            .lineLimit(1)
                        
                        Text("Reported \(issue.createdAt.formatted(date: .abbreviated, time: .omitted))")
                            .font(.system(size: 12))
                            .foregroundColor(.secondary)
                    }
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    // Status badge
                    Text(issueStatus)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(.white)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(issueStatusColor)
                        .clipShape(Capsule())
                    
                    // Priority indicator
                    HStack(spacing: 4) {
                        Circle()
                            .fill(issuePriorityColor)
                            .frame(width: 6, height: 6)
                        
                        Text(issuePriority)
                            .font(.system(size: 11))
                            .foregroundColor(.secondary)
                    }
                }
            }
            
            // Content
            Text(issue.content)
                .font(.system(size: 14))
                .foregroundColor(.secondary)
                .lineLimit(3)
                .multilineTextAlignment(.leading)
            
            // Footer
            HStack {
                // Tags
                if !issue.tags.isEmpty {
                    HStack(spacing: 6) {
                        ForEach(Array(issue.tags.prefix(3)), id: \.self) { tag in
                            Text(tag)
                                .font(.system(size: 10, weight: .medium))
                                .foregroundColor(.secondary)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.secondary.opacity(0.2))
                                .clipShape(Capsule())
                        }
                        
                        if issue.tags.count > 3 {
                            Text("+\(issue.tags.count - 3)")
                                .font(.system(size: 10, weight: .medium))
                                .foregroundColor(.secondary)
                        }
                    }
                }
                
                Spacer()
                
                // Action button
                Menu {
                    Button("Change Status") { }
                    Button("Assign") { }
                    Button("Edit") { }
                    Button("Delete", role: .destructive) { }
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
        .padding(16)
        .background(Color.secondary.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.secondary.opacity(0.3), lineWidth: 0.5)
        )
    }
    
    // MARK: - Grid View
    private var gridView: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header with icon and status
            HStack {
                Image(systemName: "exclamationmark.triangle.fill")
                    .font(.system(size: 14))
                    .foregroundColor(issueStatusColor)
                
                Spacer()
                
                Text(issueStatus)
                    .font(.system(size: 10, weight: .medium))
                    .foregroundColor(.white)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(issueStatusColor)
                    .clipShape(Capsule())
            }
            
            // Title
            Text(issue.title)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(.primary)
                .lineLimit(2)
                .multilineTextAlignment(.leading)
            
            // Content
            Text(issue.content)
                .font(.system(size: 12))
                .foregroundColor(.secondary)
                .lineLimit(2)
                .multilineTextAlignment(.leading)
            
            Spacer()
            
            // Footer
            VStack(alignment: .leading, spacing: 8) {
                // Priority indicator
                HStack(spacing: 4) {
                    Circle()
                        .fill(issuePriorityColor)
                        .frame(width: 6, height: 6)
                    
                    Text(issuePriority)
                        .font(.system(size: 10))
                        .foregroundColor(.secondary)
                }
                
                // Tags
                if !issue.tags.isEmpty {
                    HStack(spacing: 4) {
                        ForEach(Array(issue.tags.prefix(2)), id: \.self) { tag in
                            Text(tag)
                                .font(.system(size: 8, weight: .semibold))
                                .foregroundColor(.blue)
                                .padding(.horizontal, 4)
                                .padding(.vertical, 2)
                                .background(Color.blue.opacity(0.1))
                                .clipShape(Capsule())
                        }
                        
                        if issue.tags.count > 2 {
                            Text("+\(issue.tags.count - 2)")
                                .font(.system(size: 8, weight: .medium))
                                .foregroundColor(.secondary)
                        }
                    }
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
    
    // MARK: - Kanban View
    private var kanbanView: some View {
        VStack(alignment: .leading, spacing: 10) {
            // Header
            HStack {
                Image(systemName: "exclamationmark.triangle.fill")
                    .font(.system(size: 12))
                    .foregroundColor(issueStatusColor)
                
                Spacer()
                
                Text(issuePriority)
                    .font(.system(size: 9, weight: .medium))
                    .foregroundColor(.white)
                    .padding(.horizontal, 4)
                    .padding(.vertical, 2)
                    .background(issuePriorityColor)
                    .clipShape(Capsule())
            }
            
            // Title
            Text(issue.title)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(.primary)
                .lineLimit(2)
                .multilineTextAlignment(.leading)
            
            // Content
            Text(issue.content)
                .font(.system(size: 11))
                .foregroundColor(.secondary)
                .lineLimit(2)
                .multilineTextAlignment(.leading)
            
            // Tags
            if !issue.tags.isEmpty {
                HStack(spacing: 4) {
                    ForEach(Array(issue.tags.prefix(2)), id: \.self) { tag in
                        Text(tag)
                            .font(.system(size: 8, weight: .medium))
                            .foregroundColor(.blue)
                            .padding(.horizontal, 4)
                            .padding(.vertical, 2)
                            .background(Color.blue.opacity(0.1))
                            .clipShape(Capsule())
                    }
                }
            }
            
            // Date
            Text(issue.createdAt.formatted(date: .abbreviated, time: .omitted))
                .font(.system(size: 10))
                .foregroundColor(.secondary)
        }
        .padding(10)
        .background(Color.secondary.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(Color.secondary.opacity(0.3), lineWidth: 0.5)
        )
    }
}

#Preview {
    VStack(spacing: 16) {
        ImprovedIssueCardView(issue: MockData.shared.sampleIssues[0], viewMode: .list)
        ImprovedIssueCardView(issue: MockData.shared.sampleIssues[1], viewMode: .grid)
        ImprovedIssueCardView(issue: MockData.shared.sampleIssues[2], viewMode: .kanban)
    }
    .padding()
}
