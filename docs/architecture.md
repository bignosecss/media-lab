# Architecture

## Goal

A framework-agnostic media player (React and Vue 3 adapters) where **every piece of UI is an independently usable component** and **one centralized controller is the single source of truth** for the underlying media element. There is no web-component code.

The design is inspired by (but not a copy of) [media-chrome](https://www.media-chrome.org/docs/en/architecture); see [design-principles.md](design-principles.md) for the principles we follow and the React-specific adaptations.

## Layering

```
┌────────────────────────────────────────────────────────────────┐
│  UI components (packages/react)                                 │
│  MediaPlayButton · MediaProgress · MediaVolume                  │
│  read MediaState, dispatch MediaCommand                         │
└───────────────┬────────────────────────────────────────────────┘
                │ hooks (packages/react)
┌───────────────▼────────────────────────────────────────────────┐
│  <MediaProvider> + useMediaState / useMediaCommand             │
│  subscribes to the controller, re-renders on state change      │
└───────────────┬────────────────────────────────────────────────┘
                │
┌───────────────▼────────────────────────────────────────────────┐
│  controller (packages/core)  — the MIDDLE LAYER                │
│  wraps an element, mirrors native events → MediaState          │
│  applies MediaCommand → element methods                        │
│  single source of truth for media state                        │
└───────────────┬────────────────────────────────────────────────┘
                │
        ┌───────▼────────┐
        │ media element  │  <video>/<audio>/custom (source of truth)
        └────────────────┘
```

## The controller (single source of truth)

The controller (packages/core) is a framework-agnostic object. It:

1. **Wraps a media element** (`attach`). It reads the element's native events (`play`, `pause`, `timeupdate`, `durationchange`, `volumechange`, `waiting`, `canplay`, `ended`, `progress`, `loadedmetadata`).
2. **Mirrors events into an immutable `MediaState` snapshot.** State is *derived from the element*, never owned by a component.
3. **Applies `MediaCommand` to the element.** A command is the only way to mutate media; components never call `element.play()` directly.

The element stays the source of truth; the controller is the only reader/writer.

## Command / state split

The hard boundary that makes components independent and the architecture unidirectional:

- **User intent → `MediaCommand`.** A button press dispatches `{ type: 'togglePlay' }`, a progress drag dispatches `{ type: 'seek', time }`, a volume drag dispatches `{ type: 'setVolume', value }`.
- **Media state → `MediaState`.** Components read the snapshot (`paused`, `currentTime`, `duration`, `volume`, `muted`, `buffered`, ...) and render.

The command/state types live in `@medialab/core` and are the *contract* between components and controller.

## React bindings

`@medialab/react` exposes `<MediaProvider>` and hooks:

- `<MediaProvider mediaElRef | renderMedia>` holds (**owns**) the media element by default and exposes the controller via context. An escape hatch later lets users hand in their own media element (`<canvas>`, a custom element, a remote element).
- `useMediaState(selector?)` subscribes to the snapshot via `useSyncExternalStore`.
- `useMediaCommand()` returns a `dispatch` function.

## Framework adapters (portability)

The design is **framework-agnostic at the core, React-first in practice**. `@medialab/core` is a framework-free **store**: it owns the media element (the single source of truth) and exposes exactly the four methods an adapter needs — `subscribe(listener)`, `getState()`, `dispatch(command)`, `attach(element)` — plus the `MediaState` / `MediaCommand` types. Nothing in `core` imports a UI framework or touches the DOM beyond the media element.

This is deliberately the same shape as a tiny external store, which is what makes it portable. Each framework provides an **adapter** that binds its reactivity to that store:

- **React** (`packages/react`) binds it with `useSyncExternalStore` and exposes it via Context.
- **Vue** (`packages/vue`, proof-of-concept) binds `subscribe`/`getState`/`dispatch` to `shallowRef` + an effect and exposes it via `provide`/`inject`.

Adding a framework means adding an adapter, not changing `core`:

| What                                    | Where it lives                                      | Shared across frameworks? |
|-----------------------------------------|-----------------------------------------------------|---------------------------|
| Controller, state/command types, element interaction | `packages/core`                            | yes |
| Reactivity glue + provider              | `packages/<framework>` (e.g. `react`, `vue`)          | no |
| Presentational components (JSX/SFC markup) | bundled in `packages/<framework>` (e.g. React's in `packages/react`) | no |

An adapter contract is five capabilities: **provide** the controller (context/`provide`), **read** state (`useMediaState`/a composable), **dispatch** commands (`useMediaCommand`), **own & attach the element** (`<MediaProvider>`/a provider), and (optionally) **read** the element. The command/state types and the controller are shared; only the glue and markup are per-framework.

Both React and Vue 3 are supported: `packages/react` and `packages/vue` each bundle an adapter + its presentational components over the shared `@medialab/core`. Adding another framework means adding one more bundle of this shape — the core and the seam never change.

## Component model

Each controller component (e.g. `MediaPlayButton`) is a thin behavior wrapper:

- reads media state via a hook,
- dispatches a command on interaction,
- renders a **default styled** element but accepts `className` and a `children`/render-prop to swap the presentation entirely.

This keeps behavior (read state + dispatch) separate from presentation (default style vs. user-provided component), which is what makes each element independently usable.

## Extension points

- **New controller component** → add to `packages/react` (its components), read state via a hook, dispatch a command. No change to `packages/core`.
- **New media state** → add a field to `MediaState` (+ the event mapping in the controller) and a selector. The element is the source; it must already expose the value.
- **New command** → add a member to `MediaCommand` and its applying branch in the controller.

Keep media-specific behavior in `core`, a framework's reactivity glue and its presentational components bundled in its framework package (`react`/`vue`). Do not put element access or state ownership in a presentational component — and never in `core`.
