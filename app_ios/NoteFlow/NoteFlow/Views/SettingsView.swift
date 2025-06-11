//
//  SettingsView.swift
//  NoteFlow
//
//  Created by GitHub Copilot
//

import SwiftUI

struct SettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var userProfile = UserProfile.mock
    @State private var appSettings = AppSettings.default
    @State private var showingEditProfile = false
    @State private var showingAbout = false
    @State private var showingLogoutAlert = false
    
    var body: some View {
        NavigationView {
            List {
                // Profile Section
                profileSection
                
                // Team Section
                teamSection
                
                // Preferences Section
                preferencesSection
                
                // Notifications Section
                notificationsSection
                
                // Storage Section
                storageSection
                
                // Support Section
                supportSection
                
                // Account Section
                accountSection
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                    .fontWeight(.medium)
                }
            }
        }
        .sheet(isPresented: $showingEditProfile) {
            EditProfileView(profile: $userProfile)
        }
        .sheet(isPresented: $showingAbout) {
            AboutView()
        }
        .alert("Sign Out", isPresented: $showingLogoutAlert) {
            Button("Cancel", role: .cancel) { }
            Button("Sign Out", role: .destructive) {
                signOut()
            }
        } message: {
            Text("Are you sure you want to sign out?")
        }
    }
    
    // MARK: - Profile Section
    private var profileSection: some View {
        Section {
            Button(action: {
                showingEditProfile = true
            }) {
                HStack(spacing: 16) {
                    // Avatar
                    Circle()
                        .fill(LinearGradient(
                            gradient: Gradient(colors: [Color.blue, Color.purple]),
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ))
                        .frame(width: 64, height: 64)
                        .overlay(
                            Text(userProfile.initials)
                                .font(.system(size: 24, weight: .semibold))
                                .foregroundColor(.white)
                        )
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text(userProfile.name)
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(.primary)
                        
                        Text(userProfile.email)
                            .font(.system(size: 14))
                            .foregroundColor(.secondary)
                        
                        HStack(spacing: 4) {
                            Image(systemName: "building.2")
                                .font(.system(size: 12))
                                .foregroundColor(.secondary)
                            
                            Text(userProfile.organization)
                                .font(.system(size: 12))
                                .foregroundColor(.secondary)
                        }
                    }
                    
                    Spacer()
                    
                    Image(systemName: "chevron.right")
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                }
                .padding(.vertical, 8)
            }
            .buttonStyle(PlainButtonStyle())
        }
    }
    
    // MARK: - Team Section
    private var teamSection: some View {
        Section("Team") {
            NavigationLink(destination: TeamMembersView()) {
                SettingsRow(
                    icon: "person.2",
                    title: "Team Members",
                    subtitle: "\(userProfile.teamMemberCount) members",
                    iconColor: .blue
                )
            }
            
            NavigationLink(destination: InviteMembersView()) {
                SettingsRow(
                    icon: "person.badge.plus",
                    title: "Invite Members",
                    subtitle: "Add team members",
                    iconColor: .green
                )
            }
            
            if userProfile.isAdmin {
                NavigationLink(destination: TeamSettingsView()) {
                    SettingsRow(
                        icon: "gearshape.2",
                        title: "Team Settings",
                        subtitle: "Manage team preferences",
                        iconColor: .orange
                    )
                }
            }
        }
    }
    
    // MARK: - Preferences Section
    private var preferencesSection: some View {
        Section("Preferences") {
            NavigationLink(destination: AppearanceSettingsView()) {
                SettingsRow(
                    icon: "paintbrush",
                    title: "Appearance",
                    subtitle: appSettings.appearanceMode.displayName,
                    iconColor: .purple
                )
            }
            
            HStack {
                SettingsRow(
                    icon: "globe",
                    title: "Language",
                    subtitle: appSettings.language.displayName,
                    iconColor: .blue
                )
                
                Spacer()
                
                Menu {
                    ForEach(Language.allCases, id: \.self) { language in
                        Button(language.displayName) {
                            appSettings.language = language
                            saveSettings()
                        }
                    }
                } label: {
                    Image(systemName: "chevron.up.chevron.down")
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                }
            }
            
            NavigationLink(destination: DefaultsSettingsView()) {
                SettingsRow(
                    icon: "slider.horizontal.3",
                    title: "Defaults",
                    subtitle: "Note templates & formats",
                    iconColor: .indigo
                )
            }
            
            HStack {
                SettingsRow(
                    icon: "clock",
                    title: "Auto-save",
                    subtitle: "Save changes automatically",
                    iconColor: .green
                )
                
                Spacer()
                
                Toggle("", isOn: $appSettings.autoSave)
                    .onChange(of: appSettings.autoSave) { _, _ in
                        saveSettings()
                    }
            }
        }
    }
    
    // MARK: - Notifications Section
    private var notificationsSection: some View {
        Section("Notifications") {
            HStack {
                SettingsRow(
                    icon: "bell",
                    title: "Push Notifications",
                    subtitle: "Get notified of updates",
                    iconColor: .red
                )
                
                Spacer()
                
                Toggle("", isOn: $appSettings.pushNotifications)
                    .onChange(of: appSettings.pushNotifications) { _, _ in
                        saveSettings()
                    }
            }
            
            if appSettings.pushNotifications {
                HStack {
                    SettingsRow(
                        icon: "envelope",
                        title: "Email Notifications",
                        subtitle: "Daily summary emails",
                        iconColor: .orange
                    )
                    
                    Spacer()
                    
                    Toggle("", isOn: $appSettings.emailNotifications)
                        .onChange(of: appSettings.emailNotifications) { _, _ in
                            saveSettings()
                        }
                }
                
                NavigationLink(destination: NotificationSettingsView()) {
                    SettingsRow(
                        icon: "bell.badge",
                        title: "Notification Types",
                        subtitle: "Customize notification preferences",
                        iconColor: .purple
                    )
                }
            }
        }
    }
    
    // MARK: - Storage Section
    private var storageSection: some View {
        Section("Storage & Sync") {
            NavigationLink(destination: StorageView()) {
                SettingsRow(
                    icon: "externaldrive",
                    title: "Storage Usage",
                    subtitle: "\(userProfile.storageUsed) of \(userProfile.storageLimit) used",
                    iconColor: .blue
                )
            }
            
            HStack {
                SettingsRow(
                    icon: "arrow.triangle.2.circlepath",
                    title: "Auto Sync",
                    subtitle: "Sync when connected",
                    iconColor: .green
                )
                
                Spacer()
                
                Toggle("", isOn: $appSettings.autoSync)
                    .onChange(of: appSettings.autoSync) { _, _ in
                        saveSettings()
                    }
            }
            
            NavigationLink(destination: OfflineSettingsView()) {
                SettingsRow(
                    icon: "wifi.slash",
                    title: "Offline Mode",
                    subtitle: "Configure offline behavior",
                    iconColor: .orange
                )
            }
            
            Button(action: {
                // TODO: Implement cache clearing
            }) {
                SettingsRow(
                    icon: "trash",
                    title: "Clear Cache",
                    subtitle: "Free up storage space",
                    iconColor: .red
                )
            }
            .buttonStyle(PlainButtonStyle())
        }
    }
    
    // MARK: - Support Section
    private var supportSection: some View {
        Section("Support") {
            NavigationLink(destination: HelpView()) {
                SettingsRow(
                    icon: "questionmark.circle",
                    title: "Help & FAQ",
                    subtitle: "Get help and support",
                    iconColor: .blue
                )
            }
            
            Button(action: {
                // TODO: Open feedback form
            }) {
                SettingsRow(
                    icon: "envelope",
                    title: "Send Feedback",
                    subtitle: "Help us improve NoteFlow",
                    iconColor: .green
                )
            }
            .buttonStyle(PlainButtonStyle())
            
            Button(action: {
                showingAbout = true
            }) {
                SettingsRow(
                    icon: "info.circle",
                    title: "About",
                    subtitle: "Version \(Bundle.main.appVersionLong)",
                    iconColor: .purple
                )
            }
            .buttonStyle(PlainButtonStyle())
        }
    }
    
    // MARK: - Account Section
    private var accountSection: some View {
        Section("Account") {
            NavigationLink(destination: PrivacySettingsView()) {
                SettingsRow(
                    icon: "hand.raised",
                    title: "Privacy",
                    subtitle: "Data and privacy settings",
                    iconColor: .blue
                )
            }
            
            NavigationLink(destination: SecuritySettingsView()) {
                SettingsRow(
                    icon: "lock.shield",
                    title: "Security",
                    subtitle: "Two-factor authentication",
                    iconColor: .green
                )
            }
            
            NavigationLink(destination: ExportDataView()) {
                SettingsRow(
                    icon: "square.and.arrow.up",
                    title: "Export Data",
                    subtitle: "Download your data",
                    iconColor: .orange
                )
            }
            
            Button(action: {
                showingLogoutAlert = true
            }) {
                SettingsRow(
                    icon: "rectangle.portrait.and.arrow.right",
                    title: "Sign Out",
                    subtitle: "Sign out of your account",
                    iconColor: .red
                )
            }
            .buttonStyle(PlainButtonStyle())
        }
    }
    
    // MARK: - Helper Functions
    private func saveSettings() {
        // TODO: Save settings to storage
        print("Settings saved")
    }
    
    private func signOut() {
        // TODO: Implement sign out
        print("User signed out")
        dismiss()
    }
}

