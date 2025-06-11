//
//  NotificationCenterView.swift
//  NoteFlow
//
//  Created by GitHub Copilot
//

import SwiftUI

struct NotificationCenterView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var notifications: [NotificationItem] = []
    @State private var selectedFilter: NotificationFilter = .all
    @State private var showingSettings = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Filter Tabs
                filterTabsView
                
                // Notifications List
                if filteredNotifications.isEmpty {
                    emptyStateView
                } else {
                    notificationsListView
                }
            }
            .background(Color(.systemBackground))
            .navigationTitle("Notifications")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Close") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Menu {
                        Button("Mark All as Read") {
                            markAllAsRead()
                        }
                        
                        Button("Clear All") {
                            clearAllNotifications()
                        }
                        
                        Divider()
                        
                        Button("Notification Settings") {
                            showingSettings = true
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                            .font(.system(size: 18))
                    }
                }
            }
        }
        .sheet(isPresented: $showingSettings) {
            NotificationSettingsDetailView()
        }
        .onAppear {
            loadNotifications()
        }
    }
    
    // MARK: - Filter Tabs
    private var filterTabsView: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 16) {
                ForEach(NotificationFilter.allCases, id: \.self) { filter in
                    Button(action: {
                        selectedFilter = filter
                    }) {
                        VStack(spacing: 4) {
                            Text(filter.displayName)
                                .font(.system(size: 16, weight: selectedFilter == filter ? .semibold : .medium))
                                .foregroundColor(selectedFilter == filter ? .blue : .secondary)
                            
                            if selectedFilter == filter {
                                Rectangle()
                                    .fill(Color.blue)
                                    .frame(height: 2)
                                    .frame(maxWidth: .infinity)
                            } else {
                                Rectangle()
                                    .fill(Color.clear)
                                    .frame(height: 2)
                            }
                        }
                        .frame(minWidth: 80)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .padding(.horizontal, 16)
        }
        .padding(.bottom, 8)
        .background(Color(.systemBackground))
        .overlay(
            Rectangle()
                .fill(Color(.separator))
                .frame(height: 0.5),
            alignment: .bottom
        )
    }
    
    // MARK: - Notifications List
    private var notificationsListView: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(sortedDateKeys, id: \.self) { date in
                    notificationSection(for: date)
                }
            }
        }
    }
    
    private var sortedDateKeys: [Date] {
        Array(groupedNotifications.keys.sorted(by: >))
    }
    
    private func notificationSection(for date: Date) -> some View {
        Section {
            notificationRows(for: date)
        } header: {
            sectionHeader(for: date)
        }
    }
    
    private func notificationRows(for date: Date) -> some View {
        let notifications = groupedNotifications[date] ?? []
        return ForEach(notifications, id: \.id) { notification in
            VStack(spacing: 0) {
                NotificationRowView(notification: notification) { action in
                    handleNotificationAction(notification, action: action)
                }
                .padding(.horizontal, 16)
                
                if notification.id != notifications.last?.id {
                    Divider()
                        .padding(.leading, 70)
                }
            }
        }
    }
    
    private func sectionHeader(for date: Date) -> some View {
        HStack {
            Text(dateFormatter.string(from: date))
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.secondary)
                .textCase(.uppercase)
            
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(Color(.systemBackground))
    }
    
    // MARK: - Empty State
    private var emptyStateView: some View {
        VStack(spacing: 20) {
            Image(systemName: selectedFilter.emptyIcon)
                .font(.system(size: 48))
                .foregroundColor(.secondary)
            
            Text(selectedFilter.emptyTitle)
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(.primary)
            
            Text(selectedFilter.emptyMessage)
                .font(.system(size: 16))
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    // MARK: - Computed Properties
    private var filteredNotifications: [NotificationItem] {
        switch selectedFilter {
        case .all:
            return notifications
        case .unread:
            return notifications.filter { !$0.isRead }
        case .mentions:
            return notifications.filter { $0.type == .mention }
        case .assignments:
            return notifications.filter { $0.type == .taskAssigned || $0.type == .issueAssigned }
        case .comments:
            return notifications.filter { $0.type == .commentAdded }
        case .deadlines:
            return notifications.filter { $0.type == .deadlineReminder }
        }
    }
    
    private var groupedNotifications: [Date: [NotificationItem]] {
        Dictionary(grouping: filteredNotifications) { notification in
            Calendar.current.startOfDay(for: notification.createdAt)
        }
    }
    
    private var dateFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE, MMM d"
        return formatter
    }
    
    // MARK: - Helper Functions
    private func loadNotifications() {
        // TODO: Load from data source
        notifications = NotificationItem.mockNotifications
    }
    
    private func markAllAsRead() {
        for i in 0..<notifications.count {
            notifications[i].isRead = true
        }
        // TODO: Update in data source
    }
    
    private func clearAllNotifications() {
        notifications.removeAll()
        // TODO: Update in data source
    }
    
    private func handleNotificationAction(_ notification: NotificationItem, action: NotificationAction) {
        switch action {
        case .markAsRead:
            if let index = notifications.firstIndex(where: { $0.id == notification.id }) {
                notifications[index].isRead = true
            }
        case .delete:
            notifications.removeAll { $0.id == notification.id }
        case .navigate:
            // TODO: Navigate to relevant item
            dismiss()
        }
    }
}

