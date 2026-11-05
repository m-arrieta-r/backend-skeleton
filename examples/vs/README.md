# Package by layer vs by feature vs by app case

The same small application (users and posts) organized three ways. The files are empty on purpose;
only the tree matters.

```
package-by-layer/          package-by-feature/        package-by-app-cases/
  controllers/               User/                      UserAppCases/
    UserController             controller                 SignUpUser/  controller  app-rules (service)
    PostController             service                    Login/       controller  app-rules (service)
  services/                  Post/                        GetUser/     controller  app-rules (service)
    UserService                controller               PostAppCases/
    PostService                service                    CreatePost/  controller  app-rules (service)
                                                          PublishPost/ controller  app-rules (service)
```

## Task: "Change how Login works"

| | By layer | By feature | By app case |
|---|---|---|---|
| Folders a person or agent must open | `controllers/` + `services/` (and more in a real app) | `User/` | `UserAppCases/Login/` |
| Code read that is unrelated to the task | All user and post endpoints in two big files | Every user endpoint in `User/service` | None |
| Other features at risk from the edit | Everything in `UserService` | Everything in `User/service` | Only Login |
| Does the tree tell you what the app does? | No | Partly (the nouns) | Yes (the verbs) |

Package by feature is already a big step forward. Package by app case goes one level further,
so that each folder is one user intent. That is the unit people talk about, test and review, and it
is the unit an AI agent can load without noise. See
[Vertical slicing in the age of AI coding agents](../../doc/ai-agents/README.md).
