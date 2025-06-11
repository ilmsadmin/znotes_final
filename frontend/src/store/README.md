# Redux Store

This directory contains the Redux store configuration and slices for state management.

## Structure

```
store/
├── index.ts         # Store configuration and setup
├── slices/          # Redux Toolkit slices
│   ├── authSlice.ts
│   ├── notesSlice.ts
│   ├── tasksSlice.ts
│   └── issuesSlice.ts
└── middleware/      # Custom middleware (sync, offline, etc.)
```

## Guidelines

- Use Redux Toolkit for all state management
- Follow the slice pattern for organizing state
- Use RTK Query for API data fetching
- Implement proper TypeScript types for all state
- Handle offline/online synchronization in middleware
- Use selectors for computed state