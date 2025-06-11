//
//  SearchView.swift
//  NoteFlow
//
//  Created by AI Assistant on 11/6/25.
//

import SwiftUI
import Foundation

struct SearchView: View {
    @Environment(\.dismiss) private var dismiss
    @Binding var query: String
    @State private var searchResults: [SearchResult] = []
    @State private var isSearching = false
    
    var body: some View {
        VStack(spacing: 0) {
            // Search header
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.gray)
                
                TextField("Search notes, tasks, issues...", text: $query)
                    .disableAutocorrection(true)
                    .onChange(of: query) {
                    performSearch()
                }
                
                if !query.isEmpty {
                    Button {
                        query = ""
                        searchResults = []
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.gray)
                    }
                }
                
                Button("Cancel") {
                    dismiss()
                }
                .foregroundColor(.blue)
            }
            .padding()
            .background(Color.secondary.opacity(0.05))
            
            // Results list
            ZStack {
                if isSearching {
                    ProgressView()
                } else if searchResults.isEmpty && !query.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "magnifyingglass")
                            .font(.largeTitle)
                            .foregroundColor(.gray)
                        Text("No results found")
                            .font(.headline)
                        Text("Try searching with different keywords")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                    }
                    .padding()
                } else {
                    List {
                        ForEach(searchResults) { result in
                            SearchResultRow(result: result)
                        }
                    }
                    .listStyle(PlainListStyle())
                }
            }
        }
        .navigationBarHidden(true)
    }
    
    private func performSearch() {
        guard !query.isEmpty else {
            searchResults = []
            return
        }
        
        isSearching = true
        
        // Simulate search delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            // Mock search results - in a real app, you would search your data source
            searchResults = [
                SearchResult(id: UUID().uuidString, title: "Note: \(query)", type: .note),
                SearchResult(id: UUID().uuidString, title: "Task: \(query)", type: .task),
                SearchResult(id: UUID().uuidString, title: "Issue: \(query)", type: .issue)
            ]
            isSearching = false
        }
    }
}

// MARK: - Supporting Types
struct SearchResult: Identifiable {
    let id: String
    let title: String
    let type: ItemType
}

enum ItemType: String {
    case note, task, issue
}

// MARK: - Search Result Row
struct SearchResultRow: View {
    let result: SearchResult
    
    var body: some View {
        HStack {
            Image(systemName: iconName)
                .foregroundColor(iconColor)
                .frame(width: 30)
            
            Text(result.title)
                .lineLimit(1)
            
            Spacer()
            
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundColor(.gray)
        }
        .padding(.vertical, 8)
    }
    
    private var iconName: String {
        switch result.type {
        case .note: return "note.text"
        case .task: return "checkmark.square"
        case .issue: return "exclamationmark.triangle"
        }
    }
    
    private var iconColor: Color {
        switch result.type {
        case .note: return .blue
        case .task: return .green
        case .issue: return .orange
        }
    }
}

#Preview {
    SearchView(query: .constant("test"))
}
