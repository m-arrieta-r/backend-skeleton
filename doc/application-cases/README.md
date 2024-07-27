## Application cases (the opossite of package by layer, so don't see this as a layer)

This structure is well-suited for a wide range of projects, from Minimum Viable Products (MVPs) that don't need the complexity of Domain-Driven Design (DDD) to enterprise-level applications that might benefit from Clean Architecture.

Inside this folder you can create:
- Interface adapters (controllers, lambda handlers)
- Application business rules files

### What is application case?
An application case is a modular unit that encapsulates the logic and functionality for one or more specific use cases within your application.

By organizing your code into application cases, you can achieve a more focused and maintainable codebase.

Each application case within this folder serves as an entry point into your application. Depending on your technology stack, this entry point could be:
* An endpoint in a basic HTTP server (e.g., REST API)
* A handler function in AWS Lambda
* An operation in a GraphQL server

Based on [DDD Forum use cases](https://github.com/stemmlerjs/ddd-forum/tree/master/src/modules/users/useCases)
