## Application cases (the opossite of package by layer, so don't see this as layer)

This structure is suitable for Minimum Viable Products (MVPs) or projects that don't require the complexity of Domain-Driven Design (DDD) or Clean Architecture, which are often used in enterprise-level applications.

### What is application case?
An application case is a modular unit that encapsulates the logic and functionality for one or more specific use cases within your application.

By organizing your code into application cases, you can achieve a more focused and maintainable codebase.

Each application case within this folder serves as an entry point into your application. Depending on your technology stack, this entry point could be:
* An endpoint in a basic HTTP server (e.g., REST API)
* A handler function in AWS Lambda
* An operation in a GraphQL server

Based on [DDD Forum](https://github.com/stemmlerjs/ddd-forum/tree/master/src/modules/users/useCases)
