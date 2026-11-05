# App case: create post draft

| | |
|---|---|
| **Trigger** | `POST /posts` with header `x-user-id` |
| **Input** | `{ "title": string, "body": string }` + author id from `x-user-id` |
| **Output** | `201 { id, authorId, title, body, status: "draft" }` |
| **Errors** | `400 INVALID_INPUT`, `400 INVALID_TITLE`, `400 INVALID_BODY`, `401 UNAUTHENTICATED`, `404 AUTHOR_NOT_FOUND` |
| **Depends on** | `PostRepository`, `authorExists`, `generateId`, `now` |

## Rules
1. The author must exist. This slice does **not** import the users module: it receives
   an `authorExists` function, wired in the composition root (`src/main/app.ts`).

> `x-user-id` stands in for real authentication to keep the example small.
