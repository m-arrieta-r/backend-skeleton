## Application cases (the oppossite of package by layer, so don't see this as a layer)

This structure is well-suited for a wide range of projects, from Minimum Viable Products (MVPs) that don't need the complexity of Domain-Driven Design (DDD) to enterprise-level applications that might benefit from Clean Architecture.

Inside this folder, you can create
- controller or handler: convert data from the format most convenient for the use cases and entities.
- app-rules: orchestrate the flow of data to and from the entities, and direct those entities to use their enterprise wide business rules to achieve the goals of the use case.

### What is an Application Case?
An application case is a modular unit that encapsulates the logic and functionality for one or more specific use cases within your application.

By organizing your code into application cases, you can achieve a more focused and maintainable codebase.

Also known as use cases in clean architecture. However, the term "use case" can have different meanings depending on the context.

Each application case within this folder serves as an entry point into your application. Depending on your technology stack, this entry point could be:
* An endpoint in a basic HTTP server (e.g., REST API)
* A handler function in AWS Lambda
* An operation in a GraphQL server

Based on [DDD Forum use cases](https://github.com/stemmlerjs/ddd-forum/tree/master/src/modules/users/useCases)