// MARK: - Notification Row View

struct NotificationRowView: View {
    let notification: NotificationItem
    let onAction: (NotificationAction) -> Void
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            // Icon
            Image(systemName: notification.type.iconName)
                .font(.system(size: 20))
                .foregroundColor(.white)
                .frame(width: 40, height: 40)
                .background(notification.type.color)
                .clipShape(Circle())
            
            // Content
            VStack(alignment: .leading, spacing: 8) {
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(notification.title)
                            .font(.system(size: 16, weight: notification.isRead ? .medium : .semibold))
                            .foregroundColor(.primary)
                            .multilineTextAlignment(.leading)
                        
                        if !notification.message.isEmpty {
                            Text(notification.message)
                                .font(.system(size: 14))
                                .foregroundColor(.secondary)
                                .lineLimit(3)
                                .multilineTextAlignment(.leading)
                        }
                        
                        HStack(spacing: 8) {
                            Text(RelativeDateTimeFormatter().localizedString(for: notification.createdAt, relativeTo: Date()))
                                .font(.system(size: 12))
                                .foregroundColor(.secondary)
                            
                            if !notification.isRead {
                                Circle()
                                    .fill(Color.blue)
                                    .frame(width: 6, height: 6)
                            }
                        }
                    }
                    
                    Spacer()
                    
                    // Action Menu
                    Menu {
                        if !notification.isRead {
                            Button("Mark as Read") {
                                onAction(.markAsRead)
                            }
                        }
                        
                        Button("Delete", role: .destructive) {
                            onAction(.delete)
                        }
                    } label: {
                        Image(systemName: "ellipsis")
                            .font(.system(size: 16))
                            .foregroundColor(.secondary)
                            .frame(width: 24, height: 24)
                    }
                }
                
                // Action Buttons (if any)
                if let actionButton = notification.actionButton {
                    Button(action: {
                        onAction(.navigate)
                    }) {
                        Text(actionButton)
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.blue)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color.blue.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
        }
        .padding(.vertical, 12)
        .contentShape(Rectangle())
        .onTapGesture {
            onAction(.navigate)
        }
        .opacity(notification.isRead ? 0.7 : 1.0)
    }
}

// MARK: - Notification Settings Detail View

struct NotificationSettingsDetailView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var pushNotifications = true
    @State private var emailNotifications = false
    @State private var mentionNotifications = true
    @State private var assignmentNotifications = true
    @State private var commentNotifications = true
    @State private var deadlineNotifications = true
    @State private var dailyDigest = false
    @State private var quietHours = false
    @State private var quietStartTime = Date()
    @State private var quietEndTime = Date()
    
    var body: some View {
        NavigationView {
            Form {
                Section("Push Notifications") {
                    Toggle("Enable Push Notifications", isOn: $pushNotifications)
                    
                    if pushNotifications {
                        Toggle("Mentions", isOn: $mentionNotifications)
                        Toggle("Task Assignments", isOn: $assignmentNotifications)
                        Toggle("Comments", isOn: $commentNotifications)
                        Toggle("Deadline Reminders", isOn: $deadlineNotifications)
                    }
                }
                
                Section("Email Notifications") {
                    Toggle("Enable Email Notifications", isOn: $emailNotifications)
                    
                    if emailNotifications {
                        Toggle("Daily Digest", isOn: $dailyDigest)
                    }
                }
                
                Section("Quiet Hours") {
                    Toggle("Enable Quiet Hours", isOn: $quietHours)
                    
                    if quietHours {
                        DatePicker("Start Time", selection: $quietStartTime, displayedComponents: .hourAndMinute)
                        DatePicker("End Time", selection: $quietEndTime, displayedComponents: .hourAndMinute)
                    }
                }
                
                Section {
                    Button("Reset to Defaults") {
                        resetToDefaults()
                    }
                    .foregroundColor(.blue)
                }
            }
            .navigationTitle("Notification Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        saveSettings()
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
        }
    }
    
    private func resetToDefaults() {
        pushNotifications = true
        emailNotifications = false
        mentionNotifications = true
        assignmentNotifications = true
        commentNotifications = true
        deadlineNotifications = true
        dailyDigest = false
        quietHours = false
    }
    
    private func saveSettings() {
        // TODO: Save settings to data source
        print("Notification settings saved")
    }
}

