# App case: get post

| | |
|---|---|
| **Trigger** | `GET /posts/:postId` (optional header `x-user-id`) |
| **Input** | `postId` path parameter + optional requester id |
| **Output** | `200 { id, authorId, title, body, status, publishedAt? }` |
| **Errors** | `404 POST_NOT_FOUND` |
| **Depends on** | `PostRepository` |

## Rules
1. Published posts are visible to everyone; drafts only to their author.
2. A draft requested by someone else returns `POST_NOT_FOUND` (do not leak its existence).
