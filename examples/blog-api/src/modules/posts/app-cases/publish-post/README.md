# App case: publish post

| | |
|---|---|
| **Trigger** | `POST /posts/:postId/publish` with header `x-user-id` |
| **Input** | `postId` path parameter + requester id from `x-user-id` |
| **Output** | `200 { id, status: "published", publishedAt }` |
| **Errors** | `401 UNAUTHENTICATED`, `403 NOT_POST_AUTHOR`, `404 POST_NOT_FOUND`, `409 ALREADY_PUBLISHED` |
| **Depends on** | `PostRepository`, `now` |

## Rules
1. Only the author can publish their post (application rule, lives in `app-rules.ts`).
2. A post can be published only once (domain invariant, lives in `domain/post.ts`).
