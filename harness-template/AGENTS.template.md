# AGENTS.md

<TODO: one sentence — what this project is, its shape in one clause, and the doc an agent must read before changing code.>

## Repository layout

```
<TODO: keep this in sync with reality — one line per top-level unit, and what it owns>
packages/<name>       <what it owns>
apps/<name>           <what it owns>
docs/                 architecture, design principles, docs standard
.agents/notes/        decision records (implemented / proposed / archived / rejected)
.agents/skills/       reusable agent workflows (pre-push checks, code review, ...)
```

## Commands

```sh
pnpm install
pnpm dev:<app>           # <TODO: what it runs>
pnpm typecheck           # tsc --noEmit across all packages
pnpm test                # vitest across all packages
pnpm lint                # oxlint across the repo
```

Run checks before pushing via [.agents/skills/pre-push-checks](.agents/skills/pre-push-checks/SKILL.md); report only the commands you ran.

## Conventions

- Every package is `@<scope>/<name>`; ESM everywhere (`"type": "module"`).
- **TypeScript strict** (`strict: true`, `noImplicitAny`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`). No `any` without an explaining comment.
- **<TODO: the hardest architectural boundary, stated so a reviewer can point at a line and say "this breaks it".>** <One consequence per line.>
- **<TODO: the second boundary. If there is only one, delete this.>**
- **One primitive backend** (<TODO: name the accessible-primitive library, or delete this rule>). Never mix primitive libraries in the same component; agents must not introduce a second one without an Agent Note.
- **One home per fact.** A decision lives once — in a doc or an Agent Note; elsewhere link, don't restate. Non-trivial changes carry an **Agent Note** in the same PR ([when](#agent-notes)).
- Files end with exactly one trailing newline.

## Agent Notes

A non-trivial change (new behavior, API shape, closed decision) requires an Agent Note in `.agents/notes/` committed in the same change. Put the `why` and what was given up there. See [.agents/notes/README.md](.agents/notes/README.md). Archived notes are frozen history — never edit.

## AI-Native workflow

The orchestrator (parent agent) owns the foundation and the cross-cutting API; independent feature slices are delegated to subagents in parallel and survive a code-review agent before merge. See the `code-review` skill for what counts as independent.

## Editing these instructions

Keep each rule self-contained and link the doc that owns the detail. Condense when the meaning survives.
