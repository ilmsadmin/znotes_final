# iOS Design Documentation

## Overview
The iOS mockups follow Apple's Human Interface Guidelines and demonstrate NoteFlow's native iOS experience using SwiftUI design patterns.

## Design Principles

### 1. Native iOS Patterns
- **Navigation**: Uses standard iOS navigation with back buttons and action buttons
- **Typography**: San Francisco font system with proper hierarchy
- **Touch Targets**: Minimum 44pt touch targets for accessibility
- **Gestures**: Supports standard iOS gestures like swipe and tap

### 2. Visual Design
- **Corner Radius**: Generous corner radius (16-20pt) following iOS 14+ design
- **Spacing**: Consistent 8pt grid system
- **Shadows**: Subtle shadows with proper blur and offset
- **Colors**: Dynamic colors that support both light and dark mode

### 3. Component Library
- **Cards**: Rounded cards with subtle shadows
- **Buttons**: Filled primary buttons and text secondary buttons
- **Inputs**: Rounded input fields with focus states
- **Tags**: Pill-shaped tags with remove functionality

## Screen Specifications

### Onboarding Flow
- **Welcome Screen**: Hero image, feature highlights, clear CTA
- **Registration**: Material-style floating labels, social login options
- **Group Setup**: Team discovery based on email domain
- **Tutorial**: Interactive walkthrough with progress indicators

### Home Dashboard
- **Header**: Greeting, search bar, notifications
- **Tabs**: Notes, Tasks, Issues with smooth transitions
- **Views**: List, grid, and kanban views
- **FAB**: Floating action button for quick creation

### Create/Edit Flow
- **Type Selector**: Segmented control for note/task/issue
- **Rich Editor**: Formatting toolbar with common options
- **Metadata**: Tags, priority, due date inputs
- **Actions**: Save draft and publish options

## Accessibility
- **VoiceOver**: All elements properly labeled
- **Dynamic Type**: Supports iOS text size preferences
- **High Contrast**: Colors meet WCAG AA standards
- **Keyboard Navigation**: Full keyboard support

## Platform-Specific Features
- **SF Symbols**: Uses iOS system icons where appropriate
- **Haptic Feedback**: Tactile feedback for interactions
- **Shortcuts**: Siri shortcuts integration potential
- **Handoff**: Continuity between devices

## File Structure
```
ios/
├── onboarding.html     # Registration and setup flow
├── home.html          # Main dashboard with tabs
├── create.html        # Create/edit note interface
└── README.md          # This documentation
```