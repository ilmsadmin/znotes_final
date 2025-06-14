# NoteFlow Frontend - Library

This directory contains shared utilities and configurations for the NoteFlow frontend application.

## Structure

- `apollo-client.ts` - Apollo Client configuration for GraphQL
- `graphql/` - GraphQL queries, mutations, and subscriptions
- `hooks/` - Custom React hooks for GraphQL operations
- `utils.ts` - Utility functions

## GraphQL Integration

The frontend uses Apollo Client to communicate with the GraphQL backend. Key features:

- Automatic authentication via Bearer tokens
- Error handling for network and GraphQL errors
- Type-safe operations with TypeScript
- Cache management for optimal performance

## Usage

```typescript
import { useCurrentUser, useNotes } from '@/lib/hooks';

function MyComponent() {
  const { data: user, loading } = useCurrentUser();
  const { data: notes } = useNotes();
  
  // Your component logic
}
```

This directory contains utility functions, configurations, and helper modules.

## Structure

```
lib/
├── api/             # API client configurations and helpers
├── auth/            # Authentication utilities
├── db/              # IndexedDB utilities for offline storage
├── utils/           # General utility functions
├── constants/       # Application constants
└── hooks/           # Custom React hooks
```

## Guidelines

- Use TypeScript for all library code
- Keep functions pure and testable
- Follow functional programming principles where appropriate
- Document complex utilities with JSDoc comments
- Ensure proper error handling