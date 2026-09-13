# The media player seam — a portable spec

This is the smallest transferable thing built here: the design of a framework-agnostic media layer, written so it can be handed to an agent (or a person) in a project that does not have this repo and rebuilt from scratch in an afternoon.

It is not an API reference for the packages here, and it deliberately contains no file paths or package names — every path in this repo is an implementation detail of one instance of this design. Read [architecture.md](architecture.md) for the repo-internal map; read this when you need to build a player somewhere else, or to judge whether a proposed change keeps the seam intact.

## The shape, in one paragraph

Wrap the media element in a **store** that owns it. The store reads the element's native events and projects them into an **immutable state snapshot**; it exposes **commands** as the only way to mutate the element. UI components never touch the element — they read the snapshot and dispatch commands. The store is completely framework-free (four methods an adapter binds), so each framework adds an adapter and a set of presentational components, and the core never changes. The element, not the store, is the source of truth: state is *derived* on every event, never mirrored in a parallel model that can drift.

## 1. The store contract

```ts
interface MediaController {
  attach(element: MediaElementLike | null): void;   // null clears
  detach(): void;
  subscribe(listener: () => void): () => void;      // returns unsubscribe
  getState(): MediaState;
  dispatch(command: MediaCommand): void;
  getMediaElement(): MediaElementLike | null;
}
```

An adapter binds exactly four of those: **provide** the store (context / `provide`+`inject`), **read** state (`getState` + `subscribe`), **dispatch** commands, and **attach** the element. `detach` and `getMediaElement` are for the owner and for escape hatches.

Two properties make this bindable in any framework:

- `getState()` returns a **stable reference** that changes only when state changes. That is what makes React's `useSyncExternalStore` work without extra memoization, and what makes a Vue `shallowRef` update on the same tick.
- `subscribe` is a plain listener set. No framework scheduler, no batching promise, no observables.

## 2. The element surface — the key portability trick

The store does **not** depend on `HTMLMediaElement`. It depends on the minimal interface it actually uses:

```ts
interface MediaElementLike {
  paused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  ended: boolean;
  buffered: { length: number; start(index: number): number; end(index: number): number };
  error?: { readonly message?: string } | null;
  addEventListener(type: string, listener: (event: Event) => void): void;
  removeEventListener(type: string, listener: (event: Event) => void): void;
  play(): Promise<void> | void;
  pause(): void;
}
```

A real `<video>`/`<audio>` satisfies this structurally; so does a test double, a `<canvas>`-based player, or a remote-controlled element in another frame. This one decision is why the core has no DOM tests and why a non-browser host is possible at all. Keep it.

## 3. The command/state split

This is the hard boundary. State is what the element *is*; commands are what the user *wants*.

```ts
type MediaCommand =
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'togglePlay' }
  | { type: 'seek'; time: number }
  | { type: 'setVolume'; value: number }
  | { type: 'setMuted'; value: boolean }
  | { type: 'toggleMute' }
  | { type: 'setPlaybackRate'; rate: number };

interface MediaState {
  paused: boolean;
  currentTime: number;      // seconds
  duration: number;         // seconds; Infinity/NaN when unknown
  volume: number;           // 0..1
  muted: boolean;
  playbackRate: number;
  ended: boolean;
  buffered: { start: number; end: number }[];
  buffering: boolean;       // element is waiting for data
  error: string | null;
}
```

Rules that keep the boundary real:

- A command is the **only** way to mutate media. If a component calls `element.play()`, the seam is broken.
- `MediaState` is immutable. Every sync builds a **new object** and emits; never mutate the snapshot in place, or `useSyncExternalStore` and `shallowRef` will both miss the change.
- `togglePlay` reads `element.paused` (the source of truth), not `state.paused` (a projection that may be a tick stale).
- Commands validate: `seek` clamps to `[0, duration]` (and to a huge bound when duration is not finite); `setVolume` clamps to `[0, 1]`. Do the clamping in the store so every UI gets it free.

## 4. Wiring

**In** — subscribe to these events and re-read the whole state on each one:

`play`, `pause`, `timeupdate`, `durationchange`, `volumechange`, `waiting`, `playing`, `canplay`, `loadedmetadata`, `ended`, `progress`, `error`.

