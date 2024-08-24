## Application Cases (App Cases)
Every project independently of its size and structure has application cases, the key of this repository is promoting package by application cases.

#### Inside this folder, you can create:
- controller or handler: convert data from the format most convenient for the use cases and entities.
- app-rules: orchestrate the flow of data to and from the entities, and direct those entities to use their enterprise wide business rules to achieve the goals of the use case.

### What is an Application Cases?

An application case is a modular unit that encapsulates the logic and functionality for one or more specific use cases within your application.

By organizing your code into application cases, you can achieve a more focused and maintainable codebase.

Each application case within this folder serves as an entry point into your application. Depending on your technology stack, this entry point could be:

* An endpoint in a basic HTTP server (e.g., REST API)
* A handler function in AWS Lambda
* An operation in a GraphQL server

### Why not use cases?
Use cases do not necessarily map tidily to application cases that's why I looked for another term.

Based on [DDD Forum use cases](https://github.com/stemmlerjs/ddd-forum/tree/master/src/modules/users/useCases)