// MARK: - Supporting Views

struct SettingsRow: View {
    let icon: String
    let title: String
    let subtitle: String
    let iconColor: Color
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(.white)
                .frame(width: 32, height: 32)
                .background(iconColor)
                .clipShape(RoundedRectangle(cornerRadius: 8))
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.primary)
                
                Text(subtitle)
                    .font(.system(size: 14))
                    .foregroundColor(.secondary)
            }
        }
        .padding(.vertical, 2)
    }
}

struct EditProfileView: View {
    @Binding var profile: UserProfile
    @Environment(\.dismiss) private var dismiss
    @State private var name: String
    @State private var email: String
    @State private var organization: String
    @State private var showingImagePicker = false
    
    init(profile: Binding<UserProfile>) {
        self._profile = profile
        self._name = State(initialValue: profile.wrappedValue.name)
        self._email = State(initialValue: profile.wrappedValue.email)
        self._organization = State(initialValue: profile.wrappedValue.organization)
    }
    
    var body: some View {
        NavigationView {
            Form {
                Section {
                    HStack {
                        Spacer()
                        
                        Button(action: {
                            showingImagePicker = true
                        }) {
                            Circle()
                                .fill(LinearGradient(
                                    gradient: Gradient(colors: [Color.blue, Color.purple]),
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                ))
                                .frame(width: 100, height: 100)
                                .overlay(
                                    VStack {
                                        Text(profile.initials)
                                            .font(.system(size: 32, weight: .semibold))
                                            .foregroundColor(.white)
                                        
                                        Image(systemName: "camera")
                                            .font(.system(size: 16))
                                            .foregroundColor(.white.opacity(0.8))
                                            .padding(.top, 4)
                                    }
                                )
                                .overlay(
                                    Circle()
                                        .stroke(Color.white, lineWidth: 3)
                                )
                        }
                        
                        Spacer()
                    }
                    .padding(.vertical, 16)
                } header: {
                    Text("Profile Photo")
                }
                
                Section("Personal Information") {
                    HStack {
                        Text("Name")
                            .frame(width: 80, alignment: .leading)
                        TextField("Enter your name", text: $name)
                    }
                    
                    HStack {
                        Text("Email")
                            .frame(width: 80, alignment: .leading)
                        TextField("Enter your email", text: $email)
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)
                    }
                    
                    HStack {
                        Text("Company")
                            .frame(width: 80, alignment: .leading)
                        TextField("Enter company name", text: $organization)
                    }
                }
                
                Section("Account Details") {
                    HStack {
                        Text("Role")
                            .frame(width: 80, alignment: .leading)
                        Text(profile.isAdmin ? "Admin" : "Member")
                            .foregroundColor(.secondary)
                        Spacer()
                    }
                    
                    HStack {
                        Text("Member Since")
                            .frame(width: 80, alignment: .leading)
                        Text(profile.memberSince.formatted(date: .abbreviated, time: .omitted))
                            .foregroundColor(.secondary)
                        Spacer()
                    }
                }
            }
            .navigationTitle("Edit Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        saveProfile()
                    }
                    .fontWeight(.semibold)
                    .disabled(name.isEmpty || email.isEmpty)
                }
            }
        }
    }
    
    private func saveProfile() {
        profile.name = name
        profile.email = email
        profile.organization = organization
        // TODO: Save to backend
        dismiss()
    }
}

