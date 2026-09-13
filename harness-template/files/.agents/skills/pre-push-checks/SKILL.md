# pre-push-checks

Run the relevant checks before pushing. Report only commands you actually ran. Do not default to the full suite or repeat a passing check without a reason.

## Which checks

Match evidence to the surface:

- **Behavior** → `pnpm test` (vitest) for the package you touched.
- **Types** → `pnpm typecheck` (runs `tsc --noEmit` across packages).
- **Lint** → `pnpm lint` (oxlint across the repo; it is fast enough that there is no reason to narrow it).
- **App still builds/runs** → the `<TODO: dev/build command>` only by explicit request, or when you changed the app or a shared seam.

## Order

1. `pnpm typecheck`
2. `pnpm test`
3. `pnpm lint`

## On failure

- A type error: fix it, do not suppress with `any` without a comment.
- A test failure: it is a behavior bug or an obsolete test — decide which, and update the behavior's tests with it (see `AGENTS.md`).
- Do not bypass the check. If a check fails for an environment reason (sandbox, missing key, `node_modules` not installed), say so explicitly and surface it, rather than skipping silently.

## Report

Report the commands you ran in the final summary with a one-line outcome each. Do not claim a check ran unless you ran it.
