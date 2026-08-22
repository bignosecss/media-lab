---
status: implemented
date: 2026-08-22
---

# Framework-agnostic core via a store seam

## Context

`packages/core` is decoupled from React. We asked whether the design is therefore portable to Vue and other frameworks, i.e. whether it is a framework-agnostic architecture.

## Decision

Yes — at the core. `packages/core` is a framework-free **store** over the media element; its public surface (`subscribe`, `getState`, `dispatch`, `attach` + the `MediaState`/`MediaCommand` types) is the **adapter seam**. A framework adds an *adapter* that binds its reactivity to that store; `core` never changes.

- React binds it with `useSyncExternalStore` (`packages/react`); Vue binds `subscribe`/`getState`/`dispatch` to `shallowRef` + an effect (`packages/vue`).
- The controller, the state/command types, and element interaction are shared. Only the reactivity glue and the presentational markup are per-framework.

## Why

A media player's nontrivial logic is the controller: subscribe to native events, project into a normalized state, apply commands. Doing that as a framework-free store keeps it reusable and keeps each framework binding thin. The store interface (`subscribe` + `getState` + `dispatch`) is the smallest shape that both React's `useSyncExternalStore` and Vue's reactivity can consume, which is why the seam is portable rather than merely "not importing React."

## Given up

- We did not build web-component rendering (framework-agnostic but against the React-and-Vue requirement).
- Vue is now a supported framework: `@medialab/vue` ships the same adapter + component shape (`MediaProvider`, composables, play/pause, progress, volume). See the [Vue 3 support note](2026-08-22-vue3-first-class.md).

## Verify

`packages/core` contains no `react`/`react-dom`/`jsx`/`document`/`window` import. The Vue proof-of-concept mounts a component that consumes `useMediaState`/`useMediaCommand` backed by the same core controller and asserts state updates on dispatch — proving a second framework can bind the same store.
