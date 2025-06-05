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

## Memories
- This is a monorepo workspace with packages located in the `packages/` directory
- Use Nx commands for package generation, building, and type checking
- Always respect the existing project structure and TypeScript configuration
- When adding code or generating new packages, be specific about the directory/app names within the monorepo context