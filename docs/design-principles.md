# Design principles

These are the commitments of this project. Adapted from [media-chrome's design principles](https://www.media-chrome.org/docs/en/design-principles); the React-specific choices are ours.

## Elements should be independently usable

Each UI element (a play button, a progress bar, a volume control) works on its own, the way an HTML `<button>` works outside a `<form>`. A component: imports alone, carries a default style, and accepts `className` + a `children`/render-prop escape hatch. Users can use our components, restyle them, or swap in their own component that reads the same hooks.

## Unidirectional data flow, React-first

The architecture is compatible with React's one-way flow: state flows down, intents flow up. This is possible because of the next principle.

## Events for user actions, state for media state

User interaction emits an **intent** (`MediaCommand`); media state is a **snapshot** (`MediaState`). The controller is the only thing that reads the element or mutates it. No component reaches into the media element.

We keep media-chrome's "events for user actions, attrs/props for media state" split, but as a typed command union and a typed state snapshot instead of DOM attributes — because we are React-only.

## A centralized controller, not direct references

media-chrome moved from UI elements discovering a media container (and holding a direct reference) to a single controller handling all operations. We do the same: `@react-media/core`'s controller is the single reader/writer of the element. This makes debugging, monitoring interaction, and refactoring easier.

## The media element is the single source of truth

State is *derived from the element*, not mirrored in a separate store that can drift. The controller subscribes to native events and projects them into an immutable snapshot; the element's own values always win.

## Adopt accessible primitives (Radix), not a UI kit

Accessibility comes from battle-tested primitives, not from a styling library. We use `@radix-ui/react-slider` for the progress and volume controls (keyboard navigation, ARIA slider semantics, focus management, drag handling). We do **not** adopt the full shadcn/ui system (CLI, registry, components.json) — it is app-oriented and adds churn we don't need. We follow the **shadcn pattern**: headless Radix primitives + Tailwind v4 utilities + CSS-variable design tokens, with the components owned (copied) in our repo so users can restyle or replace them.

## Styling: Tailwind v4 + CSS-variable tokens

- Component styles are **Tailwind v4** utilities.
- Theming is **CSS custom properties** (`--media-*` namespace, defined via Tailwind v4 `@theme`) so users can override tokens and restyle without forking.
- Defaults look good; overrides and full `className` replacement are always possible.

## Behavior and presentation are separate

A controller component has two parts: the **behavior** (read a state selector, dispatch a command on interaction) and the **presentation** (default style, or a user-supplied `children`/render-prop). Neither depends on the other, so a user can keep our behavior and bring their own markup.

## Named consistently

- Package scope `@react-media/`.
- Component names describe the primary interaction: `MediaPlayButton`, `MediaProgress`, `MediaVolume`.

## Progressive capability

The player starts with the minimum (play/pause, progress, volume) and grows incrementally without changing the seams. Each new control is an independent component.

## What we deliberately keep out

Framework-specific code in the core (`@react-media/core` is framework-agnostic, React-free), web-component/`slot` machinery, and an opinionated app design system. The core must stay usable by any React (or non-React) consumer that can supply a media element and read the state.
