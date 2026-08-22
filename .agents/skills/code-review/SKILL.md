# code-review

An independent read of a change before merge. The reviewer has not seen the author's reasoning, so it must stand on the code, the PR description, and the Agent Note.

## The author provides

- A PR description naming the behavior change, its scope, and anything deliberately out of scope.
- The Agent Note (for non-trivial changes) with the decision and its verify step.
- Which pre-push checks were run.

## What to evaluate

**Architecture boundary (hard rules)**
- `packages/core` stays framework-agnostic: no `react`/`vue` import, no DOM-only assumptions beyond the media element.
- `packages/react` is the React bundle: only it touches React context/`useSyncExternalStore`.
- `packages/vue` is the Vue 3 bundle: only it touches `provide`/`inject`/`shallowRef`.
- A framework's presentational components read state and dispatch commands only; they never touch the media element or own behavior state.
- No component reaches into the element (`element.play()` etc.) — it dispatches a `MediaCommand`.
- No component mixes primitive backends: Base UI is React-only, so the Vue bundle uses native elements.

**State/command contract**
- Commands are members of the `MediaCommand` union; all members have a applying branch in the controller.
- State fields are derived from the element and covered by an event mapping.
- `MediaState` is immutable; the controller emits a new snapshot, never mutates.

**Independently usable**
- Each component is importable alone, has a default style, and exposes `className` + `children`/render-prop.

**Types & safety**
- `strict` passes; any `any` has an explaining comment.
- No swallowed errors without naming what they catch.

**Tests & docs**
- New behavior has a test (unit for the controller, render test for a component).
- A non-trivial change carries an Agent Note and, where relevant, a doc update — with one home per fact.

## Verdict

Return: `approve`, `request changes` (with the concrete reason and the specific file/line), or `block` (for an architecture-boundary violation). Be specific; do not give style nits that are not rules.