struct AboutView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 32) {
                    // App Icon and Info
                    VStack(spacing: 16) {
                        Image(systemName: "note.text")
                            .font(.system(size: 80))
                            .foregroundColor(.blue)
                            .frame(width: 120, height: 120)
                            .background(Color.blue.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 24))
                        
                        VStack(spacing: 8) {
                            Text("NoteFlow")
                                .font(.system(size: 32, weight: .bold))
                                .foregroundColor(.primary)
                            
                            Text("Version \(Bundle.main.appVersionLong)")
                                .font(.system(size: 16))
                                .foregroundColor(.secondary)
                            
                            Text("Build \(Bundle.main.appBuild)")
                                .font(.system(size: 14))
                                .foregroundColor(.secondary)
                        }
                    }
                    
                    // Description
                    VStack(spacing: 16) {
                        Text("Simple but powerful note-taking and task management for teams.")
                            .font(.system(size: 18))
                            .foregroundColor(.primary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)
                        
                        Text("Built with ❤️ for productivity")
                            .font(.system(size: 16))
                            .foregroundColor(.secondary)
                    }
                    
                    // Links
                    VStack(spacing: 12) {
                        Button("Privacy Policy") {
                            // TODO: Open privacy policy
                        }
                        .font(.system(size: 16))
                        .foregroundColor(.blue)
                        
                        Button("Terms of Service") {
                            // TODO: Open terms
                        }
                        .font(.system(size: 16))
                        .foregroundColor(.blue)
                        
                        Button("Open Source Licenses") {
                            // TODO: Open licenses
                        }
                        .font(.system(size: 16))
                        .foregroundColor(.blue)
                    }
                    
                    // Copyright
                    Text("© 2024 NoteFlow. All rights reserved.")
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                        .padding(.top, 32)
                }
                .padding(.horizontal, 24)
                .padding(.top, 32)
            }
            .navigationTitle("About")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

