# UI/UX Guidelines - NoteFlow

## Thiết kế tổng quan

NoteFlow được thiết kế với triết lý "simple but powerful" - đơn giản nhưng mạnh mẽ. Giao diện tối ưu cho productivity, dễ sử dụng cho người dùng không chuyên về công nghệ, đồng thời đáp ứng nhu cầu của các team chuyên nghiệp.

## Design System

### Color Palette

#### Primary Colors
```css
--primary-50: #f0f9ff
--primary-100: #e0f2fe
--primary-200: #bae6fd
--primary-300: #7dd3fc
--primary-400: #38bdf8
--primary-500: #0ea5e9  /* Brand color */
--primary-600: #0284c7
--primary-700: #0369a1
--primary-800: #075985
--primary-900: #0c4a6e
```

#### Neutral Colors
```css
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-300: #d1d5db
--gray-400: #9ca3af
--gray-500: #6b7280
--gray-600: #4b5563
--gray-700: #374151
--gray-800: #1f2937
--gray-900: #111827
```

#### Semantic Colors
```css
/* Success */
--success-50: #f0fdf4
--success-500: #22c55e
--success-600: #16a34a

/* Warning */
--warning-50: #fffbeb
--warning-500: #f59e0b
--warning-600: #d97706

/* Error */
--error-50: #fef2f2
--error-500: #ef4444
--error-600: #dc2626

/* Info */
--info-50: #eff6ff
--info-500: #3b82f6
--info-600: #2563eb
```

#### Dark Mode Colors
```css
--dark-bg-primary: #0f172a
--dark-bg-secondary: #1e293b
--dark-bg-tertiary: #334155
--dark-text-primary: #f1f5f9
--dark-text-secondary: #cbd5e1
--dark-border: #475569
```

### Typography

#### Font Family
```css
/* Primary font - Inter */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Monospace font - for code */
font-family: 'JetBrains Mono', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace;
```

#### Font Scale
```css
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 1.875rem  /* 30px */
--text-4xl: 2.25rem   /* 36px */
```

#### Font Weights
```css
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Spacing Scale

```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-5: 1.25rem   /* 20px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-10: 2.5rem   /* 40px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
--space-20: 5rem     /* 80px */
```

### Border Radius

```css
--radius-sm: 0.125rem  /* 2px */
--radius-md: 0.375rem  /* 6px */
--radius-lg: 0.5rem    /* 8px */
--radius-xl: 0.75rem   /* 12px */
--radius-2xl: 1rem     /* 16px */
--radius-full: 9999px  /* Fully rounded */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
```

## Component Library

### Button Components

#### Primary Button
```css
.btn-primary {
  background-color: var(--primary-500);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:disabled {
  background-color: var(--gray-300);
  cursor: not-allowed;
  transform: none;
}
```

#### Secondary Button
```css
.btn-secondary {
  background-color: transparent;
  color: var(--primary-600);
  border: 1px solid var(--primary-200);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--primary-50);
  border-color: var(--primary-300);
}
```

#### Icon Button
```css
.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background-color: var(--gray-100);
}
```

### Input Components

#### Text Input
```css
.input-text {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-family: inherit;
  transition: all 0.2s ease;
}

.input-text:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

.input-text::placeholder {
  color: var(--gray-400);
}
```

#### Textarea
```css
.textarea {
  width: 100%;
  min-height: 120px;
  padding: var(--space-4);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s ease;
}

.textarea:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}
```

#### Select Dropdown
```css
.select {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}
```

### Card Components

#### Note Card
```css
.note-card {
  background-color: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-4);
  transition: all 0.2s ease;
  cursor: pointer;
}

.note-card:hover {
  border-color: var(--primary-200);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.note-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
}

.note-card-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
  margin: 0;
}

.note-card-content {
  color: var(--gray-600);
  font-size: var(--text-sm);
  line-height: 1.5;
  margin-bottom: var(--space-4);
}

