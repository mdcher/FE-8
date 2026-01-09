# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build for production (runs TypeScript check first, then Vite build)
- `pnpm run preview` - Preview production build locally

### Code Quality
- `pnpm run lint` - Run ESLint with zero warnings policy
- `pnpm run lint:fix` - Run ESLint and auto-fix issues
- `pnpm run format` - Format code with Prettier

### Testing
- `pnpm run test` - Run all tests (unit + e2e)
- `pnpm run test:unit` - Run Vitest unit tests (watch mode by default)
- `pnpm run test:unit:coverage` - Run unit tests with coverage report
- `pnpm run test:e2e` - Run Playwright e2e tests
- `pnpm run test:e2e:report` - Show Playwright test report

Unit tests should be colocated with source files (e.g., `Component.tsx` with `Component.test.tsx`).

### Storybook
- `pnpm run storybook` - Start Storybook dev server on port 6006
- `pnpm run storybook:build` - Build Storybook for production

### Git Hooks
This project uses Husky for git hooks:
- `prepare-commit-msg` - Runs Commitizen for structured commit messages
- `commit-msg` - Validates commit messages with Commitlint (Conventional Commits)

Use `pnpm run commitizen` to commit with guided prompts.

## Architecture

### Routing: TanStack Router
- File-based routing in `src/routes/`
- Route tree auto-generated in `src/routeTree.gen.ts` by `@tanstack/router-plugin`
- Route files use naming conventions:
  - `index.tsx` - index route (/)
  - `books.tsx` - layout route (/books)
  - `books.$bookId.tsx` - dynamic segment (/books/:bookId)
  - `books.new.tsx` - static segment (/books/new)
  - `__root.tsx` - root layout for all routes
- Routes export `Route` using `createRootRoute()` or `createFileRoute()`
- Root layout in `src/routes/__root.tsx` provides header/navigation and wraps all routes with `<Outlet />`

### State Management
**Zustand** - Global state (auth, etc.) with persistence
- Stores in `src/store/`
- Example: `authStore.ts` uses `persist` middleware for localStorage
- Access via hooks: `const { token, setToken, logout } = useAuthStore()`

**TanStack Query** - Server state management
- Configured in `src/main.tsx` with `QueryClientProvider`
- API hooks in feature folders (e.g., `src/features/books/booksApi.ts`)
- Follows pattern: `useBooks()`, `useBook(id)`, `useCreateBook()`, etc.
- Handles caching, invalidation, optimistic updates

### API Integration
Centralized Axios instance in `src/lib/axios.ts`:
- Base URL from `VITE_API_BASE_URL` environment variable
- Request interceptor: Adds Bearer token from Zustand auth store
- Response interceptor:
  - Unwraps nested `data.data` responses if present
  - Auto-logout on 401 errors
- Use this instance for all API calls: `import apiClient from '@/lib/axios'`

### Feature-Based Organization
Features organized in `src/features/{feature-name}/`:
```
features/
  books/
    booksApi.ts         # TanStack Query hooks
    types.ts            # TypeScript types/interfaces
    components/         # Feature-specific components
```

Routes for features live in `src/routes/` following TanStack Router conventions.

### Forms
- **React Hook Form** + **Zod** for validation
- Forms typically in route files or feature components
- Use `@hookform/resolvers/zod` to connect Zod schemas with forms
- Form state: `useForm()`, control, register, handleSubmit

### Styling
- **Tailwind CSS** (v4.x) with Vite plugin
- Utility-first approach throughout
- Main styles imported in `src/main.tsx`
- Helper utilities: `clsx` and `tailwind-merge` for conditional classes
- **HeadlessUI** and **Heroicons** for accessible UI components

### Internationalization (i18n)
- **react-i18next** configured in `src/common/i18n.ts`
- Translation files: `src/assets/locales/{lang}/translations.json`
- Supports language detection and dynamic loading
- Default language: English (en), with Spanish (es) included

### Path Aliases
TypeScript path alias `@` maps to `./src` (configured in `vite.config.ts` and `tsconfig.json`).

Import example: `import apiClient from '@/lib/axios'`

### Development Tools
Devtools are included and configured in `src/App.tsx`:
- **TanStack Query Devtools** - Bottom corner
- **TanStack Router Devtools** - Bottom left corner
- Utility wrappers in `src/components/utils/development-tools/` ensure devtools only render in development

For TanStack Table and React Hook Form devtools, see wrapper components in the same directory.

## Important Notes

### Faker Usage
Faker is installed for testing/demos but **must use localized imports**:
```typescript
// ❌ Don't do this (imports entire 2+ MB library)
import { faker } from '@faker-js/faker';

// ✅ Do this instead (~600 KB)
import { faker } from '@faker-js/faker/locale/en';
```
**Never use Faker in production code** - only for tests and demos.

### Environment Variables
Use Vite's `import.meta.env` for environment variables:
- Prefix with `VITE_` to expose to client
- Example: `VITE_API_BASE_URL` used in axios config

### Type Safety
- TypeScript strict mode enabled
- `@total-typescript/ts-reset` improves built-in types
- Router types auto-registered via module augmentation in `src/main.tsx`
