---
status: implemented
date: 2026-08-22
---

# Accessible primitives on Base UI (not Radix)

## Context

The first milestone used `@radix-ui/react-slider` for the progress and volume controls. shadcn/ui has since moved its default headless backend from Radix to **Base UI** (`@base-ui-components/react`, from MUI), keeping Radix and React Aria as alternates and positioning itself as a component-distribution platform rather than a Radix wrapper. We reviewed whether to follow.

## Decision

Use Base UI for the accessible primitives, and replace the Radix slider with Base UI's `Slider`. The accessible name on a Base UI slider goes on `Slider.Thumb` (it renders the hidden native `<input type="range">` that carries `role="slider"`); `Slider.Control` is a `role="group"` wrapper, not the slider element.

The dependency is `@base-ui-components/react` at `1.0.0-rc.0`.

## Why

- The ecosystem and Base UI's component coverage (menus, selects, combo boxes for settings, subtitle and track selection) are what a full media player will need, and that is where shadcn and the community are heading.
- **AI consistency**: AI-assisted tooling trained on mixed-era code blends Base UI (`render`, `data-open`) and Radix (`asChild`, `data-[state=open]`) APIs, producing silent type errors. Locking one backend and writing it into `AGENTS.md` is what prevents subagents from mixing primitives; choosing now, while only one primitive is in play, is cheapest.

## Given up

- Radix's maturity and our already-working slider. There is **no** immediate accessibility or functional gain for a single slider — this is a forward-looking and AI-consistency choice, not a correctness fix.
- Base UI is at `1.0.0-rc.0` (not a stable `1.x`), which carries a small but real churn risk; shadcn/ui already ships it as its default, so it is treated as production-ready but pinned.

## Verify

`pnpm typecheck && pnpm test` (components) — the seek slider's accessible name and `max` come from Base UI's native range input; the volume slider reflects `volume` and `0` when muted.
