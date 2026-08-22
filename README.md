# medialab

A framework-agnostic media player library (React and Vue 3 adapters) and the AI-Native harness that builds it, modeled on [media-chrome](https://www.media-chrome.org/docs/en/architecture)'s architecture: independently usable controller components, a centralized controller that is the single source of truth for media state, and a split between user-intent events and media state.

Read [docs/architecture.md](docs/architecture.md) and [docs/design-principles.md](docs/design-principles.md) before changing `packages/`.

## Workspace

```
packages/core         framework-free media controller (state + command; single source of truth)
packages/react        React adapter + components (MediaProvider, hooks, play/pause, progress, volume)
packages/vue          Vue 3 adapter + components (MediaProvider, composables, play/pause, progress, volume)
apps/demo             React demo app (Tailwind v4 + CSS-variable tokens)
apps/vue-demo         Vue 3 demo app (Tailwind v4 + CSS-variable tokens)
```

## Commands

```sh
pnpm install
pnpm dev:demo         # run the React demo
pnpm dev:vue-demo     # run the Vue 3 demo
pnpm typecheck
pnpm test
pnpm lint
```

> Publishing builds (`tsdown` → `dist/`) are intentionally deferred. This milestone ships the harness + dev loop; packages resolve from `src/` so `pnpm dev:demo` runs without a build step.

## Contributing (AI-Native workflow)

Follow `AGENTS.md`. Every non-trivial change carries an **Agent Note** in `.agents/notes/` and an **Agent Skill** review before merge.