.note-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-xs);
  color: var(--gray-500);
}
```

#### Task Card (Kanban)
```css
.task-card {
  background-color: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.task-card:hover {
  box-shadow: var(--shadow-md);
}

.task-card.priority-high {
  border-left: 4px solid var(--error-500);
}

.task-card.priority-medium {
  border-left: 4px solid var(--warning-500);
}

.task-card.priority-low {
  border-left: 4px solid var(--success-500);
}
```

### Navigation Components

#### Tab Navigation
```css
.tab-nav {
  display: flex;
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: var(--space-6);
}

.tab-item {
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--gray-600);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab-item:hover {
  color: var(--primary-600);
}

.tab-item.active {
  color: var(--primary-600);
  border-bottom-color: var(--primary-500);
}
```

#### Sidebar Navigation
```css
.sidebar {
  width: 280px;
  background-color: var(--gray-50);
  border-right: 1px solid var(--gray-200);
  padding: var(--space-6);
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  color: var(--gray-700);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: var(--space-1);
}

.sidebar-item:hover {
  background-color: var(--gray-100);
}

.sidebar-item.active {
  background-color: var(--primary-100);
  color: var(--primary-700);
}

.sidebar-item-icon {
  width: 20px;
  height: 20px;
  margin-right: var(--space-3);
}
```

### Status & Priority Indicators

#### Status Badge
```css
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.open {
  background-color: var(--info-100);
  color: var(--info-700);
}

.status-badge.in-progress {
  background-color: var(--warning-100);
  color: var(--warning-700);
}

.status-badge.done {
  background-color: var(--success-100);
  color: var(--success-700);
}

.status-badge.closed {
  background-color: var(--gray-100);
  color: var(--gray-700);
}
```

#### Priority Indicator
```css
.priority-indicator {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  display: inline-block;
  margin-right: var(--space-2);
}

.priority-indicator.high {
  background-color: var(--error-500);
}

.priority-indicator.medium {
  background-color: var(--warning-500);
}

.priority-indicator.low {
  background-color: var(--success-500);
}
```

## Layout Patterns

### Mobile-First Responsive Design

#### Breakpoints
```css
/* Mobile: 0-640px (default) */
/* Tablet: 641-1024px */
@media (min-width: 641px) { }

/* Desktop: 1025px+ */
@media (min-width: 1025px) { }
```

#### Grid System
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 641px) {
  .container {
    padding: 0 var(--space-6);
  }
}

@media (min-width: 1025px) {
  .container {
    padding: 0 var(--space-8);
  }
}
```

### Screen Layouts

#### Mobile Layout
```
┌─────────────────┐
│ Header (60px)   │
├─────────────────┤
│                 │
│                 │
│  Main Content   │
│                 │
│                 │
├─────────────────┤
│ Bottom Nav      │
│ (60px)          │
└─────────────────┘
```

#### Tablet Layout
```
┌─────────────────────────────┐
│ Header (64px)               │
├─────────────────────────────┤
│           │                 │
│ Sidebar   │  Main Content   │
│ (280px)   │                 │
│           │                 │
│           │                 │
└─────────────────────────────┘
```

#### Desktop Layout
```
┌─────────────────────────────────────┐
│ Header (64px)                       │
├─────────────┬───────────────────────┤
│             │           │           │
│ Sidebar     │   Main    │  Details  │
│ (280px)     │ Content   │  Panel    │
│             │           │ (320px)   │
│             │           │           │
└─────────────┴───────────────────────┘
```

## Animation & Transitions

### Micro-interactions

#### Button Hover
```css
.btn {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}
```

#### Card Hover
```css
.card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
```

#### Loading States
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

### Page Transitions
```css
.page-enter {
  opacity: 0;
  transform: translateX(100%);
}

.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease-out;
}

.page-exit {
  opacity: 1;
  transform: translateX(0);
}

.page-exit-active {
  opacity: 0;
  transform: translateX(-100%);
  transition: all 0.3s ease-in;
}
```

## Dark Mode Support

### CSS Variables Approach
```css
/* Light mode (default) */
:root {
  --bg-primary: var(--gray-50);
  --bg-secondary: white;
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-600);
  --border-color: var(--gray-200);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: var(--dark-bg-primary);
    --bg-secondary: var(--dark-bg-secondary);
    --text-primary: var(--dark-text-primary);
    --text-secondary: var(--dark-text-secondary);
    --border-color: var(--dark-border);
  }
}

/* Manual dark mode toggle */
[data-theme="dark"] {
  --bg-primary: var(--dark-bg-primary);
  --bg-secondary: var(--dark-bg-secondary);
  --text-primary: var(--dark-text-primary);
  --text-secondary: var(--dark-text-secondary);
  --border-color: var(--dark-border);
}
```

## Accessibility Guidelines

### WCAG 2.1 Compliance

#### Color Contrast
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio

#### Focus Management
```css
.focusable:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

.focus-visible:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

#### Screen Reader Support
```html
<!-- Semantic HTML -->
<main role="main" aria-label="Main content">
  <section aria-labelledby="section-title">
    <h2 id="section-title">Notes</h2>
    <!-- Content -->
  </section>
</main>

<!-- ARIA labels -->
<button aria-label="Add new note" aria-describedby="add-note-desc">
  <svg><!-- Plus icon --></svg>
</button>
<div id="add-note-desc" class="sr-only">
  Creates a new note in your current workspace
</div>
```

#### Keyboard Navigation
```css
/* Skip links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-600);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

## Platform-Specific Guidelines

### iOS (SwiftUI)

#### Native Components
```swift
// Follow iOS Human Interface Guidelines
// Use native navigation patterns
NavigationView {
    List {
        // Content
    }
    .navigationTitle("Notes")
    .navigationBarTitleDisplayMode(.large)
}

// Native gestures
.swipeActions(edge: .trailing) {
    Button("Delete") {
        // Delete action
    }
    .tint(.red)
}
```

#### Visual Consistency
- Use SF Symbols for icons
- Follow iOS typography scale
- Respect safe areas
- Support Dynamic Type

### Android (Jetpack Compose)

#### Material Design 3
```kotlin
// Follow Material Design guidelines
// Use Material components
LazyColumn {
    items(notes) { note ->
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            // Note content
        }
    }
}

// Material theming
MaterialTheme(
    colorScheme = if (isDarkTheme) darkColorScheme() else lightColorScheme()
) {
    // App content
}
```

#### Android Patterns
- Use FAB for primary actions
- Support edge-to-edge design
- Implement proper back navigation
- Follow Android gesture navigation

## Performance Guidelines

### Optimization Best Practices

#### Image Optimization
```css
/* Responsive images */
.responsive-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* Lazy loading */
img[loading="lazy"] {
  opacity: 0;
  transition: opacity 0.3s;
}

img[loading="lazy"].loaded {
  opacity: 1;
}
```

#### CSS Performance
```css
/* Use transform instead of changing layout properties */
.animate-efficient {
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.animate-efficient.moved {
  transform: translateX(100px);
}

/* Avoid expensive properties */
/* Bad */
.expensive {
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  filter: blur(5px);
}

/* Good */
.efficient {
  transform: translateZ(0); /* Force GPU acceleration */
  will-change: transform;
}
```

#### Bundle Size Optimization
- Use CSS custom properties instead of duplicating values
- Implement critical CSS for above-the-fold content
- Use CSS-in-JS with dead code elimination
- Optimize icon usage (icon fonts vs SVG sprites)

## User Flow Patterns

### Common Interaction Patterns

#### Create Flow
1. **Entry Point**: FAB or "+" button
2. **Selection**: Choose type (note/task/issue)
3. **Creation**: Fill form with progressive disclosure
4. **Confirmation**: Success feedback + navigation

#### Edit Flow
1. **Entry**: Tap/click on item
2. **Edit Mode**: In-place editing or modal
3. **Save**: Auto-save or explicit save action
4. **Feedback**: Visual confirmation of changes

#### Delete Flow
1. **Trigger**: Swipe action or menu option
2. **Confirmation**: Modal or undo toast
3. **Action**: Immediate deletion with undo option
4. **Feedback**: Success message + item removal

### Error States
```css
.error-state {
  text-align: center;
  padding: var(--space-12);
  color: var(--gray-500);
}

.error-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-4);
  opacity: 0.5;
}

.error-message {
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-2);
}

.error-description {
  font-size: var(--text-sm);
  line-height: 1.5;
  margin-bottom: var(--space-6);
}
```

### Empty States
```css
.empty-state {
  text-align: center;
  padding: var(--space-16) var(--space-8);
}

.empty-illustration {
  width: 120px;
  height: 120px;
  margin: 0 auto var(--space-6);
  opacity: 0.6;
}

.empty-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.empty-description {
  font-size: var(--text-sm);
  color: var(--gray-600);
  line-height: 1.5;
  margin-bottom: var(--space-8);
}
```