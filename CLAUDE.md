# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Nx-based monorepo workspace using pnpm as the package manager. The workspace is configured for TypeScript development with strict compilation settings.

## Essential Commands

### Package Management
```bash
# Install dependencies
pnpm install

# Generate a new library
npx nx g @nx/js:lib packages/<name>

# Generate a new library with specific options
npx nx g @nx/js:lib packages/<name> --directory=packages/<name> --projectNameAndRootFormat=as-provided
```

### Development Commands
```bash
# Build a package
npx nx build <package-name>

# Type check a package
npx nx typecheck <package-name>

# Run all affected tasks
npx nx affected -t build,typecheck

# Visualize project dependency graph
npx nx graph
```

### Release and Publishing
```bash
# Version and release packages
npx nx release

# Sync TypeScript project references
npx nx sync
```

## Architecture

### Monorepo Structure
- **packages/**: All packages are located here. Each package should be a self-contained unit with its own package.json
- **nx.json**: Configures build orchestration, caching, and task dependencies
- **tsconfig.base.json**: Shared TypeScript configuration that all packages extend

### Build System
- Nx automatically infers `build` and `typecheck` targets for packages
- TypeScript project references are used for incremental builds
- Nx Cloud is configured for distributed caching (workspace ID: 68407f25f99d30716d73e4be)

### TypeScript Configuration
- Target: ES2022
- Module: NodeNext
- Strict mode enabled with all strict checks
- Composite projects enabled for better build performance

## Applications

This workspace contains three applications designed for AI-driven development workshops using Cursor IDE:

### 1. Image Processor (AI-Driven Benchmarking Workshop)
- **Location**: `apps/image-processor`
- **Purpose**: Learn to use AI for implementing performance benchmarking with Vitest
- **Key Features**: Image transformations, batch processing, real-time preview
- **Workshop Focus**: 
  - Using Cursor AI to set up Vitest benchmarking
  - AI-driven performance analysis and optimization
  - Automated benchmark suite generation
- **Tools**: Cursor IDE, Vitest, AI-assisted development
- **Intentional Issues**: Contains deliberate performance bottlenecks for AI to identify and optimize

### 2. Inventory System (AI-Driven Logging Workshop)
- **Location**: `apps/inventory-system`
- **Purpose**: Learn to use AI for implementing comprehensive logging strategies
- **Key Features**: Real-time inventory tracking, order processing, concurrent user handling
- **Workshop Focus**:
  - Using Cursor AI to automatically add logging throughout the codebase
  - AI-determined optimal logging points
  - Structured logging implementation with AI assistance
- **Tools**: Cursor IDE, AI-generated logging utilities
- **Real-time Features**: WebSocket/SSE for live updates across connected clients

### 3. Loan Application (AI-Driven Integration Testing Workshop)
- **Location**: `apps/loan-application`
- **Purpose**: Learn to use AI for implementing Playwright integration tests
- **Key Features**: 5-step application flow, conditional logic, complex validation rules
- **Workshop Focus**:
  - Using Cursor AI to set up Playwright
  - AI-generated test scenarios and edge cases
  - Automated test suite creation through natural language
- **Tools**: Cursor IDE, Playwright, AI-assisted test generation
- **Testing Challenges**: Cross-field validation, async operations, state persistence

## Memories
- This is a monorepo workspace with packages located in the `packages/` directory
- Use Nx commands for package generation, building, and type checking
- Always respect the existing project structure and TypeScript configuration
- When adding code or generating new packages, be specific about the directory/app names within the monorepo context
- Each app serves as a learning project for different development skills (benchmarking, logging, testing)