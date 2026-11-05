# simple-crud (shape only)

The smallest layout: one level of app cases. There is no domain and no repository.
Use it for MVPs and prototypes.

```
src/app-cases/
  create-x/  controller.ts  app-rules.ts
  read-x/    controller.ts  app-rules.ts
  update-x/  controller.ts  app-rules.ts
  delete-x/  controller.ts  app-rules.ts
```

Grow into [modular-crud](../modular-crud) when you have several entities, and into
[blog-api](../blog-api) (runnable) when you need domain rules.
