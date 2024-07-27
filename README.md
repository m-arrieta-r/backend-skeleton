# File Structure / Skeleton

## TL;DR

A practical, scalable folder structure designed for both Minimum Viable Products (MVPs) and large-scale enterprise projects.

## Motivation

Many existing folder conventions rely on traditional layered structures, sometimes mistakenly labeled as "hexagonal" or "clean architecture." However, these architectures don't inherently dictate a horizontal (layered) approach.

The most effective way to highlight functionality is by organizing folders around application cases. Your application is, after all, the sum of its use cases.

Let's move away from big service files and horizontal folder structures!

## Notable Quotes
> "A layered architecture doesn'n scream anything about business domain"  
— Missing chapter, Clean architecture, Robert C Martin and Simon Brown  

> "As an application grows, each layer can get sufficiently complex on its own that you need to modularize further. When this happens it's usually not best to use presentation-domain-data as the higher level of modules. Often frameworks encourage you to have something like view-model-data as the top level namespaces; that's OK for smaller systems, but once any of these layers gets too big you should split your top level into domain oriented modules which are internally layered."  
— Presentation Domain Data Layering, Martin Fowler
 
> "The pattern has absolutely nothing to say about how you structure your application internally."  
— Hexagonal Architecture, Alistair Cockburn

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


