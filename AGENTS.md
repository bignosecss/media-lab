# AGENTS.md

react-media-player is a React-only media player library built on an AI-Native harness. **Everything is a React component or a framework-agnostic controller**; there is no web-component code. Read [docs/architecture.md](docs/architecture.md) and [docs/design-principles.md](docs/design-principles.md) before changing `packages/`.

## Repository layout

```
packages/core         framework-agnostic media controller (state + command; single source of truth)
packages/react        React bindings: <MediaProvider> + hooks
packages/components   independently usable controller components (play/pause, progress, volume)
apps/demo             Vite demo app (Tailwind v4 + CSS-variable tokens)
docs/                 architecture, design principles, docs standard
.agents/notes/        decision records (implemented / proposed / archived / rejected)
.agents/skills/       reusable agent workflows (pre-push checks, code review, ...)
```

## Commands

```sh
pnpm install
pnpm dev:demo            # run the demo app
pnpm typecheck           # tsc --noEmit across all packages
pnpm test                # vitest across all packages
pnpm lint                # oxlint across the repo
```

Run checks before pushing via [.agents/skills/pre-push-checks](.agents/skills/pre-push-checks/SKILL.md); report only the commands you ran.

## Conventions

- Every package is `@react-media/<name>`; the demo app is `demo`. ESM everywhere (`"type": "module"`).
- **TypeScript strict** (`strict: true`, `noImplicitAny`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`). No `any` without an explaining comment.
- **The media element is the single source of truth.** The core controller wraps an element, mirrors its native events into an immutable state snapshot, and applies commands. UI components never reach into the element directly — they read state and dispatch commands.
- **Split is a hard boundary.** User-intent (a button press) becomes a `MediaCommand`; media state (paused, currentTime) is a `MediaState` snapshot. An element's presentational component never owns behavior state.
- **Events for user actions, attrs/props for media state** (media-chrome principle): components emit intents, the controller owns state.
- **Independently usable components.** Each component is importable on its own, carries a default style, and accepts a `className` and a `children`/render-prop escape hatch.
- **One home per fact.** A decision lives once — in a doc or an Agent Note; elsewhere link, don't restate. Non-trivial changes carry an **Agent Note** in the same PR ([when](#agent-notes)).
- Files end with exactly one trailing newline.

## Agent Notes

A non-trivial change (new behavior, API shape, closed decision) requires an Agent Note in `.agents/notes/` committed in the same change. Put the `why` and what was given up there. See [.agents/notes/README.md](.agents/notes/README.md). Archived notes are frozen history — never edit.

## AI-Native workflow

The orchestrator (parent agent) owns the foundation and the cross-cutting API; independent feature slices are delegated to subagents in parallel and survive a code-review agent before merge. See [docs/design-principles.md](docs/design-principles.md) and the `code-review` skill for what counts as independent.

## Editing these instructions

Keep each rule self-contained and link the doc that owns the detail. Condense when the meaning survives.
