//
//  OnboardingView.swift
//  NoteFlow
//
//  Created by GitHub Copilot
//

import SwiftUI

struct OnboardingView: View {
    @EnvironmentObject var coordinator: AppCoordinator
    @State private var currentPage = 0
    @State private var showingAuth = false
    @State private var isAnimating = false
    @State private var showingGroupSetup = false
    
    private let pages = OnboardingPage.allPages
    
    var body: some View {
        ZStack {
            // Background Gradient
            LinearGradient(
                gradient: Gradient(colors: [
                    Color.blue.opacity(0.1),
                    Color.purple.opacity(0.1)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Skip Button
                HStack {
                    Spacer()
                    
                    if currentPage < pages.count - 1 {
                        Button("Skip") {
                            withAnimation(.easeInOut(duration: 0.5)) {
                                currentPage = pages.count - 1
                            }
                        }
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.secondary)
                        .padding(.horizontal, 20)
                        .padding(.top, 10)
                    }
                }
                
                // Pages
                TabView(selection: $currentPage) {
                    ForEach(Array(pages.enumerated()), id: \.offset) { index, page in
                        OnboardingPageView(
                            page: page,
                            isAnimating: currentPage == index && isAnimating
                        )
                        .tag(index)
                    }
                }
                .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
                .animation(.easeInOut(duration: 0.5), value: currentPage)
                
                // Page Indicator and Navigation
                VStack(spacing: 32) {
                    // Custom Page Indicator
                    HStack(spacing: 8) {
                        ForEach(0..<pages.count, id: \.self) { index in
                            Circle()
                                .fill(currentPage == index ? Color.blue : Color.gray.opacity(0.3))
                                .frame(width: currentPage == index ? 12 : 8, height: currentPage == index ? 12 : 8)
                                .animation(.easeInOut(duration: 0.3), value: currentPage)
                        }
                    }
                    
                    // Navigation Buttons
                    VStack(spacing: 16) {
                        if currentPage == pages.count - 1 {
                            // Get Started Button
                            Button(action: {
                                coordinator.completeOnboarding()
                            }) {
                                Text("Get Started")
                                    .font(.system(size: 18, weight: .semibold))
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 16)
                                    .background(
                                        LinearGradient(
                                            gradient: Gradient(colors: [Color.blue, Color.purple]),
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        )
                                    )
                                    .clipShape(RoundedRectangle(cornerRadius: 16))
                            }
                            .scaleEffect(isAnimating ? 1.05 : 1.0)
                            .animation(.easeInOut(duration: 0.6).repeatForever(autoreverses: true), value: isAnimating)
                        } else {
                            // Next Button
                            Button(action: {
                                withAnimation(.easeInOut(duration: 0.5)) {
                                    currentPage += 1
                                }
                            }) {
                                HStack {
                                    Text("Next")
                                        .font(.system(size: 18, weight: .semibold))
                                        .foregroundColor(.white)
                                    
                                    Image(systemName: "arrow.right")
                                        .font(.system(size: 16, weight: .semibold))
                                        .foregroundColor(.white)
                                }
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 16)
                                .background(Color.blue)
                                .clipShape(RoundedRectangle(cornerRadius: 16))
                            }
                            
                            // Back Button
                            if currentPage > 0 {
                                Button(action: {
                                    withAnimation(.easeInOut(duration: 0.5)) {
                                        currentPage -= 1
                                    }
                                }) {
                                    Text("Back")
                                        .font(.system(size: 16, weight: .medium))
                                        .foregroundColor(.secondary)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                }
                            }
                        }
                    }
                    .padding(.horizontal, 32)
                }
                .padding(.bottom, 50)
            }
        }
        .onChange(of: currentPage) { _, newValue in
            if newValue == pages.count - 1 {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    isAnimating = true
                }
            } else {
                isAnimating = false
            }
        }
        .onAppear {
            if currentPage == pages.count - 1 {
                isAnimating = true
            }
        }
        .fullScreenCover(isPresented: $showingAuth) {
            AuthenticationView()
        }
    }
}

// MARK: - Onboarding Page View

struct OnboardingPageView: View {
    let page: OnboardingPage
    let isAnimating: Bool
    
