# medialab

A framework-agnostic media player library (React and Vue 3 adapters) and the AI-Native harness that builds it, modeled on [media-chrome](https://www.media-chrome.org/docs/en/architecture)'s architecture: independently usable controller components, a centralized controller that is the single source of truth for media state, and a split between user-intent events and media state.

Read [docs/architecture.md](docs/architecture.md) and [docs/design-principles.md](docs/design-principles.md) before changing `packages/`.

## Workspace

```
packages/core         framework-free media controller (state + command; single source of truth)
packages/react        React adapter + components (MediaProvider, hooks, play/pause, progress, volume)
packages/vue          Vue 3 adapter + components (MediaProvider, composables, play/pause, progress, volume)
apps/docs             Astro + Starlight docs site (with a live React + Vue playground)
```

## Commands

```sh
pnpm install
pnpm dev:docs         # run the docs site (live React + Vue playground)
pnpm typecheck
pnpm test
pnpm lint
```

> Publishing builds (`tsdown` → `dist/`) are intentionally deferred. Packages resolve from `src/`, so the docs site and tests run without a build step.

## Contributing (AI-Native workflow)

Follow `AGENTS.md`. Every non-trivial change carries an **Agent Note** in `.agents/notes/` and an **Agent Skill** review before merge.
