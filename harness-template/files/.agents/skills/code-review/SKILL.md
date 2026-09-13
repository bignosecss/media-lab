# code-review

An independent read of a change before merge. The reviewer has not seen the author's reasoning, so it must stand on the code, the PR description, and the Agent Note.

## The author provides

- A PR description naming the behavior change, its scope, and anything deliberately out of scope.
- The Agent Note (for non-trivial changes) with the decision and its verify step.
- Which pre-push checks were run.

## What to evaluate

**Architecture boundary (hard rules)**

<TODO: replace with this project's boundaries. Each line must be checkable against a diff — the reviewer should be able to point at a file and say "this breaks it". Example shape:>

- `<layer A>` stays free of `<dependency B>`: no import of it, no assumptions only it provides.
- `<layer C>` is the only place that touches `<the privileged thing>`.
- Nothing outside `<layer C>` performs `<the mutation>` directly — it goes through `<the intent type>`.
- No component mixes primitive backends.

**State/command contract**

- <TODO: the invariant that keeps the single source of truth true. For a store: every command has an applying branch; every state field is derived from the source and covered by an event mapping; state is emitted as a new snapshot, never mutated.>

**Independently usable**

- <TODO: the per-unit rule — e.g. each component is importable alone, has a default style, and exposes `className` + `children`/render-prop.>

**Types & safety**

- `strict` passes; any `any` has an explaining comment.
- No swallowed errors without naming what they catch.

**Tests & docs**

- New behavior has a test (unit for the core, render test for a component).
- A non-trivial change carries an Agent Note and, where relevant, a doc update — with one home per fact.

## Verdict

Return: `approve`, `request changes` (with the concrete reason and the specific file/line), or `block` (for an architecture-boundary violation). Be specific; do not give style nits that are not rules.
