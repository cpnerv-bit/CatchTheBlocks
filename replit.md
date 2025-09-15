# Overview

This is a React-based block catching game built with Express.js backend. The game features falling blocks of different types that players must catch with a movable basket, with progressive difficulty levels, scoring system, and audio feedback. The application uses a modern full-stack architecture with TypeScript, Tailwind CSS for styling, and Radix UI components.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript running on Vite
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **UI Components**: Radix UI primitives with custom component layer for consistent design
- **State Management**: Zustand for game state, audio controls, and UI state management
- **Game Rendering**: HTML5 Canvas for 2D game graphics and animations
- **Asset Support**: Support for 3D models (GLTF/GLB), audio files (MP3, OGG, WAV), and GLSL shaders

## Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Development**: Hot module replacement via Vite integration in development mode
- **Build Process**: esbuild for production server bundling

## Data Storage Solutions
- **Database**: PostgreSQL configured via Drizzle with migrations support
- **ORM**: Drizzle ORM with schema-first approach
- **Local Storage**: Browser localStorage for high scores and game preferences
- **In-Memory**: Fallback MemStorage implementation for development/testing

## Authentication and Authorization
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions
- **User Schema**: Basic user model with username/password fields
- **Storage Interface**: Abstract storage layer supporting both database and in-memory implementations

## Game System Design
- **Game Loop**: Custom game loop with delta-time based updates for consistent gameplay
- **Physics**: Simple collision detection and particle systems
- **Audio**: HTML5 Audio API with mute controls and sound effect management
- **Input**: Keyboard controls with event-driven input handling
- **Scoring**: Progressive difficulty system with multiple block types and scoring mechanics

# External Dependencies

## Core Runtime Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless environments
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **express**: Web application framework for the backend API
- **react**: Frontend UI library with hooks-based state management
- **zustand**: Lightweight state management for client-side application state

## UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives (accordion, dialog, dropdown, etc.)
- **tailwindcss**: Utility-first CSS framework with custom design tokens
- **class-variance-authority**: Type-safe variant API for component styling
- **clsx**: Utility for constructing className strings conditionally

## Development and Build Tools
- **vite**: Fast build tool and development server with HMR support
- **esbuild**: JavaScript bundler for production server builds
- **tsx**: TypeScript execution environment for development
- **drizzle-kit**: Database migration and introspection toolkit

## Audio and Media
- **HTML5 Audio API**: Native browser audio support for background music and sound effects
- **vite-plugin-glsl**: GLSL shader support for potential 3D graphics features

## Utility Libraries
- **nanoid**: Unique ID generation for game entities
- **date-fns**: Date manipulation utilities
- **zod**: Runtime type validation and schema definition