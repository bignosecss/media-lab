# medialab

A framework-agnostic media player library (React and Vue 3 adapters) and the AI-Native harness that builds it, modeled on [media-chrome](https://www.media-chrome.org/docs/en/architecture)'s architecture: independently usable controller components, a centralized controller that is the single source of truth for media state, and a split between user-intent events and media state.

> **Status: archived (2026-09-13).** Not maintained. It reached a complete, green state on 2026-08-22 and is kept as a read-only reference.
>
> - **Why it stopped.** The niche it fills — a general-purpose player library — is already served well by [media-chrome](https://www.media-chrome.org/) and [xgplayer](https://github.com/bytedance/xgplayer). The code was never the problem; the maintainer's time went elsewhere.
> - **Read this first if a media need ever appears:** [docs/media-player-seam.md](docs/media-player-seam.md) — the portable, path-free spec of the seam, written to be handed to an agent in a project that does not have this repo.
> - **The reusable machinery:** [harness-template/](harness-template/) — the domain-free AI-Native harness (standing orders, Agent Notes, skills, CI, strict TS base) as a copy-paste bundle for a new project.
> - **Do not** run dependency upgrades here. The pinned stack is deliberate — see [Turning Dependabot off](#turning-dependabot-off).
> - Still live: <https://bignosecss.github.io/media-lab/>. Decisions: [.agents/notes/](.agents/notes/), starting with [the archive note](.agents/notes/implemented/2026-09-13-archive-and-harness-extraction.md).

Repo-internal detail lives in [docs/architecture.md](docs/architecture.md) and [docs/design-principles.md](docs/design-principles.md); neither needs to hold to browse the frozen code.

## Workspace

```
packages/core         framework-free media controller (state + command; single source of truth)
packages/react        React adapter + components (MediaProvider, hooks, play/pause, progress, volume)
packages/vue          Vue 3 adapter + components (MediaProvider, composables, play/pause, progress, volume)
apps/docs             Astro + Starlight docs site (with a live React + Vue playground)
```

## Commands

```sh
pnpm install
pnpm dev:docs         # run the docs site (live React + Vue playground)
pnpm typecheck
pnpm test
pnpm lint
```

> Publishing builds (`tsdown` → `dist/`) were deferred and never built: packages resolve from `src/`, which is why the docs site and tests run without a build step.

## Turning Dependabot off

Version updates are driven entirely by `.github/dependabot.yml`; **deleting that file is the off switch** ([GitHub docs](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configure-version-updates)). That file has been deleted in this repo, so there is nothing left to do here.

- **In the UI** (equivalent): Settings → Code security → Dependabot → "Dependabot version updates" → **Disable**.
- **Softer options:** set `open-pull-requests-limit: 0` under an ecosystem to keep it configured but silent, or comment out that ecosystem. A faithful copy of the original config is kept at [harness-template/files/.github/dependabot.yml](harness-template/files/.github/dependabot.yml) for the next project — it is inert there, since Dependabot only reads the file at a repo root.
- **Archiving is not a substitute.** Archiving makes pull requests read-only, but the GitHub docs do not state that it stops the scheduled runs. Delete the file if you want certainty.
- **Deleting the file does not close PRs already opened.** Filter the PR list by `author:app/dependabot` and close them.
- **If you do nothing at all**, GitHub pauses version updates by itself once a repository has had a Dependabot PR open and untouched for 90 days ([auto-deactivation](https://docs.github.com/en/code-security/reference/supply-chain-security/troubleshoot-dependabot/dependabot-updates-stopped)).
- Dependabot **alerts** and **security updates** are separate toggles on the same Settings page. Alerts are worth leaving on.

## Contributing (AI-Native workflow)

Follow `AGENTS.md`. Every non-trivial change carries an **Agent Note** in `.agents/notes/` and an **Agent Skill** review before merge.
