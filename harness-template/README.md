# harness-template — the portable AI-Native harness

A copy-paste bundle of the **domain-free** machinery this repo used to run itself: standing orders for an agent, decision records, review/pre-push skills, CI, and a strict TypeScript base. Nothing here is media-specific.

It is a **frozen snapshot**, taken 2026-09-13 from `medialab` at its archived state. It is a fork source, not a second home for a live fact: `medialab` is frozen, so nothing here can drift from it. If media-lab is ever revived, delete this directory first.

## Use

From a new project's root:

```sh
cp -R path/to/media-lab/harness-template/files/. .
cp path/to/media-lab/harness-template/AGENTS.template.md AGENTS.md
```

Then work through [PORTING.md](PORTING.md) — every `<TODO: ...>` placeholder in the copied files is a thing only you can fill in.

`files/` mirrors the destination tree exactly, with one deliberate exception: `AGENTS.md` sits outside it. A file with that name is auto-loaded as standing orders by agent harnesses, and this repo must not hand unfilled placeholders to every future session as instructions. Hence the second command.

## What is in it

| Path | What it is |
|---|---|
| `AGENTS.template.md` (outside `files/`) | Standing orders an agent reads every session — copy it to `AGENTS.md`. Mostly placeholders; the point is the *shape*: short rules that link to their home. |
| `.agents/notes/README.md` | The decision-record lifecycle (`proposed` / `implemented` / `archived` / `rejected`) and the required sections. Usable verbatim. |
| `.agents/skills/pre-push-checks/SKILL.md` | Which checks to run for which surface, and what to report. |
| `.agents/skills/code-review/SKILL.md` | Independent review of a change: what to evaluate, and the three verdicts. The architecture-boundary section is the part to rewrite per project. |
| `docs/AGENTS.md` | The documentation standard: tutorial vs reference, and the one-home-per-fact tier table. |
| `.github/workflows/ci.yml` | `install → lint → typecheck → test → audit` on push and PR. |
| `.github/dependabot.yml` | Weekly npm + GitHub Actions updates. |
| `tsconfig.base.json` | The strict base: `strict`, `noImplicitAny`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`. |
| `pnpm-workspace.yaml`, `package.json` scripts | Monorepo shape. |
| `.editorconfig`, `.oxlintrc.json`, `.gitignore` | Editor/lint/ignore defaults. |

## What is deliberately not in it

- Anything media-specific: the design principles, the seam spec, the packages. Those live in `docs/` and are about the player, not the harness.
- Any content that depends on a past project: no package names, no repo URLs, no product prose.
- A README. The new project writes its own.

## The two habits that made it work

Everything else is configuration; these are the load-bearing parts, and they are what to keep even if you throw the rest away.

1. **Write the decision down in the same change.** `.agents/notes/` is why a three-week-paused repo could still be picked up and explained in minutes. A note records the *why* and *what was given up*, which is the part the code cannot tell you.
2. **Keep the gate green before you stop.** The reason this repo could be frozen at zero cost is that `lint`, `typecheck`, `test`, and the docs build all passed at its last commit. A paused project that is green is an asset; one that is red is a debt you have to pay before you are allowed to quit.
