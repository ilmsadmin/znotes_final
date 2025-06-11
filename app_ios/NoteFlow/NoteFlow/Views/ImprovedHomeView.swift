//
//  ImprovedHomeView.swift
//  NoteFlow
//
//  Created by GitHub Copilot
//

import SwiftUI

struct ImprovedHomeView: View {
    @State private var selectedTab: HomeTab = .notes
    @State private var selectedView: ViewMode = .list
    @State private var searchText = ""
    @State private var showingCreateView = false
    @State private var showingSettings = false
    @State private var showingNotifications = false
    @State private var showingSearch = false
    @State private var greeting = "Good morning"
    @State private var userName = "Alice"
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Header with greeting and actions
                headerView
                
                // Search bar
                searchBarView
                
                // Tab selector
                tabSelectorView
                
                // View mode controls
                viewModeControlsView
                
                // Content area
                contentView
            }
            .background(Color.secondary.opacity(0.05))
            .navigationBarHidden(true)
        }
        .overlay(fabButton, alignment: .bottomTrailing)
        .sheet(isPresented: $showingCreateView) {
            CreateView()
        }
        .sheet(isPresented: $showingSettings) {
            SettingsView()
        }
        .sheet(isPresented: $showingNotifications) {
            NotificationCenterView()
        }
        .fullScreenCover(isPresented: $showingSearch) {
            SearchView(query: .constant(""))
        }
        .onAppear {
            updateGreeting()
        }
    }
    
    // MARK: - Header View
    private var headerView: some View {
        VStack(spacing: 0) {
            // Status bar area
            Rectangle()
                .fill(Color.secondary.opacity(0.1))
                .frame(height: 0)
                .ignoresSafeArea(.container, edges: .top)
            
            // Main header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("\(greeting), \(userName)")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(.primary)
                    
                    Text("Let's organize your work today")
                        .font(.system(size: 16))
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                HStack(spacing: 12) {
                    // Search button
                    Button(action: {
                        showingSearch = true
                    }) {
                        Image(systemName: "magnifyingglass")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(.secondary)
                            .frame(width: 44, height: 44)
                            .background(Color.secondary.opacity(0.1))
                            .clipShape(Circle())
                    }
                    
                    // Notifications button
                    Button(action: {
                        showingNotifications = true
                    }) {
                        ZStack {
                            Image(systemName: "bell")
                                .font(.system(size: 18, weight: .medium))
                                .foregroundColor(.secondary)
                            
                            // Notification badge
                            Circle()
                                .fill(Color.red)
                                .frame(width: 8, height: 8)
                                .offset(x: 8, y: -8)
                        }
                        .frame(width: 44, height: 44)
                        .background(Color.secondary.opacity(0.1))
                        .clipShape(Circle())
                    }
                    
                    // Profile button
                    Button(action: {
                        showingSettings = true
                    }) {
                        Circle()
                            .fill(LinearGradient(
                                gradient: Gradient(colors: [Color.blue, Color.purple]),
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ))
                            .frame(width: 44, height: 44)
                            .overlay(
                                Text("A")
                                    .font(.system(size: 18, weight: .semibold))
                                    .foregroundColor(.white)
                            )
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 16)
            .background(Color.primary.colorInvert())
        }
    }
    
    // MARK: - Search Bar View
    private var searchBarView: some View {
        Button(action: {
            showingSearch = true
        }) {
            HStack(spacing: 12) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 16))
                    .foregroundColor(.secondary)
                
                Text("Search notes, tasks, issues...")
                    .font(.system(size: 16))
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                
                Image(systemName: "line.3.horizontal.decrease.circle")
                    .font(.system(size: 16))
                    .foregroundColor(.secondary)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.secondary.opacity(0.1))
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
        .padding(.horizontal, 20)
        .padding(.bottom, 16)
    }
    
    // MARK: - Tab Selector View
    private var tabSelectorView: some View {
        HStack(spacing: 0) {
            ForEach(HomeTab.allCases, id: \.self) { tab in
                Button(action: {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        selectedTab = tab
                    }
                }) {
                    VStack(spacing: 8) {
                        HStack(spacing: 8) {
                            Image(systemName: tab.iconName)
                                .font(.system(size: 16, weight: .medium))
                            
                            Text(tab.displayName)
                                .font(.system(size: 16, weight: .medium))
                            
                            // Count badge
                            Text("\(getItemCount(for: tab))")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(selectedTab == tab ? .white : .secondary)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 2)
                                .background(
                                    Capsule()
                                        .fill(selectedTab == tab ? Color.white.opacity(0.2) : Color.secondary.opacity(0.2))
                                )
                        }
                        .foregroundColor(selectedTab == tab ? .white : .secondary)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .background(
                            RoundedRectangle(cornerRadius: 12)
                                .fill(selectedTab == tab ? Color.blue : Color.clear)
                        )
                    }
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.horizontal, 20)
        .padding(.bottom, 16)
    }
    
    // MARK: - View Mode Controls
    private var viewModeControlsView: some View {
        HStack {
            Text(selectedTab.displayName)
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(.primary)
            
            Spacer()
            
            // View mode selector
            HStack(spacing: 4) {
                ForEach(ViewMode.allCases, id: \.self) { mode in
                    viewModeButton(for: mode)
                }
            }
            .padding(2)
            .background(Color.secondary.opacity(0.1))
            .clipShape(RoundedRectangle(cornerRadius: 10))
        }
        .padding(.horizontal, 20)
        .padding(.bottom, 16)
    }
    
    // MARK: - Content View
    private var contentView: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                switch selectedTab {
                case .notes:
                    notesContent
                case .tasks:
                    tasksContent
                case .issues:
                    issuesContent
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 100) // Space for FAB
        }
    }
    
    // MARK: - Content Sections
    private var notesContent: some View {
        ForEach(MockData.shared.sampleNotes, id: \.id) { note in
            ImprovedNoteCardView(note: note, viewMode: selectedView)
        }
    }
    
    private var tasksContent: some View {
        Group {
            if selectedView == .kanban {
                KanbanBoardView()
            } else {
                // For tasks, we also use kanban layout as it's the most appropriate
                KanbanBoardView()
            }
        }
    }
    
    private var issuesContent: some View {
        ForEach(MockData.shared.sampleIssues, id: \.id) { issue in
            ImprovedIssueCardView(issue: issue, viewMode: selectedView)
        }
    }
    
    // MARK: - Floating Action Button
    private var fabButton: some View {
        Button(action: {
            showingCreateView = true
        }) {
            Image(systemName: "plus")
                .font(.system(size: 24, weight: .semibold))
                .foregroundColor(.white)
                .frame(width: 56, height: 56)
                .background(
                    LinearGradient(
                        gradient: Gradient(colors: [Color.blue, Color.purple]),
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .clipShape(Circle())
                .shadow(color: Color.black.opacity(0.15), radius: 8, x: 0, y: 4)
        }
        .padding(.trailing, 20)
        .padding(.bottom, 90)
    }
    
    // MARK: - Helper Functions
    private func updateGreeting() {
        let hour = Calendar.current.component(.hour, from: Date())
        switch hour {
        case 5..<12:
            greeting = "Good morning"
        case 12..<17:
            greeting = "Good afternoon"
        case 17..<22:
            greeting = "Good evening"
        default:
            greeting = "Good night"
        }
    }
    
    private func getItemCount(for tab: HomeTab) -> Int {
        switch tab {
        case .notes:
            return MockData.shared.sampleNotes.count
        case .tasks:
            return MockData.shared.sampleTasks.count
        case .issues:
            return MockData.shared.sampleIssues.count
        }
    }
    
    private func viewModeButton(for mode: ViewMode) -> some View {
        let isSelected = selectedView == mode
        let backgroundColor = isSelected ? Color.blue : Color.clear
        let foregroundColor = isSelected ? Color.white : Color.secondary
        
        return Button(action: {
            withAnimation(.easeInOut(duration: 0.2)) {
                selectedView = mode
            }
        }) {
            Image(systemName: mode.iconName)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(foregroundColor)
                .frame(width: 32, height: 32)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(backgroundColor)
                )
        }
    }
}

// MARK: - Supporting Types

enum HomeTab: CaseIterable {
    case notes, tasks, issues
    
    var displayName: String {
        switch self {
        case .notes: return "Notes"
        case .tasks: return "Tasks"
        case .issues: return "Issues"
        }
    }
    
    var iconName: String {
        switch self {
        case .notes: return "note.text"
        case .tasks: return "checkmark.circle"
        case .issues: return "exclamationmark.triangle"
        }
    }
}

#Preview {
    ImprovedHomeView()
}