// MARK: - Supporting Models

struct NotificationItem {
    let id: UUID
    var title: String
    var message: String
    let type: NotificationType
    var isRead: Bool
    let createdAt: Date
    let actionButton: String?
    
    static let mockNotifications: [NotificationItem] = [
        NotificationItem(
            id: UUID(),
            title: "John Doe mentioned you",
            message: "in \"Team Meeting Notes\": Could you review the Q4 roadmap section?",
            type: .mention,
            isRead: false,
            createdAt: Date().addingTimeInterval(-3600),
            actionButton: "View Note"
        ),
        NotificationItem(
            id: UUID(),
            title: "New task assigned",
            message: "\"Complete UI mockups\" has been assigned to you by Jane Smith",
            type: .taskAssigned,
            isRead: false,
            createdAt: Date().addingTimeInterval(-7200),
            actionButton: "View Task"
        ),
        NotificationItem(
            id: UUID(),
            title: "Task due tomorrow",
            message: "\"User testing session\" is due tomorrow at 2:00 PM",
            type: .deadlineReminder,
            isRead: true,
            createdAt: Date().addingTimeInterval(-10800),
            actionButton: "View Task"
        ),
        NotificationItem(
            id: UUID(),
            title: "New comment added",
            message: "Mike Wilson commented on \"Database schema review\"",
            type: .commentAdded,
            isRead: true,
            createdAt: Date().addingTimeInterval(-14400),
            actionButton: "View Comments"
        ),
        NotificationItem(
            id: UUID(),
            title: "Issue assigned to you",
            message: "\"Login page not responsive\" needs your attention",
            type: .issueAssigned,
            isRead: true,
            createdAt: Date().addingTimeInterval(-86400),
            actionButton: "View Issue"
        )
    ]
}

enum NotificationType {
    case mention
    case taskAssigned
    case issueAssigned
    case commentAdded
    case deadlineReminder
    case teamInvite
    
    var iconName: String {
        switch self {
        case .mention: return "at"
        case .taskAssigned: return "checkmark.circle"
        case .issueAssigned: return "exclamationmark.triangle"
        case .commentAdded: return "bubble.left"
        case .deadlineReminder: return "clock"
        case .teamInvite: return "person.badge.plus"
        }
    }
    
    var color: Color {
        switch self {
        case .mention: return .blue
        case .taskAssigned: return .orange
        case .issueAssigned: return .red
        case .commentAdded: return .green
        case .deadlineReminder: return .purple
        case .teamInvite: return .indigo
        }
    }
}

enum NotificationFilter: String, CaseIterable {
    case all = "all"
    case unread = "unread"
    case mentions = "mentions"
    case assignments = "assignments"
    case comments = "comments"
    case deadlines = "deadlines"
    
    var displayName: String {
        switch self {
        case .all: return "All"
        case .unread: return "Unread"
        case .mentions: return "Mentions"
        case .assignments: return "Assignments"
        case .comments: return "Comments"
        case .deadlines: return "Deadlines"
        }
    }
    
    var emptyIcon: String {
        switch self {
        case .all: return "bell.slash"
        case .unread: return "checkmark.circle"
        case .mentions: return "at"
        case .assignments: return "checkmark.circle"
        case .comments: return "bubble.left"
        case .deadlines: return "clock"
        }
    }
    
    var emptyTitle: String {
        switch self {
        case .all: return "No notifications"
        case .unread: return "All caught up!"
        case .mentions: return "No mentions"
        case .assignments: return "No assignments"
        case .comments: return "No comments"
        case .deadlines: return "No deadlines"
        }
    }
    
    var emptyMessage: String {
        switch self {
        case .all: return "You're all set! New notifications will appear here."
        case .unread: return "You've read all your notifications."
        case .mentions: return "No one has mentioned you recently."
        case .assignments: return "No new tasks or issues assigned to you."
        case .comments: return "No new comments on your items."
        case .deadlines: return "No upcoming deadlines to worry about."
        }
    }
}

enum NotificationAction {
    case markAsRead
    case delete
    case navigate
}

#Preview {
    NotificationCenterView()
}
