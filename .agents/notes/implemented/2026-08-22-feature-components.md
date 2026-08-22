---
status: implemented
date: 2026-08-22
---

# Feature components (time display, buffered bar, playback rate) + setPlaybackRate

## Context

After promoting Vue to a supported framework, we grew the controller-component surface for both React and Vue in parallel, so the two adapters stay at parity. `MediaPlaybackRate` needed a core command it did not have.

## Decision

- **Core**: add `{ type:'setPlaybackRate'; rate:number }` to `MediaCommand` and its dispatch branch (`element.playbackRate = rate`). `MediaState.playbackRate` already existed.
- **React** (`@medialab/react`) and **Vue** (`@medialab/vue`) each add three components: `MediaTimeDisplay` (current/total time as `M:SS / M:SS`), `MediaBufferedBar` (presentational buffered-range indicator, no command), and `MediaPlaybackRate` (native `<select>` of common rates dispatching `setPlaybackRate`).
- The Vue versions are render-function components and use native elements (a `<select>`, `<div>`s) — Base UI is React-only. The React version uses the Base UI `Slider` for progress but the feature components use native elements here too.
- Both demos wire the new components to prove integration.

## Why

The adapter seam already supports a uniform component surface; the per-framework cost is just presentational markup, paid once per framework. A time display and a buffered bar are display-only (read state, dispatch nothing); a speed control is the first command beyond the MVP set, so the core command extends the `MediaCommand` union exactly like the others.

## Given up

- Fullscreen and caption/subtitle controls (need container-level fullscreen and text-track handling — deferred to a later seam).
- Recomputing `closestRate` at render is fine for a small fixed set; no memoization needed.

## Verify

`pnpm test` — core 9, react 9, vue 8. Both demos build with the new components; `pnpm typecheck` and `pnpm lint` are green.
