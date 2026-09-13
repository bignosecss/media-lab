# Agent Notes

An **Agent Note** is a short decision record: the why, what was given up, and how to verify. It is the memory of the project for future agents.

## When to write one

A non-trivial change requires an Agent Note committed in the same change. Non-trivial means any of:

- a new behavior or package,
- a closed design decision or API shape,
- a rejected alternative worth remembering,
- a cross-cutting change (typecheck/test/lint/config) that future agents could reasonably redo wrongly.

Mechanical or local edits (typos, renaming within one file, formatting) are exempt.

## Where

```
.agents/notes/
  proposed/     not yet decided
  implemented/  shipped, described in present tense
  archived/     frozen history — never edit (file name keeps the original date)
  rejected/     considered and declined, with the reason
```

## Naming

`YYYY-MM-DD-<kebab-slug>.md` in the relevant directory.

## Content

Keep it to the decision; do not narrate code or restate a doc. Cover:

- **Context** — the problem in one or two lines.
- **Decision** — the choice and its shape.
- **Why** — the tradeoff that favored it.
- **Given up** — what the alternative would have bought.
- **Verify** — the check that proves it (a test, a gate, a command).

An implemented note describes shipped reality in present tense, not the change story.

## Lifecycle

`proposed` → `implemented` once merged → `archived` when superseded. Moving a note to `archived` marks it frozen: never edit it again, and never treat it as current authority.

## Reading

Read the relevant notes before changing the behavior they describe. A note is the `why`; the code and docs are the `what` and `how`.
