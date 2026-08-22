# medialab — project overview

A framework-agnostic **media player** library with React and Vue 3 adapters, built on an AI-Native harness. A framework-free `core` owns the media layer; each framework is a thin **adapter** that binds its reactivity to it and bundles presentational components.

## Architecture

```
                                  ┌─────────────────────────────────────────────┐
   UI layer (per framework)        │  presentational controller components        │
                                  │  MediaPlayButton · MediaProgress · MediaVolume│
                                  │  MediaTimeDisplay · MediaBufferedBar          │
                                  │  MediaPlaybackRate · MediaFullscreenButton     │
                                  │  MediaCaptionsButton · MediaTextTrackSelect    │
                                  │  MediaTextTrackDisplay                        │
                                  │  read state + dispatch intents                │
                                  └───────────────┬─────────────────────────────┘
                                                  │  React hooks (useMedia*) / Vue composables
                                  ┌───────────────▼─────────────────────────────┐
   adapter layer (per framework)  │  <MediaProvider>                             │
                                  │  owns the media element + a container (full-  │
                                  │  screen target) + exposes controller, full-   │
                                  │  screen, captions via context / provide+inject│
                                  └───────────────┬─────────────────────────────┘
                                                  │  MediaController / MediaCaptions stores
                                  ┌───────────────▼─────────────────────────────┐
   framework-free core            │  packages/core  (no react / vue import)      │
                                  │  createMediaController · createMediaCaptions  │
                                  │  computeBufferedFraction · MediaState ·       │
                                  │  MediaCommand · MediaCaptionsState            │
                                  └───────────────┬─────────────────────────────┘
                                                  │  wraps
                                  ┌───────────────▼─────────────────────────────┐
                                  │  media element  ·  <video>/<audio>            │
                                  │  (single source of truth)                     │
                                  └─────────────────────────────────────────────┘
```

## Workspace

| Path | Role |
|---|---|
| `packages/core` | framework-free media layer: controller (playback), captions store (text tracks), `computeBufferedFraction` helper, types. Single source of truth over the media element. |
| `packages/react` | React adapter + components (provider, hooks, all controller components). |
| `packages/vue` | Vue 3 adapter + components (provider, composables, all controller components). |
| `apps/docs` | Astro + Starlight docs site (with a live React + Vue playground). |
| `theme/media.css` | the design tokens (`--media-*`), the single source of the visual language. |

## core state & commands

**MediaState** (mirrored from the media element): `paused`, `currentTime`, `duration`, `volume`, `muted`, `playbackRate`, `ended`, `buffered`, `buffering`, `error`.

**MediaCommand** (the only way to mutate media): `play`, `pause`, `togglePlay`, `seek{time}`, `setVolume{value}`, `setMuted{value}`, `toggleMute`, `setPlaybackRate{rate}`.

**MediaCaptionsState**: `tracks`, `activeTrackId`, `isEnabled`, `cues` (driven by the element's `textTracks`).

## Components (React + Vue have parity)

- **Playback**: `MediaPlayButton`, `MediaProgress` (buffer rendered inside the single track), `MediaVolume`, `MediaPlaybackRate`.
- **Info**: `MediaTimeDisplay`, `MediaBufferedBar`.
- **Container**: `MediaFullscreenButton`.
- **Captions**: `MediaCaptionsButton`, `MediaTextTrackSelect`, `MediaTextTrackDisplay`.

**Hooks (React) / composables (Vue)**: `useMediaController`, `useMediaState`, `useMediaCommand`, `useMediaElement`, `useMediaFullscreen`, `useMediaCaptions`.

## Design tokens

`theme/media.css` defines the design system via `@theme` (`--color-media-accent`, `--color-media-buffer`, `--color-media-track`, `--color-media-control`, `--color-media-control-fg`, `--radius-media`) and generates the Tailwind utilities both adapters and the docs site consume. It is the single source; the docs `global.css` imports it.

## Commands

```sh
pnpm install
pnpm dev:docs         # docs site (live React + Vue playground)
pnpm typecheck
pnpm test
pnpm lint
```

## Status

- Framework-agnostic core + React and Vue adapters (Vue 3 first-class).
- MVP + extended controls (time, buffered bar, speed, fullscreen, captions) at parity.
- Gates: `typecheck` + `test` + `lint` green; both demos build.
- Deferred: docs site (decision pending), publishing builds (`tsdown` → `dist`), live text-track event re-sync.
