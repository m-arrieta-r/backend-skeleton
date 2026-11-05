# Conventions

This is the **single source of truth** for the backend-skeleton structure. `AGENTS.md`,
the `create-app-case` skill and `scripts/check-boundaries.mjs` all refer to it.
If something here conflicts with another document, this file wins.

## Glossary

| Term | Meaning |
|---|---|
| **App case** (application case) | One entry point into the application that fulfils one user intent: an HTTP endpoint, a Lambda handler, a GraphQL operation, a CLI command, a queue consumer. It is the unit of a vertical slice. See [application-cases](./application-cases/README.md). |
| **Slice** | The folder that holds everything specific to one app case. "Vertical slice" and "app case folder" are the same thing here. |
| **App rules** | `app-rules.ts`: the application business rules of one app case. It orchestrates the domain and the ports. It knows nothing about HTTP, Lambda or any framework. |
| **Controller / handler** | `http-controller.ts`, `lambda-handler.ts`, `cli-command.ts`, …: translates one transport into the app rules' input and back. It makes no business decisions. |
| **Module** | A group of related app cases plus their domain and repositories (`users`, `posts`, `billing`). It appears only when the project needs it. |
| **Domain** | Enterprise business rules: entities, value objects and invariants. Pure code with no I/O. **Optional.** See [domain](./domain/README.md). |
| **Repository** | Port (interface) plus adapters for persistence. **Optional.** See [repository](./repository/README.md). |
| **Composition root** | `main/`: the only place that knows every module. It creates adapters, wires dependencies and registers routes. |

> Why "app case" and not "use case"? Use cases (in the requirements sense) do not always map
> 1:1 to entry points. "App case" names exactly the thing you put in a folder.

## Layouts

Pick the **smallest** layout that fits, and grow only when it hurts.

### 1. MVP: one level of app cases
```
src/
  app-cases/
    create-x/
      controller.ts
      app-rules.ts
```
No domain and no repository. Good for prototypes and simple CRUDs.
Examples: [`simple-crud`](../examples/simple-crud), [`simple-mvp-serverless`](../examples/simple-mvp-serverless).

### 2. Modular: modules with app cases, domain and repository
```
src/
  shared/                 # framework-agnostic helpers (Result, HTTP contract types…)
  main/                   # composition root: wiring, router, server/handler adapters
  modules/
    <module>/
      index.ts            # public API of the module
      domain/             # optional: entities, value objects, invariants (pure)
      repository/         # optional: ports (interfaces) + adapters
      app-cases/
        <verb>-<noun>/    # one folder per app case
          README.md       # slice card: trigger, input, output, errors, deps, rules
          app-rules.ts
          app-rules.test.ts
          http-controller.ts   # or lambda-handler.ts, cli-command.ts, …
```
Runnable example: [`blog-api`](../examples/blog-api). Enforced by
[`scripts/check-boundaries.mjs`](../scripts/check-boundaries.mjs).

## Naming

- App case folders use **kebab-case `verb-noun`**: `sign-up-user`, `publish-post`, `get-invoice`.
  The folder name says what the user wants to do, not which layer it belongs to.
- Files inside a slice are named by **role**, not by entity: `app-rules.ts`, `http-controller.ts`,
  `lambda-handler.ts`. Every slice looks the same, so an agent that has seen one slice can follow any other.
- Tests sit next to the code they test: `app-rules.test.ts`.
- There are no `services/`, `controllers/` or `utils/` folders at the top level.

## Dependency rules

Arrows show the allowed import direction.

```
main/ ──► modules/<m>/index.ts ──► app-cases/<x>/ ──► domain/ ──► shared/
                                        │                ▲
                                        └──► repository/ ┘
```

| ID | Rule | Why |
|---|---|---|
| **R1** slice-isolation | An app case never imports another app case. | Each slice stays independently readable, changeable and deletable. |
| **R2** domain-purity | `domain/` imports only its own `domain/` and `shared/`. | Business rules stay testable and independent of infrastructure. |
| **R3** module-api | Another module, or `main/`, imports a module only through `modules/<m>/index.ts`. | Modules can change their internals freely. |
| **R4** shared-is-leaf | `shared/` never imports `modules/` or `main/`. | Prevents cycles and "god" utility folders. |
| **R5** no-root-import | `modules/` never imports `main/`. | Wiring stays in one place. |

**Cross-module needs** (for example, "posts need to know whether an author exists") are expressed
as a **function in the app case's deps** (`authorExists: (id) => Promise<boolean>`) and wired in `main/`.
The app case does not import the other module.

**Duplication is acceptable between slices.** Copy a few lines rather than coupling two slices.
When a rule is truly shared and belongs to the business, move it to `domain/`.

## Inside a slice

- `app-rules.ts` exports one async function plus its `Input`, `Output`, `Error` and `Deps` types.
  - All dependencies come in through `deps`: repositories, clocks, ID generators and other modules' capabilities.
  - It returns a `Result<Output, Error>`. Errors are string-literal codes, not exceptions.
- The controller validates the transport shape, calls the app rules and maps every error code to a
  status code. It uses `Record<ErrorCode, number>` so the compiler forces exhaustive mapping.
- `README.md` is the **slice card**: trigger, input, output, errors, dependencies and business rules.
  It is the first file a person or an agent reads.

## Definition of done for a new or changed app case

1. The folder follows the naming and file roles above.
2. The slice card (`README.md`) is up to date.
3. `app-rules.test.ts` covers the success path and every error code.
4. The app case is wired in the composition root (one line).
5. `typecheck`, `check:boundaries` and `test` pass.
