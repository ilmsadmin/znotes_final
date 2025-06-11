//
//  TutorialView.swift
//  NoteFlow
//
//  Created by GitHub Copilot
//

import SwiftUI

struct TutorialView: View {
    @EnvironmentObject var coordinator: AppCoordinator
    @Environment(\.dismiss) private var dismiss
    @State private var currentStep = 0
    @State private var isAnimating = false
    
    private let tutorialSteps = TutorialStep.allSteps
    
    var body: some View {
        NavigationView {
            ZStack {
                // Background
                Color(.systemBackground)
                    .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Content
                    TabView(selection: $currentStep) {
                        ForEach(Array(tutorialSteps.enumerated()), id: \.offset) { index, step in
                            TutorialStepView(
                                step: step,
                                isAnimating: currentStep == index && isAnimating
                            )
                            .tag(index)
                        }
                    }
                    .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
                    .animation(.easeInOut(duration: 0.5), value: currentStep)
                    
                    // Bottom Section
                    VStack(spacing: 20) {
                        // Progress Dots
                        HStack(spacing: 8) {
                            ForEach(0..<tutorialSteps.count, id: \.self) { index in
                                Circle()
                                    .fill(currentStep == index ? Color.blue : Color.gray.opacity(0.3))
                                    .frame(width: currentStep == index ? 24 : 8, height: 8)
                                    .animation(.easeInOut(duration: 0.3), value: currentStep)
                            }
                        }
                        
                        // Navigation Buttons
                        VStack(spacing: 12) {
                            if currentStep == tutorialSteps.count - 1 {
                                // Finish Button
                                Button(action: {
                                    completeTutorial()
                                }) {
                                    Text("Start Using NoteFlow")
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
                                // Continue Button
                                Button(action: {
                                    withAnimation(.easeInOut(duration: 0.5)) {
                                        currentStep += 1
                                    }
                                }) {
                                    HStack {
                                        Text("Continue")
                                            .font(.system(size: 18, weight: .semibold))
                                        
                                        Image(systemName: "arrow.right")
                                            .font(.system(size: 16, weight: .semibold))
                                    }
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 16)
                                    .background(Color.blue)
                                    .clipShape(RoundedRectangle(cornerRadius: 16))
                                }
                            }
                            
                            // Step Indicator
                            Text("Step \(currentStep + 1) of \(tutorialSteps.count)")
                                .font(.system(size: 14))
                                .foregroundColor(.secondary)
                        }
                        .padding(.horizontal, 20)
                    }
                    .padding(.bottom, 50)
                }
            }
            .navigationTitle("Get Started")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Skip") {
                        completeTutorial()
                    }
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.secondary)
                }
            }
        }
        .onChange(of: currentStep) { _, newValue in
            if newValue == tutorialSteps.count - 1 {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    isAnimating = true
                }
            } else {
                isAnimating = false
            }
        }
        .onAppear {
            if currentStep == tutorialSteps.count - 1 {
                isAnimating = true
            }
        }
    }
    
    // MARK: - Helper Functions
    private func completeTutorial() {
        coordinator.completeTutorial()
    }
}

// MARK: - Tutorial Step View

struct TutorialStepView: View {
    let step: TutorialStep
    let isAnimating: Bool
    
    var body: some View {
        VStack(spacing: 40) {
            Spacer()
            
            // Illustration
            VStack(spacing: 24) {
                // Main Icon with Animation
                ZStack {
                    Circle()
                        .fill(step.backgroundColor)
                        .frame(width: 120, height: 120)
                        .scaleEffect(isAnimating ? 1.1 : 1.0)
                        .animation(.easeInOut(duration: 2.0).repeatForever(autoreverses: true), value: isAnimating)
                    
                    Image(systemName: step.iconName)
                        .font(.system(size: 48, weight: .medium))
                        .foregroundColor(step.iconColor)
                        .rotationEffect(.degrees(isAnimating ? 5 : -5))
                        .animation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true), value: isAnimating)
                }
            }
            
            Spacer()
            
            // Content
            VStack(spacing: 24) {
                Text(step.title)
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(.primary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
                
                Text(step.description)
                    .font(.system(size: 18))
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
                    .padding(.horizontal, 40)
                
                // Features List (if any)
                if !step.features.isEmpty {
                    VStack(spacing: 12) {
                        ForEach(Array(step.features.enumerated()), id: \.offset) { index, feature in
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

// MARK: - Tutorial Data

struct TutorialStep {
    let title: String
    let description: String
    let iconName: String
    let iconColor: Color
    let backgroundColor: Color
    let features: [String]
    
    static let allSteps: [TutorialStep] = [
        TutorialStep(
            title: "Create Your First Note",
            description: "Tap the + button to create notes, tasks, or issues. Use rich text formatting and add tags to organize your content.",
            iconName: "plus.circle",
            iconColor: .blue,
            backgroundColor: Color.blue.opacity(0.1),
            features: [
                "Rich text formatting",
                "Add tags and attachments",
                "Organize with templates"
            ]
        ),
        
        TutorialStep(
            title: "Collaborate with Your Team",
            description: "Assign tasks to team members, leave comments, and track progress together in real-time.",
            iconName: "person.2.fill",
            iconColor: .green,
            backgroundColor: Color.green.opacity(0.1),
            features: [
                "Assign tasks to teammates",
                "Real-time comments",
                "@mention team members"
            ]
        ),
        
        TutorialStep(
            title: "Work Offline",
            description: "NoteFlow works seamlessly offline. Your changes sync automatically when you're back online.",
            iconName: "wifi.slash",
            iconColor: .orange,
            backgroundColor: Color.orange.opacity(0.1),
            features: [
                "Full offline functionality",
                "Automatic sync",
                "Conflict resolution"
            ]
        )
    ]
}

#Preview {
    TutorialView()
}
