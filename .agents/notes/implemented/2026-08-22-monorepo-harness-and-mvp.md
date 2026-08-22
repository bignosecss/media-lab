---
status: implemented
date: 2026-08-22
---

# Monorepo harness + MVP foundation

## Context

Starting a React-only media player from scratch, modeled on media-chrome's architecture (independently usable controller components, a centralized controller as the single source of truth over the media element, and a split between user-intent events and media state). The goal of this first milestone is the AI-Native harness and the basic play/pause, progress, and volume capabilities.

## Decision

- **Monorepo** on pnpm workspaces: `packages/core` (framework-agnostic controller), `packages/react` (`<MediaProvider>` + hooks), `packages/components` (the controller components), `apps/demo` (Vite + Tailwind).
- **Strict TypeScript** (`strict`, `noImplicitAny`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`); no `any` without a comment.
- **Core is React-free**: it wraps a media element, mirrors native events into an immutable `MediaState`, applies a discriminated-union `MediaCommand`, and is the only reader/writer of the element. Components never reach into the element.
- **React bindings** subscribe via `useSyncExternalStore`; `<MediaProvider>` **owns** the element (default `<video>`, `renderMedia` is the escape hatch) and exposes the controller via context.
- **Styling**: Tailwind v4 utilities + a CSS-variable token namespace (`--media-*`, defined through `@theme`) so users can restyle without forking.
- **Accessible primitives via Base UI**, not the full shadcn/ui system: we use `@base-ui-components/react` (`Slider`) for progress and volume and follow the shadcn copy-in pattern rather than adopting its CLI/registry. See the [Base UI primitives note](2026-08-22-base-ui-primitives.md).

## Why

The command/state split preserves media-chrome's "events for user actions, attr/props for media state" principle in a React idiom. Keeping the core framework-agnostic makes the single-source-of-truth logic reusable by any consumer that can supply a media element. Tailwind + tokens + Radix gives independently usable, accessible components that accept `className` and a `children`/render-prop escape hatch for full replacement.

## Given up

- web-component / `slot` machinery (this project is React-only).
- The full deepseek-harness weight (this harness is a lean adaptation: `AGENTS.md`, `docs/`, `.agents/notes/`, two skills, one lint gate).
- The full shadcn/ui CLI + registry + `components.json`.
- Publishing builds (`tsdown` → `dist/`): deferred; packages resolve from `src/` so `pnpm dev:demo` and tests run without a build step.

## Verify

```sh
pnpm typecheck && pnpm test && pnpm lint
pnpm --filter demo exec vite build
```

Expect all typechecks and unit tests green, and the built demo CSS to contain the `--color-media-*` tokens (proving `@source` + `@theme` scan the library sources).
