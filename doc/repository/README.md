# Repository (interface adapter)

A repository is a **port** (an interface that describes what the app cases need from persistence)
plus one or more **adapters** that implement it (in-memory, Postgres, DynamoDB, …).

**The repository layer is optional.** If you have no domain and just want to start fast, an app case
can talk to the database directly. Introduce repositories when:

- you have a domain whose entities you load and save, or
- you need to swap persistence (in-memory for tests, a real database in production), or
- several app cases share the same queries.

App cases depend on the **interface** and receive the implementation through `deps`. Only the
composition root (`main/`) chooses the adapter. See
[`UserRepository`](../../examples/blog-api/src/modules/users/repository/user-repository.ts) and its
[in-memory adapter](../../examples/blog-api/src/modules/users/repository/in-memory-user-repository.ts).
