# ba-utils

A TypeScript Node.js project with modern tooling.

## Features

- TypeScript (latest)
- ESLint with TypeScript support
- Prettier for code formatting
- Vitest for testing
- Path aliases (`@/` for `src/`)

## Scripts

- `pnpm build` - Build the project
- `pnpm dev` - Run in watch mode
- `pnpm test` - Run tests in watch mode
- `pnpm test:run` - Run tests once
- `pnpm lint` - Lint the code
- `pnpm lint:fix` - Lint and fix issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm typecheck` - Type check without emitting files

## Project Structure

```
ba-utils/
├── src/          # Source files
├── tests/        # Test files
├── dist/         # Build output
└── ...config files
```

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run tests:

   ```bash
   pnpm test
   ```

3. Build the project:
   ```bash
   pnpm build
   ```
