# modular-crud (shape only)

Same idea as [simple-crud](../simple-crud), grouped by module. The top level screams the
business areas (`module-x`, `module-y`), and each module screams its app cases.

```
src/app-cases/
  module-x/  create/  read/  update/  delete/
  module-y/  create/  read/  update/  delete/
```

For the full modular layout (domain, repository, `index.ts`, composition root), see the runnable
[blog-api](../blog-api).
