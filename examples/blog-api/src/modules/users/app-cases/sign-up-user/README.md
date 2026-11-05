# App case: sign up user

| | |
|---|---|
| **Trigger** | `POST /users` |
| **Input** | `{ "email": string, "name": string }` |
| **Output** | `201 { id, email, name }` |
| **Errors** | `400 INVALID_INPUT`, `400 INVALID_EMAIL`, `400 INVALID_NAME`, `409 EMAIL_ALREADY_TAKEN` |
| **Depends on** | `UserRepository`, `generateId`, `now` |

## Rules
1. Email is normalized (trimmed, lower-cased) by the `User` domain.
2. An email can only be registered once.
