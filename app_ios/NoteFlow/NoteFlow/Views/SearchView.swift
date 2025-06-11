//
//  SearchView.swift
//  NoteFlow
//
//  Created by GitHub Copilot
//

import SwiftUI

struct SearchView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var searchText = ""
    @State private var selectedFilters: Set<SearchFilter> = []
    @State private var selectedContentType: ContentType = .all
    @State private var selectedTags: Set<String> = []
    @State private var showingFilters = false
    @State private var searchResults: [SearchResult] = []
    @State private var isSearching = false
    @State private var recentSearches: [String] = []
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Search Header
                searchHeader
                
                // Content
                if searchText.isEmpty {
                    emptySearchView
                } else {
                    searchResultsView
                }
            }
            .background(Color(.systemBackground))
            .navigationBarHidden(true)
            .sheet(isPresented: $showingFilters) {
                SearchFiltersView(
                    selectedFilters: $selectedFilters,
                    selectedContentType: $selectedContentType,
                    selectedTags: $selectedTags
                )
            }
        }
        .onAppear {
            loadRecentSearches()
        }
    }
    
    // MARK: - Search Header
    private var searchHeader: some View {
        VStack(spacing: 16) {
            // Navigation and Search Bar
            HStack {
                Button(action: {
                    dismiss()
                }) {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(.blue)
                }
                
                // Search Bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.secondary)
                        .font(.system(size: 16))
                    
                    TextField("Search notes, tasks, issues...", text: $searchText)
                        .font(.system(size: 16))
                        .submitLabel(.search)
                        .onSubmit {
                            performSearch()
                        }
                        .onChange(of: searchText) { oldValue, newValue in
                            if !newValue.isEmpty {
                                performSearch()
                            }
                        }
                    
                    if !searchText.isEmpty {
                        Button(action: {
                            searchText = ""
                            searchResults = []
                        }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.secondary)
                                .font(.system(size: 16))
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Color(.systemGray6))
                .clipShape(RoundedRectangle(cornerRadius: 20))
                
                Button(action: {
                    showingFilters = true
                }) {
                    Image(systemName: selectedFilters.isEmpty ? "line.3.horizontal.decrease" : "line.3.horizontal.decrease.circle.fill")
                        .font(.system(size: 18))
                        .foregroundColor(selectedFilters.isEmpty ? .secondary : .blue)
                }
            }
            .padding(.horizontal, 16)
            
            // Active Filters
            if !selectedFilters.isEmpty || selectedContentType != .all || !selectedTags.isEmpty {
                activeFiltersView
            }
        }
        .padding(.top, 8)
        .padding(.bottom, 16)
        .background(Color(.systemBackground))
        .overlay(
            Rectangle()
                .fill(Color(.separator))
                .frame(height: 0.5),
            alignment: .bottom
        )
    }
    
    // MARK: - Active Filters
    private var activeFiltersView: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                // Content Type Filter
                if selectedContentType != .all {
                    FilterChip(
                        title: selectedContentType.displayName,
                        icon: selectedContentType.iconName
                    ) {
                        selectedContentType = .all
                        performSearch()
                    }
                }
                
                // Other Filters
                ForEach(Array(selectedFilters), id: \.self) { filter in
                    FilterChip(
                        title: filter.displayName,
                        icon: filter.iconName
                    ) {
                        selectedFilters.remove(filter)
                        performSearch()
                    }
                }
                
                // Tag Filters
                ForEach(Array(selectedTags), id: \.self) { tag in
                    FilterChip(
                        title: tag,
                        icon: "tag"
                    ) {
                        selectedTags.remove(tag)
                        performSearch()
                    }
                }
            }
            .padding(.horizontal, 16)
        }
    }
    
    // MARK: - Empty Search View
    private var emptySearchView: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Recent Searches
                if !recentSearches.isEmpty {
                    recentSearchesSection
                }
                
                // Quick Filters
                quickFiltersSection
                
                // Tips Section
                searchTipsSection
            }
            .padding(.horizontal, 16)
            .padding(.top, 24)
        }
    }
    
    // MARK: - Recent Searches
    private var recentSearchesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Recent Searches")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.primary)
                
                Spacer()
                
                Button("Clear") {
                    recentSearches.removeAll()
                    saveRecentSearches()
                }
                .font(.system(size: 14))
                .foregroundColor(.blue)
            }
            
            LazyVStack(spacing: 8) {
                ForEach(recentSearches, id: \.self) { search in
                    Button(action: {
                        searchText = search
                        performSearch()
                    }) {
                        HStack {
                            Image(systemName: "clock.arrow.circlepath")
                                .font(.system(size: 16))
                                .foregroundColor(.secondary)
                            
                            Text(search)
                                .font(.system(size: 16))
                                .foregroundColor(.primary)
                                .multilineTextAlignment(.leading)
                            
                            Spacer()
                            
                            Button(action: {
                                removeRecentSearch(search)
                            }) {
                                Image(systemName: "xmark")
                                    .font(.system(size: 12))
                                    .foregroundColor(.secondary)
                            }
                        }
                        .padding(.vertical, 12)
                        .padding(.horizontal, 16)
                        .background(Color(.secondarySystemBackground))
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
        }
    }
    
    // MARK: - Quick Filters
    private var quickFiltersSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Quick Filters")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.primary)
            
            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 12) {
                QuickFilterButton(
                    title: "My Notes",
                    icon: "doc.text",
                    color: .blue
                ) {
                    applyQuickFilter(.myNotes)
                }
                
                QuickFilterButton(
                    title: "Assigned Tasks",
                    icon: "checkmark.circle",
                    color: .orange
                ) {
                    applyQuickFilter(.assignedTasks)
                }
                
                QuickFilterButton(
                    title: "High Priority",
                    icon: "exclamationmark.triangle",
                    color: .red
                ) {
                    applyQuickFilter(.highPriority)
                }
                
                QuickFilterButton(
                    title: "Due Soon",
                    icon: "calendar",
                    color: .purple
                ) {
                    applyQuickFilter(.dueSoon)
                }
                
                QuickFilterButton(
                    title: "Recent",
                    icon: "clock",
                    color: .green
                ) {
                    applyQuickFilter(.recent)
                }
                
                QuickFilterButton(
                    title: "Tagged",
                    icon: "tag",
                    color: .indigo
                ) {
                    applyQuickFilter(.tagged)
                }
            }
        }
    }
    
    // MARK: - Search Tips
    private var searchTipsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Search Tips")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.primary)
            
            VStack(alignment: .leading, spacing: 12) {
                SearchTipRow(
                    tip: "Use quotes for exact phrases",
                    example: "\"project meeting\""
                )
                
                SearchTipRow(
                    tip: "Search by tag",
                    example: "#urgent"
                )
                
                SearchTipRow(
                    tip: "Search by content type",
                    example: "type:task"
                )
                
                SearchTipRow(
                    tip: "Search by date",
                    example: "created:today"
                )
            }
            .padding(16)
            .background(Color(.secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }
    
    // MARK: - Search Results View
    private var searchResultsView: some View {
        VStack(spacing: 0) {
            // Results Header
            HStack {
                if isSearching {
                    ProgressView()
                        .scaleEffect(0.8)
                    Text("Searching...")
                        .font(.system(size: 16))
                        .foregroundColor(.secondary)
                } else {
                    Text("\(searchResults.count) results")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.primary)
                }
                
                Spacer()
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color(.systemBackground))
            
            // Results List
            if searchResults.isEmpty && !isSearching {
                noResultsView
            } else {
                ScrollView {
                    LazyVStack(spacing: 12) {
                        ForEach(searchResults, id: \.id) { result in
                            SearchResultRow(result: result) {
                                // Navigate to detail view
                                navigateToDetail(result)
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 16)
                }
            }
        }
    }
    
    // MARK: - No Results View
    private var noResultsView: some View {
        VStack(spacing: 16) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 48))
                .foregroundColor(.secondary)
            
            Text("No results found")
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(.primary)
            
            Text("Try adjusting your search terms or filters")
                .font(.system(size: 16))
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            
            Button("Clear Filters") {
                clearAllFilters()
            }
            .font(.system(size: 16, weight: .medium))
            .foregroundColor(.blue)
            .padding(.top, 8)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.horizontal, 32)
    }
    
    // MARK: - Helper Functions
    private func performSearch() {
        guard !searchText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            searchResults = []
            return
        }
        
        isSearching = true
        
        // Add to recent searches
        addToRecentSearches(searchText)
        
        // Simulate search delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            // TODO: Implement actual search logic
            searchResults = mockSearchResults()
            isSearching = false
        }
    }
    
    private func mockSearchResults() -> [SearchResult] {
        // Mock search results based on current filters and search text
        var results: [SearchResult] = []
        
        // Add mock notes
        for note in MockData.shared.sampleNotes {
            if note.title.localizedCaseInsensitiveContains(searchText) ||
               note.content.localizedCaseInsensitiveContains(searchText) {
                results.append(SearchResult(
                    id: note.id,
                    title: note.title,
                    content: note.content,
                    type: .note,
                    createdAt: note.createdAt,
                    tags: note.tags,
                    highlightedText: highlightText(in: note.content)
                ))
            }
        }
        
        // Add mock tasks if no content type filter or tasks selected
        if selectedContentType == .all || selectedContentType == .task {
            for task in MockData.shared.sampleTasks {
                if task.title.localizedCaseInsensitiveContains(searchText) ||
                   task.content.localizedCaseInsensitiveContains(searchText) {
                    results.append(SearchResult(
                        id: task.id,
                        title: task.title,
                        content: task.content,
                        type: .task,
                        createdAt: task.createdAt,
                        tags: task.tags,
                        highlightedText: highlightText(in: task.content)
                    ))
                }
            }
        }
        
        return results.sorted { $0.createdAt > $1.createdAt }
    }
    
    private func highlightText(in content: String) -> String {
        // Simple highlighting - in a real app, this would be more sophisticated
        return content.replacingOccurrences(
            of: searchText,
            with: "**\(searchText)**",
            options: .caseInsensitive
        )
    }
    
    private func applyQuickFilter(_ filter: QuickFilter) {
        switch filter {
        case .myNotes:
            selectedContentType = .note
        case .assignedTasks:
            selectedContentType = .task
            selectedFilters.insert(.assignedToMe)
        case .highPriority:
            selectedFilters.insert(.highPriority)
        case .dueSoon:
            selectedFilters.insert(.dueSoon)
        case .recent:
            selectedFilters.insert(.recentlyModified)
        case .tagged:
            selectedFilters.insert(.hasAttachments)
        }
        
        if !searchText.isEmpty {
            performSearch()
        }
    }
    
    private func clearAllFilters() {
        selectedFilters.removeAll()
        selectedContentType = .all
        selectedTags.removeAll()
        if !searchText.isEmpty {
            performSearch()
        }
    }
    
    private func navigateToDetail(_ result: SearchResult) {
        // TODO: Navigate to appropriate detail view
        print("Navigate to \(result.type.rawValue): \(result.title)")
    }
    
    private func addToRecentSearches(_ search: String) {
        let trimmedSearch = search.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmedSearch.isEmpty else { return }
        
        // Remove if already exists
        recentSearches.removeAll { $0 == trimmedSearch }
        
        // Add to front
        recentSearches.insert(trimmedSearch, at: 0)
        
        // Limit to 10 recent searches
        if recentSearches.count > 10 {
            recentSearches.removeLast()
        }
        
        saveRecentSearches()
    }
    
    private func removeRecentSearch(_ search: String) {
        recentSearches.removeAll { $0 == search }
        saveRecentSearches()
    }
    
    private func loadRecentSearches() {
        // TODO: Load from UserDefaults
        recentSearches = ["team meeting", "ui design", "project roadmap"]
    }
    
    private func saveRecentSearches() {
        // TODO: Save to UserDefaults
    }
}

