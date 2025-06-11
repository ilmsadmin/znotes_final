# TypeScript Types

This directory contains TypeScript type definitions for the NoteFlow application.

## Structure

```
types/
├── api.ts           # API request/response types
├── auth.ts          # Authentication-related types
├── notes.ts         # Note entity types
├── tasks.ts         # Task entity types
├── issues.ts        # Issue entity types
├── users.ts         # User and group types
└── common.ts        # Shared utility types
```

## Guidelines

- Define clear, strict types for all data structures
- Use discriminated unions for polymorphic data
- Extend base types appropriately
- Document complex types with JSDoc comments
- Keep types consistent with backend schema
- Use utility types (Partial, Pick, Omit) for flexibility