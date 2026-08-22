---
status: implemented
date: 2026-08-22
---

# Vue 3 first-class support

## Context

`@medialab/vue` started as a proof-of-concept proving the framework-agnostic seam (composables over the shared `@medialab/core`). We decided to promote it to a supported framework, delivering the same adapter + components shape as React.

## Decision

`@medialab/vue` now ships: `MediaProvider` (owns + attaches the element, provides the controller via `provide`/`inject`), composables (`useMediaState` returns a `Ref`, `useMediaCommand`, `useMediaElement`), and the controller components `MediaPlayButton`/`MediaProgress`/`MediaVolume`.

- Components are **render-function** `defineComponent`s in `.ts` (no `.vue` SFC) so the package builds and tests without the `@vitejs/plugin-vue` SFC compiler.
- The progress/volume sliders are **native `<input type="range">`** (accessible, keyboard-navigable) themed via Tailwind `accent-media-accent` — Base UI is React-only, so the Vue adapter does not use it.
- A Vue demo app (`apps/vue-demo`, Vite + Tailwind v4, render-function `App`) proves it end-to-end.

## Why

The seam (shared core store) already supported it; the only real per-framework cost is the presentational markup, which we pay once. Vue's Composition API maps cleanly to the store (`shallowRef` + subscribe → `computed`, `provide`/`inject` for the provider). A native range keeps accessibility without pulling a React-bound primitive library.

## Given up

- Base UI in the Vue adapter (it is React-only); the Vue sliders use native inputs.
- `.vue` SFC syntax in library components (render functions keep the build/test toolchain minimal); users can still author their own SFCs on top of the composables.

## Verify

`pnpm --filter @medialab/vue test` (seam + component tests) and `pnpm --filter vue-demo exec vite build`. `packages/core` stays the only shared package; `react` and `vue` are the two supported framework bundles.
