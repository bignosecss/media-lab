# AGENTS.md

medialab is a framework-agnostic media player library with React and Vue 3 adapters, built on an AI-Native harness: a framework-free `core` controller plus per-framework adapter + component packages. There is no web-component code. Read [docs/architecture.md](docs/architecture.md) and [docs/design-principles.md](docs/design-principles.md) before changing `packages/`.

## Repository layout

```
packages/core         framework-free media controller (state + command; single source of truth)
packages/react        React adapter + components: <MediaProvider>, hooks, play/pause, progress, volume
packages/vue          Vue 3 adapter + components: <MediaProvider>, composables, play/pause, progress, volume
apps/docs             Astro + Starlight docs site (live React + Vue playground)
docs/                 architecture, design principles, docs standard
.agents/notes/        decision records (implemented / proposed / archived / rejected)
.agents/skills/       reusable agent workflows (pre-push checks, code review, ...)
```

## Commands

```sh
pnpm install
pnpm dev:docs            # run the docs site (live React + Vue playground)
pnpm typecheck           # tsc --noEmit across all packages
pnpm test                # vitest across all packages
pnpm lint                # oxlint across the repo
```

Run checks before pushing via [.agents/skills/pre-push-checks](.agents/skills/pre-push-checks/SKILL.md); report only the commands you ran.

## Conventions

- Every package is `@medialab/<name>`; the docs site is `docs`. ESM everywhere (`"type": "module"`).
- **TypeScript strict** (`strict: true`, `noImplicitAny`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`). No `any` without an explaining comment.
- **The media element is the single source of truth.** The core controller wraps an element, mirrors its native events into an immutable state snapshot, and applies commands. UI components never reach into the element directly — they read state and dispatch commands.
- **Split is a hard boundary.** User-intent (a button press) becomes a `MediaCommand`; media state (paused, currentTime) is a `MediaState` snapshot. An element's presentational component never owns behavior state.
- **Events for user actions, attrs/props for media state** (media-chrome principle): components emit intents, the controller owns state.
- **Independently usable components.** Each component is importable on its own, carries a default style, and accepts a `className` and a `children`/render-prop escape hatch.
- **One primitive backend.** Accessible primitives come from Base UI (`@base-ui-components/react`). Never mix Base UI, Radix, or React Aria APIs in the same component; agents must not introduce a second primitive library without an Agent Note.
- **One home per fact.** A decision lives once — in a doc or an Agent Note; elsewhere link, don't restate. Non-trivial changes carry an **Agent Note** in the same PR ([when](#agent-notes)).
- Files end with exactly one trailing newline.

## Agent Notes

A non-trivial change (new behavior, API shape, closed decision) requires an Agent Note in `.agents/notes/` committed in the same change. Put the `why` and what was given up there. See [.agents/notes/README.md](.agents/notes/README.md). Archived notes are frozen history — never edit.

## AI-Native workflow

The orchestrator (parent agent) owns the foundation and the cross-cutting API; independent feature slices are delegated to subagents in parallel and survive a code-review agent before merge. See [docs/design-principles.md](docs/design-principles.md) and the `code-review` skill for what counts as independent.

## Editing these instructions

Keep each rule self-contained and link the doc that owns the detail. Condense when the meaning survives.
