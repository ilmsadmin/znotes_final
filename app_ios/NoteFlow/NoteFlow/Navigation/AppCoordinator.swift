//
//  AppCoordinator.swift
//  NoteFlow
//
//  Created by GitHub Copilot
//

import SwiftUI

@MainActor
class AppCoordinator: ObservableObject {
    @Published var currentFlow: AppFlow = .onboarding
    @Published var isAuthenticated = false
    @Published var hasCompletedOnboarding = false
    @Published var hasCompletedTutorial = false
    
    enum AppFlow {
        case onboarding
        case authentication
        case groupSetup
        case tutorial
        case main
    }
    
    init() {
        // In a real app, these would be loaded from UserDefaults or Keychain
        checkAuthenticationStatus()
    }
    
    func checkAuthenticationStatus() {
        // TODO: Check actual authentication status
        // For now, simulate checking stored state
        hasCompletedOnboarding = UserDefaults.standard.bool(forKey: "hasCompletedOnboarding")
        hasCompletedTutorial = UserDefaults.standard.bool(forKey: "hasCompletedTutorial")
        isAuthenticated = UserDefaults.standard.bool(forKey: "isAuthenticated")
        
        updateFlow()
    }
    
    func completeOnboarding() {
        hasCompletedOnboarding = true
        UserDefaults.standard.set(true, forKey: "hasCompletedOnboarding")
        currentFlow = .authentication
    }
    
    func completeAuthentication() {
        isAuthenticated = true
        UserDefaults.standard.set(true, forKey: "isAuthenticated")
        currentFlow = .groupSetup
    }
    
    func completeGroupSetup() {
        currentFlow = .tutorial
    }
    
    func completeTutorial() {
        hasCompletedTutorial = true
        UserDefaults.standard.set(true, forKey: "hasCompletedTutorial")
        currentFlow = .main
    }
    
    func signOut() {
        isAuthenticated = false
        hasCompletedOnboarding = false
        hasCompletedTutorial = false
        
        UserDefaults.standard.removeObject(forKey: "isAuthenticated")
        UserDefaults.standard.removeObject(forKey: "hasCompletedOnboarding")
        UserDefaults.standard.removeObject(forKey: "hasCompletedTutorial")
        
        currentFlow = .onboarding
    }
    
    private func updateFlow() {
        if !hasCompletedOnboarding {
            currentFlow = .onboarding
        } else if !isAuthenticated {
            currentFlow = .authentication
        } else if !hasCompletedTutorial {
            currentFlow = .tutorial
        } else {
            currentFlow = .main
        }
    }
}

struct AppCoordinatorView: View {
    @StateObject private var coordinator = AppCoordinator()
    
    var body: some View {
        Group {
            switch coordinator.currentFlow {
            case .onboarding:
                OnboardingView()
                    .environmentObject(coordinator)
            
            case .authentication:
                AuthenticationView()
                    .environmentObject(coordinator)
            
            case .groupSetup:
                GroupSetupView()
                    .environmentObject(coordinator)
                
            case .tutorial:
                TutorialView()
                    .environmentObject(coordinator)
                
            case .main:
                HomeView()
                    .environmentObject(coordinator)
            }
        }
        .animation(.easeInOut(duration: 0.3), value: coordinator.currentFlow)
    }
}

#Preview {
    AppCoordinatorView()
}