**Buffering is not read from the element.** There is no `buffering` property to read, so the store owns one boolean of its own: set it on `waiting`, clear it on `playing` / `canplay`. This is the one piece of state that is not a pure projection — keep it inside the store, never in a component.

**Out** — commands map to element mutations: `play`/`pause`/`togglePlay` to the methods, `seek` to `currentTime`, `setVolume` to `volume`, `setMuted`/`toggleMute` to `muted`, `setPlaybackRate` to `playbackRate`. Re-sync after applying, so the UI does not wait for the element's own event to catch up.

**Attach** is idempotent for the same element, removes listeners from the previous one, and resets to the initial snapshot when detached (paused, time 0, duration 0, volume 1, rate 1, no buffer, no error).

**A second store of the same shape** covers text tracks, because captions do not belong in `MediaState`: `{ tracks, activeTrackId, isEnabled, cues }`, with `setEnabled`, `setActiveTrack(id)` and `refresh()`. It reads the element's `TextTrackList` through its own minimal interface (`TextTrackLike`, `TextTrackListLike`). Two non-obvious decisions worth copying:

- **Identity falls back to the index.** Real tracks frequently have an empty `id`, so the id exposed in state is `track.id || String(index)` and `setActiveTrack` matches either form. Never key a track list by `id` alone.
- **Enabled is derived, not stored.** `isEnabled` is `activeTrack !== null`, computed from which track has `mode === 'showing'`. Setting enablement *writes* track modes and re-reads them; it does not keep a separate flag that can disagree with the element.

## 5. Component rules

A controller component has exactly two parts, and they never depend on each other:

- **Behavior**: read a state selector, dispatch a command on interaction.
- **Presentation**: a default styled element, overridable by `className` and a `children`/render-prop escape hatch.

Each component must be usable alone — importable on its own, styled by default, restylable without forking. Component names describe the primary interaction (`MediaPlayButton`, `MediaProgress`, `MediaVolume`), not the markup.

Derive shared math once, in the core, not in each component: the buffered layer above a progress bar is one helper (`furthest buffered end / duration`, clamped, `0` when duration is unknown) used by every component that draws a buffer.

## 6. Accessibility stance

Take keyboard navigation, ARIA slider semantics, focus management and drag handling from a maintained headless primitive library rather than hand-rolling them for a progress bar and a volume slider. **Pick one backend and enforce it in the project rules**, because the realistic failure mode is an agent mixing two libraries' APIs in one component. Note the asymmetry: a primitive library may exist only for one framework — in that case the other framework's bundle uses native elements with equivalent semantics, and that is a documented decision, not an oversight.

## 7. Extension points

- **New state field** → add it to the snapshot and to the event that carries it. The element must already expose the value; the core never invents media state.
- **New command** → add a member to the union and an applying branch. A command with no branch is a silent no-op.
- **New component** → read state, dispatch a command. No core change.
- **New framework** → add an adapter and markup bundle. No core change. If a framework needs a core change, the seam is wrong.

## 8. Known gaps to plan for

These are the places the reference implementation stopped. None are hard; all are easy to forget.

- **`play()` rejection is swallowed.** Autoplay policy rejects the promise; the reference does `void element.play()`. A production player needs to surface it (`NotAllowedError` → show a click-to-play affordance).
- **No `ratechange` / `seeking` / `seeked` events.** Rate set through a command is reflected, but an *external* rate change or a seek's in-flight state is not re-captured. Same for `stalled` / `suspend` / `emptied` / `abort`.
- **Captions do not live-refresh.** The captions store exposes `refresh()`, but nothing subscribes `cuechange` / `addtrack` / `removetrack` to it — so the cue list is a snapshot from attach time.
- **No picture-in-picture state**, no track language selection UI, no adaptive streaming (HLS/DASH belongs to a separate library), no network-quality badge.

## 9. Deliberately out of scope

Framework code in the core (no React, no Vue, no DOM assumptions beyond the element interface); web components and `slot` machinery; an opinionated app design system; owning the media *pipeline* (transcoding, CDN, DRM). The core stays usable by anything that can supply an element and read a snapshot.

## Handing this to an agent

Give it this file plus one sentence about the target: the framework(s), whether captions and fullscreen are in scope, and where media comes from. The spec is enough to produce the store, the two adapters, and the component set without reading any existing player's source — which is the point of writing it down instead of keeping the code.
