# PORTING — checklist for a new project

Run these two commands first (from the new repo's root), then walk this list. Every item is either a placeholder to replace or a decision to make. Nothing should be copied unchanged except where marked **verbatim**.

```sh
cp -R <this-repo>/harness-template/files/. .
cp <this-repo>/harness-template/AGENTS.template.md AGENTS.md
```

The second command is not optional and is the only rename in the bundle — see [README.md](README.md#use) for why `AGENTS.md` is kept out of `files/`.

## 1. Fill in the placeholders

Search the copied tree for `TODO` — that is the complete list.

| File | What to fill in |
|---|---|
| `AGENTS.md` | The one-sentence project description + the doc to read first; the repository layout block; the `<dev>` command; the package scope; the one or two **hard architectural boundaries**; the primitive library (or delete that rule if the project has none). |
| `docs/AGENTS.md` | **Verbatim.** Only the tier table's middle rows name project docs — point them at this project's `docs/*`. |
| `package.json` | `name`, `description`, `keywords`, the `dev:*` script, the `packageManager` version. |
| `pnpm-workspace.yaml` | Glob list. **Verbatim** if it is a monorepo; delete the file for a single package. |
| `tsconfig.base.json` | Drop `"jsx"` unless the project is React/JSX. Everything else **verbatim**. |
| `.oxlintrc.json`, `.editorconfig`, `.gitignore` | **Verbatim.** Add the framework's build dir to `.gitignore` (`dist/` is already there). |
| `.github/workflows/ci.yml` | `node-version`; keep the audit step. Delete the workflow if the project is not on GitHub. |
| `.github/dependabot.yml` | **Verbatim.** Or delete it — see §4. |

## 2. Rewrite the two rules that carry the architecture

`AGENTS.md` in the source project had a specific job: it made an architectural boundary enforceable in one line each, so an agent could not silently violate it. Yours will be different, but it must be equally concrete. The test: *could a reviewer point at a line and say "this breaks rule N"?* If not, the rule is prose, not a rule.

Put the long-form rationale in `docs/design-principles.md` (create it) and link to it. `AGENTS.md` gets one line per boundary.

## 3. Rewrite the review boundary section

`.agents/skills/code-review/SKILL.md` → **Architecture boundary (hard rules)** currently lists the media project's boundaries. Replace with this project's; leave the other sections (contract, independently usable, types, tests) as they are.

## 4. Decide whether you want Dependabot

Dependabot is a good default and a bad fit for a project you may not feed. It opens PRs weekly; an unfed project accumulates them (the source repo had 16 open branches when it was archived) and they become noise that makes the repo look alive when it is not.

- **Actively developing** → keep it.
- **Might pause** → keep it, but you will have to remember to turn it off when you stop ([how](../README.md#turning-dependabot-off) is in the bridge README).
- **Definitely a side project** → delete `.github/dependabot.yml`, or reduce to `open-pull-requests-limit: 1`.

## 5. First commit

Two things to do before the first commit, in this order:

1. `pnpm install` — the lockfile must exist and CI is set to `--frozen-lockfile`.
2. Write the first Agent Note: `.agents/notes/implemented/<date>-bootstrap.md`, recording why the harness is shaped this way. It is the note that explains every later note.

Then run the gate: `pnpm lint && pnpm typecheck && pnpm test`. If any of those commands do not exist yet, the `pre-push-checks` skill will lie to future agents — make them exist or fix the skill in the same commit.

## 6. What to leave behind

Do not port from the source repo: `docs/architecture.md`, `docs/design-principles.md`, `theme/`, or any package. Those describe a media player. The one media artifact worth carrying if a media need ever appears is `docs/media-player-seam.md` — a path-free spec of the seam, not of this repo.
