# AGENTS.md — The documentation standard

Classify every in-scope document as a **tutorial** or a **reference**. Tutorials follow an ordered path to an outcome and introduce only what each step needs; references define a lookup scope and current behavior without a teaching sequence. Separate substantial tutorial and reference content; label a section when either part is small.

## One home per fact

Each fact has one home; elsewhere, link there.

| Tier | Job |
|---|---|
| Root `AGENTS.md` | Standing orders an agent needs every session, one to three lines each, linking its home |
| `docs/architecture.md` | <TODO: this project's ordered map — layering, the source of truth, data/command flow, extension points> |
| `docs/design-principles.md` | <TODO: the principles this project commits to, and the rationale for the choices that could have gone another way> |
| `.agents/notes/` | Active decision records: the why and what was given up; `implemented/` notes describe shipped reality in present tense |
| Package README | The per-package contract: config, semantics, limitations, extension points |

## Writing rules

- **Document current state, not change history.** Avoid "previously/now/no longer", PRs, and commits in durable prose; put change stories in commits, PRs, or Agent Notes.
- **Every non-trivial change includes an Agent Note** in the same change ([scope](../.agents/notes/README.md)).
- **One physical line per paragraph** (soft-wrap). Code blocks, tables, and lists keep their formatting.
- Link to an owning doc rather than restating its detail.