// MARK: - Placeholder Views

struct TeamMembersView: View {
    var body: some View {
        Text("Team Members")
            .navigationTitle("Team Members")
    }
}

struct InviteMembersView: View {
    var body: some View {
        Text("Invite Members")
            .navigationTitle("Invite Members")
    }
}

struct TeamSettingsView: View {
    var body: some View {
        Text("Team Settings")
            .navigationTitle("Team Settings")
    }
}

struct AppearanceSettingsView: View {
    var body: some View {
        Text("Appearance Settings")
            .navigationTitle("Appearance")
    }
}

struct DefaultsSettingsView: View {
    var body: some View {
        Text("Defaults Settings")
            .navigationTitle("Defaults")
    }
}

struct NotificationSettingsView: View {
    var body: some View {
        Text("Notification Settings")
            .navigationTitle("Notifications")
    }
}

struct StorageView: View {
    var body: some View {
        Text("Storage Usage")
            .navigationTitle("Storage")
    }
}

struct OfflineSettingsView: View {
    var body: some View {
        Text("Offline Settings")
            .navigationTitle("Offline Mode")
    }
}

struct HelpView: View {
    var body: some View {
        Text("Help & FAQ")
            .navigationTitle("Help")
    }
}

struct PrivacySettingsView: View {
    var body: some View {
        Text("Privacy Settings")
            .navigationTitle("Privacy")
    }
}

struct SecuritySettingsView: View {
    var body: some View {
        Text("Security Settings")
            .navigationTitle("Security")
    }
}

struct ExportDataView: View {
    var body: some View {
        Text("Export Data")
            .navigationTitle("Export Data")
    }
}

// MARK: - Supporting Models

struct UserProfile {
    var name: String
    var email: String
    var organization: String
    var isAdmin: Bool
    var teamMemberCount: Int
    var storageUsed: String
    var storageLimit: String
    var memberSince: Date
    
    var initials: String {
        let components = name.components(separatedBy: " ")
        return components.compactMap { $0.first }.map { String($0) }.joined()
    }
    
    static let mock = UserProfile(
        name: "John Doe",
        email: "john@company.com",
        organization: "Acme Corp",
        isAdmin: true,
        teamMemberCount: 8,
        storageUsed: "2.1 GB",
        storageLimit: "10 GB",
        memberSince: Date().addingTimeInterval(-86400 * 30) // 30 days ago
    )
}

struct AppSettings {
    var appearanceMode: AppearanceMode
    var language: Language
    var autoSave: Bool
    var pushNotifications: Bool
    var emailNotifications: Bool
    var autoSync: Bool
    
    static let `default` = AppSettings(
        appearanceMode: .auto,
        language: .english,
        autoSave: true,
        pushNotifications: true,
        emailNotifications: false,
        autoSync: true
    )
}

enum AppearanceMode: String, CaseIterable {
    case light = "light"
    case dark = "dark"
    case auto = "auto"
    
    var displayName: String {
        switch self {
        case .light: return "Light"
        case .dark: return "Dark"
        case .auto: return "Automatic"
        }
    }
}

enum Language: String, CaseIterable {
    case english = "en"
    case vietnamese = "vi"
    case spanish = "es"
    case french = "fr"
    
    var displayName: String {
        switch self {
        case .english: return "English"
        case .vietnamese: return "Tiếng Việt"
        case .spanish: return "Español"
        case .french: return "Français"
        }
    }
}

// MARK: - Bundle Extensions

extension Bundle {
    var appVersionLong: String {
        if let version = infoDictionary?["CFBundleShortVersionString"] as? String {
            return version
        }
        return "Unknown"
    }
    
    var appBuild: String {
        if let build = infoDictionary?["CFBundleVersion"] as? String {
            return build
        }
        return "Unknown"
    }
}

#Preview {
    SettingsView()
}
