//
//  GroupSetupView.swift
//  NoteFlow
//
//  Created by GitHub Copilot
//

import SwiftUI

struct GroupSetupView: View {
    @EnvironmentObject var coordinator: AppCoordinator
    @Environment(\.dismiss) private var dismiss
    @State private var isJoiningTeam = true
    @State private var teamName = "TechCorp"
    @State private var teamDomain = "techcorp.com"
    @State private var memberCount = 12
    @State private var userRole = "Member"
    @State private var isLoading = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 32) {
                    // Header
                    VStack(spacing: 16) {
                        // Team Icon
                        Circle()
                            .fill(Color.blue.opacity(0.1))
                            .frame(width: 80, height: 80)
                            .overlay(
                                Image(systemName: "person.2.fill")
                                    .font(.system(size: 32))
                                    .foregroundColor(.blue)
                            )
                        
                        if isJoiningTeam {
                            Text("Welcome to \(teamName) Team!")
                                .font(.system(size: 24, weight: .bold))
                                .foregroundColor(.primary)
                            
                            Text("We found an existing team for your domain. You'll be added as a member.")
                                .font(.system(size: 16))
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                                .padding(.horizontal, 20)
                        } else {
                            Text("Create Your Team")
                                .font(.system(size: 24, weight: .bold))
                                .foregroundColor(.primary)
                            
                            Text("Set up a new workspace for your organization.")
                                .font(.system(size: 16))
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                                .padding(.horizontal, 20)
                        }
                    }
                    .padding(.top, 40)
                    
                    // Team Details Card
                    VStack(spacing: 16) {
                        VStack(spacing: 12) {
                            HStack {
                                Text("Team Details")
                                    .font(.system(size: 18, weight: .semibold))
                                    .foregroundColor(.primary)
                                Spacer()
                            }
                            
                            // Team Name
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Team Name")
                                        .font(.system(size: 14))
                                        .foregroundColor(.secondary)
                                    Text(teamName + " (\(teamDomain))")
                                        .font(.system(size: 16, weight: .medium))
                                        .foregroundColor(.primary)
                                }
                                Spacer()
                            }
                            
                            // Member Count
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Members")
                                        .font(.system(size: 14))
                                        .foregroundColor(.secondary)
                                    Text("\(memberCount) people")
                                        .font(.system(size: 16, weight: .medium))
                                        .foregroundColor(.primary)
                                }
                                Spacer()
                            }
                            
                            // User Role
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Your Role")
                                        .font(.system(size: 14))
                                        .foregroundColor(.secondary)
                                    HStack {
                                        Text(userRole)
                                            .font(.system(size: 14, weight: .medium))
                                            .padding(.horizontal, 12)
                                            .padding(.vertical, 6)
                                            .background(Color.blue.opacity(0.1))
                                            .foregroundColor(.blue)
                                            .clipShape(RoundedRectangle(cornerRadius: 16))
                                        Spacer()
                                    }
                                }
                                Spacer()
                            }
                        }
                    }
                    .padding(20)
                    .background(Color(.systemGray6))
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .padding(.horizontal, 20)
                    
                    Spacer(minLength: 40)
                }
            }
            .navigationTitle("Join Your Team")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Back") {
                        dismiss()
                    }
                }
            }
            .safeAreaInset(edge: .bottom) {
                VStack(spacing: 12) {
                    // Primary Action Button
                    Button(action: {
                        joinTeam()
                    }) {
                        HStack {
                            if isLoading {
                                ProgressView()
                                    .scaleEffect(0.8)
                                    .foregroundColor(.white)
                            } else {
                                Image(systemName: "person.badge.plus")
                                    .font(.system(size: 16, weight: .semibold))
                                
                                Text(isJoiningTeam ? "Join Team" : "Create Team")
                                    .font(.system(size: 18, weight: .semibold))
                            }
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(Color.blue)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                    }
                    .disabled(isLoading)
                    
                    // Secondary Action Button
                    Button(action: {
                        createNewTeam()
                    }) {
                        Text(isJoiningTeam ? "Create New Team Instead" : "Join Existing Team")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundColor(.blue)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 20)
                .background(Color(.systemBackground))
            }
        }
    }
    
    // MARK: - Helper Functions
    private func joinTeam() {
        isLoading = true
        
        // TODO: Implement team joining logic
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            isLoading = false
            coordinator.completeGroupSetup()
        }
    }
    
    private func createNewTeam() {
        isJoiningTeam.toggle()
        if !isJoiningTeam {
            userRole = "Admin"
            memberCount = 1
        } else {
            userRole = "Member"
            memberCount = 12
        }
    }
}

#Preview {
    GroupSetupView()
}
