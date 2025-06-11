# Components

This directory contains reusable UI components for the NoteFlow frontend.

## Structure

```
components/
├── ui/              # Basic UI components (buttons, inputs, etc.)
├── layout/          # Layout components (header, sidebar, etc.)
├── notes/           # Note-specific components
├── tasks/           # Task management components
├── issues/          # Issue tracking components
└── common/          # Shared utility components
```

## Guidelines

- Use TypeScript for all components
- Follow the design system established in `/mocks/shared/design-system.css`
- Implement responsive design with mobile-first approach
- Use Tailwind CSS for styling
- Include proper accessibility attributes
- Write components with reusability in mind