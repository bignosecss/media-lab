---
status: implemented
date: 2026-08-22
---

# Captions: a framework-free text-track store + per-framework components

## Context

Captions are driven by the media element's `textTracks`. Like playback state, the meaningful logic (enumerate tracks, pick the active one, read cues, set a track's mode) is framework-free and belongs in `@medialab/core`; each framework only binds its reactivity to it.

## Decision

- **Core** (`packages/core/src/media-captions.ts`): `createMediaCaptions(getTextTracks)` is the captions analogue of the media controller — a small store over the element's `TextTrackList` with `subscribe`/`getState`/`setEnabled`/`setActiveTrack`/`refresh`. It reads `tracks`, `activeTrackId`, `isEnabled`, and the active track's `cues`, and mutates `mode` on the real tracks.
- **React** and **Vue** providers create the store (reading `mediaRef.textTracks`) and expose it via context / `provide`+`inject`; `useMediaCaptions()` binds reactivity (`useSyncExternalStore` / a reactive view). Components: `MediaCaptionsButton` (toggle), `MediaTextTrackSelect` (choose track), `MediaTextTrackDisplay` (show the active cue).

`@medialab/core` stays framework-free (no `react`/`vue` import); captions state is media-element state, just like playback.

## Why

Consistent with the controller: the non-trivial logic is framework-free and reusable; each adapter is a thin binding. Cues and track selection are read from the real `textTracks`, so the media element remains the source of truth.

## Given up

- Automatic track/cue event wiring (providers re-sync on attach; user actions re-sync via `set*`). Live `cuechange`/`addtrack` re-sync is a follow-up; jsdom cannot exercise real text tracks, so it is not unit-tested and the components are not wired into the demos (which have no tracks). The store + component behavior are covered by unit tests with a mocked track list.

## Verify

`packages/core`, `packages/react`, and `packages/vue` each have captions tests. 41 tests pass across the workspace; `typecheck`/`lint` green; both demos build.