// MARK: - Supporting Views

struct FilterChip: View {
    let title: String
    let icon: String
    let onRemove: () -> Void
    
    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 12))
            
            Text(title)
                .font(.system(size: 12, weight: .medium))
            
            Button(action: onRemove) {
                Image(systemName: "xmark")
                    .font(.system(size: 10, weight: .bold))
            }
        }
        .foregroundColor(.blue)
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(Color.blue.opacity(0.1))
        .clipShape(Capsule())
    }
}

struct QuickFilterButton: View {
    let title: String
    let icon: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 24))
                    .foregroundColor(color)
                
                Text(title)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.primary)
                    .multilineTextAlignment(.center)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(Color(.secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct SearchTipRow: View {
    let tip: String
    let example: String
    
    var body: some View {
        HStack(alignment: .top) {
            Image(systemName: "lightbulb")
                .font(.system(size: 14))
                .foregroundColor(.yellow)
                .frame(width: 20)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(tip)
                    .font(.system(size: 14))
                    .foregroundColor(.primary)
                
                Text(example)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.blue)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(Color.blue.opacity(0.1))
                    .clipShape(Capsule())
            }
        }
    }
}

struct SearchResultRow: View {
    let result: SearchResult
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Image(systemName: result.type.iconName)
                        .font(.system(size: 16))
                        .foregroundColor(result.type.color)
                        .frame(width: 24)
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text(result.title)
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.primary)
                            .multilineTextAlignment(.leading)
                        
                        Text(result.type.displayName + " • " + RelativeDateTimeFormatter().localizedString(for: result.createdAt, relativeTo: Date()))
                            .font(.system(size: 12))
                            .foregroundColor(.secondary)
                    }
                    
                    Spacer()
                }
                
                Text(result.content)
                    .font(.system(size: 14))
                    .foregroundColor(.secondary)
                    .lineLimit(3)
                    .multilineTextAlignment(.leading)
                
                if !result.tags.isEmpty {
                    HStack(spacing: 6) {
                        ForEach(Array(result.tags.prefix(3)), id: \.self) { tag in
                            Text(tag)
                                .font(.system(size: 10, weight: .medium))
                                .foregroundColor(.blue)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 3)
                                .background(Color.blue.opacity(0.1))
                                .clipShape(Capsule())
                        }
                        
                        if result.tags.count > 3 {
                            Text("+\(result.tags.count - 3)")
                                .font(.system(size: 10, weight: .medium))
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }
            .padding(16)
            .background(Color(.secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Search Filters View

struct SearchFiltersView: View {
    @Binding var selectedFilters: Set<SearchFilter>
    @Binding var selectedContentType: ContentType
    @Binding var selectedTags: Set<String>
    @Environment(\.dismiss) private var dismiss
    
    private let availableTags = ["meeting", "urgent", "design", "development", "planning", "review", "bug", "feature"]
    
    var body: some View {
        NavigationView {
            List {
                // Content Type Section
                Section("Content Type") {
                    ForEach(ContentType.allCases, id: \.self) { type in
                        HStack {
                            Image(systemName: type.iconName)
                                .foregroundColor(type.color)
                                .frame(width: 24)
                            
                            Text(type.displayName)
                                .font(.system(size: 16))
                            
                            Spacer()
                            
                            if selectedContentType == type {
                                Image(systemName: "checkmark")
                                    .foregroundColor(.blue)
                            }
                        }
                        .contentShape(Rectangle())
                        .onTapGesture {
                            selectedContentType = type
                        }
                    }
                }
                
                // Filters Section
                Section("Filters") {
                    ForEach(SearchFilter.allCases, id: \.self) { filter in
                        HStack {
                            Image(systemName: filter.iconName)
                                .foregroundColor(.blue)
                                .frame(width: 24)
                            
                            VStack(alignment: .leading, spacing: 2) {
                                Text(filter.displayName)
                                    .font(.system(size: 16))
                                
                                Text(filter.description)
                                    .font(.system(size: 14))
                                    .foregroundColor(.secondary)
                            }
                            
                            Spacer()
                            
                            if selectedFilters.contains(filter) {
                                Image(systemName: "checkmark")
                                    .foregroundColor(.blue)
                            }
                        }
                        .contentShape(Rectangle())
                        .onTapGesture {
                            if selectedFilters.contains(filter) {
                                selectedFilters.remove(filter)
                            } else {
                                selectedFilters.insert(filter)
                            }
                        }
                    }
                }
                
                // Tags Section
                Section("Tags") {
                    LazyVGrid(columns: [
                        GridItem(.adaptive(minimum: 80))
                    ], spacing: 8) {
                        ForEach(availableTags, id: \.self) { tag in
                            Button(action: {
                                if selectedTags.contains(tag) {
                                    selectedTags.remove(tag)
                                } else {
                                    selectedTags.insert(tag)
                                }
                            }) {
                                Text(tag)
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundColor(selectedTags.contains(tag) ? .white : .blue)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(selectedTags.contains(tag) ? Color.blue : Color.blue.opacity(0.1))
                                    .clipShape(Capsule())
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    .padding(.vertical, 8)
                }
            }
            .navigationTitle("Search Filters")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Clear All") {
                        selectedFilters.removeAll()
                        selectedContentType = .all
                        selectedTags.removeAll()
                    }
                    .foregroundColor(.red)
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
        }
    }
}

// MARK: - Supporting Models

enum ContentType: String, CaseIterable {
    case all = "all"
    case note = "note"
    case task = "task"
    case issue = "issue"
    
    var displayName: String {
        switch self {
        case .all: return "All"
        case .note: return "Notes"
        case .task: return "Tasks"
        case .issue: return "Issues"
        }
    }
    
    var iconName: String {
        switch self {
        case .all: return "doc.on.doc"
        case .note: return "doc.text"
        case .task: return "checkmark.circle"
        case .issue: return "exclamationmark.triangle"
        }
    }
    
    var color: Color {
        switch self {
        case .all: return .primary
        case .note: return .blue
        case .task: return .orange
        case .issue: return .red
        }
    }
}

enum SearchFilter: String, CaseIterable {
    case assignedToMe = "assigned_to_me"
    case createdByMe = "created_by_me"
    case highPriority = "high_priority"
    case dueSoon = "due_soon"
    case overdue = "overdue"
    case recentlyModified = "recently_modified"
    case hasAttachments = "has_attachments"
    case hasComments = "has_comments"
    
    var displayName: String {
        switch self {
        case .assignedToMe: return "Assigned to me"
        case .createdByMe: return "Created by me"
        case .highPriority: return "High priority"
        case .dueSoon: return "Due soon"
        case .overdue: return "Overdue"
        case .recentlyModified: return "Recently modified"
        case .hasAttachments: return "Has attachments"
        case .hasComments: return "Has comments"
        }
    }
    
    var description: String {
        switch self {
        case .assignedToMe: return "Tasks assigned to you"
        case .createdByMe: return "Items you created"
        case .highPriority: return "High priority items"
        case .dueSoon: return "Due within 7 days"
        case .overdue: return "Past due date"
        case .recentlyModified: return "Modified in last 7 days"
        case .hasAttachments: return "Items with files"
        case .hasComments: return "Items with comments"
        }
    }
    
    var iconName: String {
        switch self {
        case .assignedToMe: return "person.circle"
        case .createdByMe: return "person.badge.plus"
        case .highPriority: return "exclamationmark.triangle"
        case .dueSoon: return "clock"
        case .overdue: return "calendar.badge.exclamationmark"
        case .recentlyModified: return "clock.arrow.circlepath"
        case .hasAttachments: return "paperclip"
        case .hasComments: return "bubble.left.and.bubble.right"
        }
    }
}

enum QuickFilter {
    case myNotes
    case assignedTasks
    case highPriority
    case dueSoon
    case recent
    case tagged
}

struct SearchResult {
    let id: UUID
    let title: String
    let content: String
    let type: ContentType
    let createdAt: Date
    let tags: [String]
    let highlightedText: String
}

#Preview {
    SearchView()
}
