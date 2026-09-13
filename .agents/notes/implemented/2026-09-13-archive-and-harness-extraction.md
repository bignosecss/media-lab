---
status: implemented
date: 2026-09-13
---

# Freeze the project and extract the harness

## Context

The player reached a complete, green state on 2026-08-22 and has not been touched since. The maintainer's time is committed elsewhere, and the niche this repo fills — a general-purpose framework-agnostic player library — is already served by [media-chrome](https://www.media-chrome.org/) and [xgplayer](https://github.com/bytedance/xgplayer). Growing the component set further buys nothing that is not already available.

## Decision

The project is **frozen, not deleted**, and the parts worth keeping are lifted out of it:

- `README.md` carries the archive status and the reason; `.github/dependabot.yml` is deleted so the frozen stack stops attracting upgrade pull requests.
- [docs/media-player-seam.md](../../../docs/media-player-seam.md) is the **portable** form of the design: the store contract, the minimal element interface, the command/state split, the event wiring, the component rules, the accessibility stance, the extension points, and the gaps the reference implementation stopped at. It contains no paths or package names, so it can be handed to an agent building a player elsewhere.
- [harness-template/](../../../harness-template/) is the **domain-free** harness — the `AGENTS.md` template, the Agent Notes lifecycle, both skills, CI, Dependabot, `tsconfig.base.json`, and the workspace/editor/lint config — bundled for copying into a new project, with `PORTING.md` naming every placeholder.
- `packages/*`, `apps/docs`, `theme/`, and the existing `docs/` pages stay in place as the frozen reference.

## Why

Two artifacts here are not commodity and do not depend on the media domain: the harness, which is the infrastructure an "let an agent build it per need" workflow actually runs on, and the distilled seam, which is what makes that workflow cheap — an agent reads two pages instead of re-deriving a design from someone else's large codebase. The code itself is the commodity part.

Freezing while every gate is green is also the cheapest possible exit: no half-finished refactor, no broken `main`, no debt to pay before being allowed to stop.

## Given up

- Ever publishing a `@medialab/*` release. The packages were never publishable (`private: true`, `0.0.0`, resolved from `src`), and the `tsdown` build stays unbuilt.
- The remaining roadmap: live caption refresh (`cuechange`/`addtrack`), picture-in-picture, track language selection, adaptive streaming, and the dependency upgrades Dependabot proposed (Astro 7, TypeScript 7, Vitest 4).
- Per-package READMEs. `docs/AGENTS.md` assigns them a tier, but none were written; the tier remains the right standard for the next project, just unfulfilled here.

## Verify

`pnpm lint`, `pnpm typecheck`, `pnpm test` (44 tests), and `pnpm --filter docs build` (13 pages) all pass on the frozen commit. Every file in `harness-template/files/` that is meant to be filled in carries a `<TODO>`, and the single rename needed when porting (`AGENTS.template.md` → `AGENTS.md`) is documented in both `harness-template/README.md` and `PORTING.md`.
