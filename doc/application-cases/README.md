# Application cases (app cases)

Every project, whatever its size or structure, has application cases. The core idea of this
repository is **package by application case**.

## What is an application case?

An application case is **one entry point into your application that fulfils one user intent**.
Depending on your stack, that entry point is:

- an endpoint in an HTTP server (REST, RPC)
- a handler function in AWS Lambda (or any FaaS)
- an operation in a GraphQL server
- a CLI command or a queue/event consumer

Each application case gets its own folder, named `verb-noun` (`sign-up-user`, `publish-post`).
Organizing code this way keeps everything about one intent together and makes the folder tree
describe what the application *does*.

## What goes inside the folder

| File | Role |
|---|---|
| `README.md` | **Slice card**: trigger, input, output, errors, dependencies, business rules. |
| `app-rules.ts` | Orchestrates the flow of data to and from the entities, and directs those entities to apply their enterprise-wide business rules to achieve the goal of the app case. Framework-agnostic. |
| `app-rules.test.ts` | Covers the success path and every error. |
| `http-controller.ts` / `lambda-handler.ts` / … | Converts data between the format most convenient for the transport and the format the app rules expect. Makes no business decisions. |

One app case can have **several controllers** (for example, HTTP and Lambda) sharing the same
`app-rules.ts`. See [enterprise-project](../../examples/enterprise-project).

The full rules (naming, dependency directions, definition of done) are in
[conventions.md](../conventions.md). A runnable example is
[blog-api](../../examples/blog-api).

## Why not "use cases"?

Use cases, in the requirements sense, do not always map neatly to entry points. One use case
can span several endpoints, and one endpoint can serve several use cases. "Application case"
names exactly the thing you put in a folder: an entry point plus its application rules.

Inspired by the [`useCases` folders in DDD Forum](https://github.com/stemmlerjs/ddd-forum/tree/master/src/modules/users/useCases).
