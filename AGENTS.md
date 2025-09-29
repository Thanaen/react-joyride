# Repository Guidelines

## Project Structure & Module Organization

- `src/` holds the TypeScript source. Components live in `src/components/` (e.g. `Tooltip/`), shared logic sits under `modules/`, and design tokens stay in `styles.ts` and `literals/`.
- Tests are split between `test/` for unit and integration coverage (Vitest + Testing Library) and `e2e/` for Playwright component tests. Shared fixtures live under each directory's `__fixtures__/` folder.
- Reference material and public documentation assets live in `docs/`. Build utilities are kept in `scripts/` (currently `fix-cjs.ts` runs after TypeScript compilation).

## Build, Test, and Development Commands

- Install dependencies with `pnpm install` or `npm install` if pnpm is unavailable.
- `npm run watch` builds with tsdown in watch mode; use it while iterating on source.
- `npm run build` runs a clean compile (`dist/` output) and post-processes CommonJS artifacts.
- `npm run lint`, `npm run typecheck`, and `npm run typevalidation` enforce lint rules, project TS types, and exported types. Chain them via `npm run validate` before publishing.
- `npm run test` executes the Vitest suite. Add `--watch` locally or `--coverage` (requires `@vitest/coverage-v8`) for reports. `npm run e2e` runs Playwright component tests; use `npm run e2e:ui` to debug visually.

## Coding Style & Naming Conventions

- Follow the shared `@gilbarbara/eslint-config` and Prettier settings (2-space indentation, semicolons, single quotes). Run `npm run lint` to auto-fix.
- React components and TypeScript types use PascalCase (`Beacon.tsx`, `JoyrideStep`). Hooks and utility functions adopt camelCase with a `use` prefix for hooks (`useJoyrideStore`).
- Remove any temporary `logger(...)` calls before committing; ESLint flags them.

## Testing Guidelines

- Place Vitest specs beside related modules in `test/` (e.g. `modules/joyride.spec.ts`) and mirror folder names for clarity. Snapshot files belong under `__snapshots__/`.
- Use Testing Library queries that mirror user behavior and mock DOM APIs in `test/__setup__/`. Target ≥90% coverage to match CI.
- For interactive flows, extend Playwright specs in `e2e/*.spec.tsx` and run `npm run e2e:debug` when stabilizing selectors.

## Commit & Pull Request Guidelines

- Follow Conventional Commit prefixes (`feat`, `fix`, `chore`, etc.) as seen in history (`feat: use react-compiler`, `fix: temporarily revert ...`). Scope optional but encouraged for clarity.
- Each PR should describe the change, outline testing performed (`npm run test`, `npm run e2e`), and link to relevant issues. Include screenshots or GIFs when updating UI demos.
- Ensure PRs pass `npm run validate` and update docs or changelog entries where applicable before requesting review.
