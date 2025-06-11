# NoteFlow - Frontend

Web application frontend for NoteFlow built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit
- **UI Components**: Headless UI + Heroicons
- **GraphQL Client**: Apollo Client
- **Development**: ESLint + Next.js built-in optimizations

## Architecture

This frontend follows the technical architecture defined in the main project:
- **Framework**: Next.js (modern React framework)
- **State Management**: Redux Toolkit for application state
- **UI Components**: Tailwind CSS + Headless UI for design system
- **Local Storage**: Browser IndexedDB for offline functionality
- **API Integration**: GraphQL with Apollo Client

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable UI components
├── lib/             # Utilities, configurations, and helpers
├── store/           # Redux store and slices
├── types/           # TypeScript type definitions
└── styles/          # Global styles and Tailwind config
```

## Development Guidelines

- Follow the design system established in `/mocks/shared/design-system.css`
- Use TypeScript for all components and utilities
- Implement responsive design following mobile-first approach
- Integrate with backend GraphQL API
- Support offline functionality with IndexedDB
- Follow accessibility best practices (WCAG 2.1 AA)

## Integration

This frontend is designed to work with:
- Backend API at `/backend` (GraphQL endpoint)
- Shared design system from `/mocks/shared/`
- Authentication via Firebase Auth
- Real-time features via WebSocket (future)
