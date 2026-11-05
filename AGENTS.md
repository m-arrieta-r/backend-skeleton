# AGENTS.md

Instructions for AI coding agents working **in this repository**. People are welcome to read it too.

## What this repository is

A **reference** (not a framework or library) for organizing backend code by **app cases**
(vertical slicing) with optional Clean Architecture and DDD. Its value lies in its documentation
and examples, so they must stay consistent with each other.

- Canonical rules: [`doc/conventions.md`](doc/conventions.md). Read this first.
- Runnable reference: [`examples/blog-api`](examples/blog-api), with zero runtime dependencies on Node ≥ 22.18.
- Boundary checker: [`scripts/check-boundaries.mjs`](scripts/check-boundaries.mjs), with zero dependencies.
- Portable assets for other projects: [`templates/AGENTS.md`](templates/AGENTS.md) and
  [`skills/create-app-case`](skills/create-app-case/SKILL.md), published as the Claude Code plugin
  `app-cases` through [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json).
- Map for LLMs: [`llms.txt`](llms.txt).

## Commands

Run from the repository root:

```bash
npm run check                 # everything below
npm run check:example         # blog-api: typecheck + boundaries + tests (needs `npm ci --prefix examples/blog-api` once)
npm run test:scripts          # tests of the boundary checker
```

Inside `examples/blog-api`, `npm start` runs the demo server on port 3000.

## Working rules

1. **Follow [`doc/conventions.md`](doc/conventions.md).** If you change a rule, update that file,
   the checker, `templates/AGENTS.md` and the skill **in the same change**.
2. **Keep the examples small and dependency-free.** `blog-api` has no runtime dependencies,
   and its only dev dependencies are `typescript` and `@types/node`. Do not add frameworks to it.
   A framework-specific example belongs in its own folder or repository.
3. **One app case = one folder.** When you add an app case to an example, use the
   [`create-app-case`](skills/create-app-case/SKILL.md) procedure, including the slice card and tests.
4. **Docs are in English**, concise, and quote sources when making architectural claims.
5. **Links must be relative** inside the repository. The GitHub owner is `m-arrieta-r`.
6. Run `npm run check` before you finish. A change is not done while it fails.

## Layout of this repository

```
AGENTS.md, CLAUDE.md, llms.txt   agent entry points
.claude-plugin/marketplace.json  Claude Code marketplace: plugin "app-cases" = skills/
doc/                             concepts: conventions, app cases, domain, repository, AI agents
examples/blog-api/               runnable, tested reference (start here for code)
examples/*                       folder-shape illustrations (not runnable, intentionally minimal)
scripts/                         check-boundaries.mjs (+ tests)
skills/create-app-case/          portable Agent Skill to scaffold a slice
templates/                       files to copy into your own project
```