    var body: some View {
        VStack(spacing: 40) {
            Spacer()
            
            // Illustration
            VStack(spacing: 24) {
                // Main Icon with Animation
                ZStack {
                    Circle()
                        .fill(page.backgroundColor)
                        .frame(width: 200, height: 200)
                        .scaleEffect(isAnimating ? 1.1 : 1.0)
                        .animation(.easeInOut(duration: 2.0).repeatForever(autoreverses: true), value: isAnimating)
                    
                    Image(systemName: page.iconName)
                        .font(.system(size: 60, weight: .medium))
                        .foregroundColor(page.iconColor)
                        .rotationEffect(.degrees(isAnimating ? 5 : -5))
                        .animation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true), value: isAnimating)
                }
                
                // Supporting Icons (if any)
                if !page.supportingIcons.isEmpty {
                    HStack(spacing: 20) {
                        ForEach(Array(page.supportingIcons.enumerated()), id: \.offset) { index, icon in
                            Image(systemName: icon)
                                .font(.system(size: 24))
                                .foregroundColor(.secondary)
                                .offset(y: isAnimating ? sin(Double(index) * 0.5) * 10 : 0)
                                .animation(
                                    .easeInOut(duration: 1.0 + Double(index) * 0.2)
                                        .repeatForever(autoreverses: true)
                                        .delay(Double(index) * 0.1),
                                    value: isAnimating
                                )
                        }
                    }
                }
            }
            
            Spacer()
            
            // Content
            VStack(spacing: 24) {
                Text(page.title)
                    .font(.system(size: 32, weight: .bold))
                    .foregroundColor(.primary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
                
                Text(page.description)
                    .font(.system(size: 18))
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
                    .padding(.horizontal, 40)
                
                // Features List (if any)
                if !page.features.isEmpty {
                    VStack(spacing: 12) {
                        ForEach(Array(page.features.enumerated()), id: \.offset) { index, feature in
                            HStack(spacing: 12) {
                                Image(systemName: "checkmark.circle.fill")
                                    .font(.system(size: 16))
                                    .foregroundColor(.green)
                                
                                Text(feature)
                                    .font(.system(size: 16))
                                    .foregroundColor(.primary)
                                
                                Spacer()
                            }
                            .opacity(isAnimating ? 1.0 : 0.7)
                            .animation(
                                .easeInOut(duration: 0.5)
                                    .delay(Double(index) * 0.1),
                                value: isAnimating
                            )
                        }
                    }
                    .padding(.horizontal, 48)
                    .padding(.top, 16)
                }
            }
            
            Spacer()
        }
        .padding(.horizontal, 20)
    }
}

// MARK: - Authentication View

struct AuthenticationView: View {
    @EnvironmentObject var coordinator: AppCoordinator
    @State private var showingSignUp = false
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var name = ""
    @State private var isLoading = false
    @State private var showingAlert = false
    @State private var alertMessage = ""
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 32) {
                    // Header
                    VStack(spacing: 16) {
                        Image(systemName: "note.text")
                            .font(.system(size: 60))
                            .foregroundColor(.blue)
                            .frame(width: 100, height: 100)
                            .background(Color.blue.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 20))
                        
                        Text("Welcome to NoteFlow")
                            .font(.system(size: 28, weight: .bold))
                            .foregroundColor(.primary)
                        
                        Text(showingSignUp ? "Create your account" : "Sign in to continue")
                            .font(.system(size: 16))
                            .foregroundColor(.secondary)
                    }
                    .padding(.top, 40)
                    
                    // Form
                    VStack(spacing: 20) {
                        if showingSignUp {
                            TextField("Full Name", text: $name)
                                .textFieldStyle(CustomTextFieldStyle())
                        }
                        
                        TextField("Email", text: $email)
                            .textFieldStyle(CustomTextFieldStyle())
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)
                        
                        SecureField("Password", text: $password)
                            .textFieldStyle(CustomTextFieldStyle())
                        
                        if showingSignUp {
                            SecureField("Confirm Password", text: $confirmPassword)
                                .textFieldStyle(CustomTextFieldStyle())
                        }
                    }
                    .padding(.horizontal, 32)
                    
                    // Action Buttons
                    VStack(spacing: 16) {
                        Button(action: {
                            if showingSignUp {
                                signUp()
                            } else {
                                signIn()
                            }
                        }) {
                            HStack {
                                if isLoading {
                                    ProgressView()
                                        .scaleEffect(0.8)
                                        .foregroundColor(.white)
                                } else {
                                    Text(showingSignUp ? "Create Account" : "Sign In")
                                        .font(.system(size: 18, weight: .semibold))
                                }
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(Color.blue)
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                        }
                        .disabled(isLoading || !isFormValid)
                        .opacity(isFormValid ? 1.0 : 0.6)
                        
                        // Divider
                        HStack {
                            Rectangle()
                                .fill(Color.gray.opacity(0.3))
                                .frame(height: 1)
                            
                            Text("or")
                                .font(.system(size: 14))
                                .foregroundColor(.secondary)
                                .padding(.horizontal, 16)
                            
                            Rectangle()
                                .fill(Color.gray.opacity(0.3))
                                .frame(height: 1)
                        }
                        
                        // Social Sign In
                        VStack(spacing: 12) {
                            Button(action: {
                                signInWithGoogle()
                            }) {
                                HStack {
                                    Image(systemName: "globe")
                                        .font(.system(size: 18))
                                    
                                    Text("Continue with Google")
                                        .font(.system(size: 16, weight: .medium))
                                }
                                .foregroundColor(.primary)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color(.secondarySystemBackground))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                                )
                            }
                            
                            Button(action: {
                                signInWithApple()
                            }) {
                                HStack {
                                    Image(systemName: "applelogo")
                                        .font(.system(size: 18))
                                    
                                    Text("Continue with Apple")
                                        .font(.system(size: 16, weight: .medium))
                                }
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color.black)
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                            }
                        }
                    }
                    .padding(.horizontal, 32)
                    
                    // Toggle Sign Up/In
                    Button(action: {
                        withAnimation(.easeInOut(duration: 0.3)) {
                            showingSignUp.toggle()
                            clearForm()
                        }
                    }) {
                        HStack(spacing: 4) {
                            Text(showingSignUp ? "Already have an account?" : "Don't have an account?")
                                .font(.system(size: 16))
                                .foregroundColor(.secondary)
                            
                            Text(showingSignUp ? "Sign In" : "Sign Up")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.blue)
                        }
                    }
                    
                    Spacer(minLength: 40)
                }
            }
            .background(Color(.systemBackground))
        }
        .alert("Error", isPresented: $showingAlert) {
            Button("OK") { }
        } message: {
            Text(alertMessage)
        }
    }
    
    // MARK: - Computed Properties
    private var isFormValid: Bool {
        if showingSignUp {
            return !name.isEmpty && !email.isEmpty && !password.isEmpty && password == confirmPassword && password.count >= 6
        } else {
            return !email.isEmpty && !password.isEmpty
        }
    }
    
    // MARK: - Helper Functions
    private func signUp() {
        isLoading = true
        
        // TODO: Implement sign up logic
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            isLoading = false
            coordinator.completeAuthentication()
        }
    }
    
    private func signIn() {
        isLoading = true
        
        // TODO: Implement sign in logic
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            isLoading = false
            coordinator.completeAuthentication()
        }
    }
    
    private func signInWithGoogle() {
        // TODO: Implement Google sign in
        print("Sign in with Google")
    }
    
    private func signInWithApple() {
        // TODO: Implement Apple sign in
        print("Sign in with Apple")
    }
    
    private func clearForm() {
        name = ""
        email = ""
        password = ""
        confirmPassword = ""
    }
}

