# File Structure / Skeleton

## TL;DR

A practical, scalable folder structure designed for both Minimum Viable Products (MVPs) and large-scale enterprise projects.

## Motivation

Many existing folder conventions rely on traditional layered structures, sometimes mistakenly labeled as "hexagonal" or "clean architecture." However, these architectures don't inherently dictate a horizontal (layered) approach. In fact, Simon Brown recommends a vertical folder structure in the "Missing Chapter" of Clean Architecture book. Similarly, Uncle Bob emphasizes showcasing the system's functionality over the underlying frameworks. As further confirmation, the book "Hexagonal Architecture Explained" explicitly states, "The pattern has absolutely nothing to say about how you structure your application internally."

The most effective way to highlight functionality is by organizing folders around application cases. Your application is, after all, the sum of its use cases.

Let's move away from big service files and horizontal folder structures!

## Compatibility

This structure has been successfully tested with:

- NestJS (avoiding excessive service files)
- Serverless architectures using Lambda handlers
- ExpressJS
- KoaJS
- Domain-Driven Design (DDD)
- MVPs (without clean or hexagonal architecture)
- Enterprise Projects (with clean architecture and DDD)

## Inspiration

- **Solid Book** by Khalil Stemmler (highly recommended all his material!)
- **Screaming Architecture** by Uncle Bob
- **Clean Architecture** by Uncle Bob


