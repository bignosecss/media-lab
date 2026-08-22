---
status: implemented
date: 2026-08-22
---

# Container seam: fullscreen

## Context

Fullscreen is a **container-level UI concern**, not media-element state. The media element's `MediaState` has no notion of it, and `packages/core` (framework-free) must not own a DOM container. So fullscreen needs its own seam in the framework adapter.

## Decision

The framework `MediaProvider` now **owns a container element** (the fullscreen target) that wraps the media element + controls, and exposes fullscreen state + a toggle via context (`React`) / `provide`+`inject` (`Vue`):

- React: `MediaProvider` renders a container `div` with a `containerRef`, tracks `isFullscreen` via `fullscreenchange`, and exposes `{ controller, fullscreen }`. `useMediaFullscreen()` returns `{ isFullscreen, toggle, isSupported }`.
- Vue: same, using a `reactive` fullscreen object provided under `mediaFullscreenKey`, with a `useMediaFullscreen()` composable.
- `MediaFullscreenButton` reads the state and toggles; its icon reflects fullscreen/exit.

`packages/core` stays framework-free and unchanged: fullscreen is a capability of the framework adapter, not media-element state.

## Why

Fullscreen targets a container, not the media element, so putting it in core would either leak DOM into the framework-free layer or model a non-media state there. The provider already owns the media element; making it also own the container is the natural seam, and the fullscreenchange event is the (only) source of truth for fullscreen state.

## Given up

- Fullscreen state in `MediaState`/core — deliberately excluded (it is not media-element state).
- Captions/subtitles: a text-track layer is a separate, larger seam (the media element's `textTracks`, track selection, cue rendering) and is planned but not yet implemented here.

## Verify

`packages/react` and `packages/vue` each have a `MediaFullscreenButton` test (toggles the supplied state, reflects the label). 30 tests pass across the workspace; both demos build with the button wired in.
