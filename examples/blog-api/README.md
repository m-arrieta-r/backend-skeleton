# blog-api: runnable reference

A small blog backend (users and posts) that shows the full backend-skeleton structure.
It has **zero runtime dependencies**: Node ≥ 22.18 runs the TypeScript directly, and
`typescript` is only used for type checking.

```bash
npm ci
npm run check   # typecheck + boundary rules + tests
npm start       # http://localhost:3000
```

## Structure

```
src/
  shared/                    Result type and framework-agnostic HTTP contract
  main/                      composition root: wiring (app.ts), router, node:http adapter, start
  modules/
    users/
      index.ts               public API of the module
      domain/user.ts         invariants: valid email, name length
      repository/            UserRepository port + in-memory adapter
      app-cases/
        sign-up-user/        POST /users
        get-user/            GET  /users/:userId
    posts/
      index.ts
      domain/post.ts         invariants: title/body, publish once, visibility
      repository/
      app-cases/
        create-post-draft/   POST /posts                    (x-user-id)
        publish-post/        POST /posts/:postId/publish    (x-user-id)
        get-post/            GET  /posts/:postId
test/api.e2e.test.ts         one end-to-end flow through the real server
```

Every app case folder contains a `README.md` slice card, `app-rules.ts`, `app-rules.test.ts`
and `http-controller.ts`.

## Things to notice

- **Where rules live.** "A post can be published once" is a domain invariant (`domain/post.ts`).
  "Only the author can publish" is an application rule (`publish-post/app-rules.ts`).
- **No cross-slice imports.** `create-post-draft` needs to know whether the author exists, but it does
  not import the users module. It receives `authorExists` in its deps, and
  [`src/main/app.ts`](src/main/app.ts) wires it.
- **Transport is a detail.** Controllers depend on [`shared/http.ts`](src/shared/http.ts), not on
  `node:http`. To use Express or Lambda, write a new adapter in `main/`. The app cases stay the same.
- **Exhaustive errors.** Each controller maps errors with `Record<ErrorCode, number>`. If you add an
  error code and forget to map it, the build fails.
- **Enforced boundaries.** `npm run check:boundaries` runs
  [`scripts/check-boundaries.mjs`](../../scripts/check-boundaries.mjs) against `src/`.

## Try it

```bash
curl -s -XPOST localhost:3000/users -H 'content-type: application/json' \
  -d '{"email":"ada@example.com","name":"Ada"}'
# => {"id":"<USER_ID>",...}

curl -s -XPOST localhost:3000/posts -H 'content-type: application/json' -H 'x-user-id: <USER_ID>' \
  -d '{"title":"Hello","body":"World"}'

curl -s -XPOST localhost:3000/posts/<POST_ID>/publish -H 'x-user-id: <USER_ID>'
curl -s localhost:3000/posts/<POST_ID>
```

> `x-user-id` stands in for real authentication, and the repositories are in memory. Both are kept
> simple on purpose so the structure is easy to see.
