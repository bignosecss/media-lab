---
status: proposed
date: 2026-08-23
---

# Astro 7 upgrade (combined, not per-package)

## Context

Dependabot opened five PRs bumping the docs stack one package at a time: astro 5.18.2→7.2.4, `@astrojs/mdx`→7.0.7, `@astrojs/starlight`→0.41.7, `@astrojs/react`→6.0.4, `@astrojs/vue`→7.0.2. Merged individually, four of the five fail CI (astro 7 drops the `./jsx/rehype.js` subpath `@astrojs/mdx@4` imports; mdx 7 and starlight 0.41 both peer-require `astro ^7`, so they cannot run on astro 5).

## Decision

Upgrade the whole astro 7 family in one change: astro 7.2.4, `@astrojs/mdx` ^7.0.7, `@astrojs/starlight` 0.41.7, `@astrojs/react` ^6.0.4, `@astrojs/vue` ^7.0.2, with the dependabot PRs for these packages closed in favor of this single branch. One config migration is required: Starlight v0.33 changed `social` from an object to an array of `{ icon, label, href }` items, so `apps/docs/astro.config.mjs` uses the array form.

## Why

The packages are peers of astro 7; their versions are only meaningful together, so a combined upgrade is the only mergeable shape. Merging the five dependabot PRs in sequence would leave main red between merges and produce lockfile conflicts.

## Given up

Dependabot's per-package granularity and independent rollback. If a future astro 7 patch is bad, we roll back the whole family, not one package. `@astrojs/react` 6 has no astro peer constraint and would have merged alone; it rides along to stay aligned with the family.

## Verify

`pnpm lint && pnpm typecheck && pnpm test && pnpm --filter docs build` all green (verified locally with the full combined set); `pnpm audit --prod` drops from 10 vulnerabilities to 1 (a `sharp` advisory, non-critical).
