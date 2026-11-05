---
name: create-app-case
description: Scaffold a new app case (vertical slice) in a backend organized by app cases, as in backend-skeleton. Use it when the user asks to add an endpoint, handler, command or use case, or "a new app case/slice", to a codebase with a modules/<module>/app-cases/ layout.
---

# Create an app case

An **app case** is one entry point that fulfils one user intent. It lives in its own folder and never
imports another app case. Full rules: https://github.com/m-arrieta-r/backend-skeleton/blob/main/doc/conventions.md

## 1. Gather the facts (ask the user if any are unknown; do not guess)

- **Module**: an existing folder under `src/modules/`, or a new one.
- **Name**: kebab-case `verb-noun`, for example `cancel-order`.
- **Trigger**: HTTP method + path, Lambda event, CLI command, queue, …
- **Input / Output** shapes.
- **Business rules** and the **error codes** they produce, plus the status code for each error.
- **Dependencies**: repositories, clock, ID generator, and capabilities from other modules.

## 2. Look at one sibling first

Open one existing `app-cases/*/` folder in the same module (or in the closest module) and mirror its
style exactly: file names, Result type, controller shape and test style. Consistency matters more
than this template.

## 3. Create the files

Templates are in [`templates/`](templates/). Replace `__AppCase__` (PascalCase),
`__appCase__` (camelCase) and `__app-case__` (kebab-case).

```
src/modules/<module>/app-cases/<verb-noun>/
  README.md            <- templates/README.md (slice card; fill every row)
  app-rules.ts         <- templates/app-rules.ts
  app-rules.test.ts    <- templates/app-rules.test.ts (success + one test per error code)
  http-controller.ts   <- templates/http-controller.ts (or lambda-handler.ts, cli-command.ts, …)
```

Rules while writing:
- All collaborators come in through `deps`. Do not import other modules or other app cases.
- Put entity invariants in `domain/`. Put rules about this intent (permissions, orchestration) in `app-rules.ts`.
- The controller only validates the transport shape and maps errors. It makes no business decisions.
- Error-to-status mapping uses `Record<ErrorCode, number>` so it is exhaustive.

## 4. Wire it

1. Export the controller factory from `src/modules/<module>/index.ts`.
2. Register it in the composition root (`src/main/`) with its dependencies. This is one line.

## 5. Verify

Run the project's checks (typically typecheck, `node scripts/check-boundaries.mjs src`, then tests).
Fix any failure before reporting back. Report which files you created and which commands passed.
