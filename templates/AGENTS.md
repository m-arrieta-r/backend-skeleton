<!--
  Template from https://github.com/m-arrieta-r/backend-skeleton (MIT).
  Copy it to the root of your repository as AGENTS.md and adjust the commands and paths.
  Delete this comment.
-->
# AGENTS.md

## Architecture: package by app case (vertical slicing)

This codebase is organized by **app cases**. An app case is one entry point that fulfils one
user intent, such as an HTTP endpoint, a Lambda handler, a queue consumer or a CLI command.
Everything specific to an app case lives in **one folder**.

```
src/
  shared/                     framework-agnostic helpers; imports nothing from modules/ or main/
  main/                       composition root: wiring, router, server/handler adapters
  modules/<module>/
    index.ts                  public API of the module (the only file other modules may import)
    domain/                   entities, value objects, invariants; pure, no I/O
    repository/               ports (interfaces) + adapters
    app-cases/<verb-noun>/
      README.md               slice card: trigger, input, output, errors, deps, rules
      app-rules.ts            orchestrates domain + ports; returns Result<Output, ErrorCode>
      app-rules.test.ts       success path + every error code
      http-controller.ts      transport <-> app rules; maps every error code to a status
```

Reference: https://github.com/m-arrieta-r/backend-skeleton/blob/main/doc/conventions.md

## Rules (enforced by `scripts/check-boundaries.mjs`)

- **R1** An app case never imports another app case. Duplicate a little, or move true business rules to `domain/`.
- **R2** `domain/` imports only its own `domain/` and `shared/`.
- **R3** Other modules and `main/` import a module only through `modules/<m>/index.ts`.
- **R4** `shared/` never imports `modules/` or `main/`.
- **R5** `modules/` never imports `main/`.
- A need from another module is a function in the app case's `deps`, wired in `main/`.
- Do not create `services/`, `controllers/` or `utils/` folders. Do not add methods to a shared "service".

## Adding or changing an app case

1. Create or modify `src/modules/<module>/app-cases/<verb-noun>/` with the files above.
2. Update the slice card `README.md`.
3. Cover the success path and every error code in `app-rules.test.ts`.
4. Export the controller from `modules/<module>/index.ts` and wire it in `src/main/` (one line).
5. Run the checks below. The task is not done while they fail.

## Commands

```bash
npm run typecheck
node scripts/check-boundaries.mjs src
npm test
```
