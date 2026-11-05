# simple-mvp (shape only)

The bare minimum: one file per app case.

```
src/
  app-case-a.ts
  app-case-b.ts
```

Even at this size the files are named by intent, not by layer. When a file grows, turn it into
a folder with `controller.ts` + `app-rules.ts` (see [mvp](../mvp) and [simple-crud](../simple-crud)).
