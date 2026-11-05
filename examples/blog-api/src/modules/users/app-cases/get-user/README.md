# App case: get user

| | |
|---|---|
| **Trigger** | `GET /users/:userId` |
| **Input** | `userId` path parameter |
| **Output** | `200 { id, email, name }` |
| **Errors** | `404 USER_NOT_FOUND` |
| **Depends on** | `UserRepository` |