// MARK: - Custom Text Field Style

struct CustomTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .background(Color(.secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color.gray.opacity(0.3), lineWidth: 1)
            )
    }
}

// MARK: - Onboarding Data

struct OnboardingPage {
    let title: String
    let description: String
    let iconName: String
    let iconColor: Color
    let backgroundColor: Color
    let supportingIcons: [String]
    let features: [String]
    
    static let allPages: [OnboardingPage] = [
        OnboardingPage(
            title: "Welcome to NoteFlow",
            description: "Your all-in-one solution for notes, tasks, and team collaboration. Simple but powerful.",
            iconName: "note.text",
            iconColor: .blue,
            backgroundColor: Color.blue.opacity(0.1),
            supportingIcons: ["doc.text", "checkmark.circle", "exclamationmark.triangle"],
            features: []
        ),
        
        OnboardingPage(
            title: "Capture Everything",
            description: "Take notes, create tasks, and track issues all in one place. Rich text editing with tags and attachments.",
            iconName: "square.and.pencil",
            iconColor: .green,
            backgroundColor: Color.green.opacity(0.1),
            supportingIcons: ["tag", "paperclip", "textformat"],
            features: [
                "Rich text editing",
                "File attachments",
                "Smart tagging"
            ]
        ),
        
        OnboardingPage(
            title: "Team Collaboration",
            description: "Work together seamlessly. Assign tasks, comment on notes, and keep everyone in sync.",
            iconName: "person.2.fill",
            iconColor: .purple,
            backgroundColor: Color.purple.opacity(0.1),
            supportingIcons: ["bubble.left.and.bubble.right", "person.badge.plus", "arrow.triangle.2.circlepath"],
            features: [
                "Real-time collaboration",
                "Team assignments",
                "Comments & discussions"
            ]
        ),
        
        OnboardingPage(
            title: "Work Anywhere",
            description: "Full offline support with smart sync. Your work is always available, whether you're online or offline.",
            iconName: "icloud.and.arrow.down",
            iconColor: .orange,
            backgroundColor: Color.orange.opacity(0.1),
            supportingIcons: ["wifi.slash", "arrow.triangle.2.circlepath", "checkmark.shield"],
            features: [
                "Offline access",
                "Smart synchronization",
                "Conflict resolution"
            ]
        )
    ]
}

#Preview {
    OnboardingView()
}
