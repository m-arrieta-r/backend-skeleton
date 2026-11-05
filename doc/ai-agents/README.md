# Vertical slicing in the age of AI coding agents

Vertical slicing has always been good for people. With coding agents (Claude Code, Codex,
Copilot, Cursor, Gemini CLI, Aider, …) it becomes much more important, because an agent's
quality depends heavily on **what it reads** and **how fast it learns it was wrong**.

## Why it matters more now

| Property | Package by layer (`controllers/`, `services/`, `repositories/`) | Package by app case (vertical slices) |
|---|---|---|
| **Context to load for one change** | Pieces of one feature are scattered across N folders and buried in large shared files. The agent reads a lot of unrelated code. | One folder holds everything for the intent, plus `domain/` if needed. Context is small and relevant. |
| **Finding the right place** | "Where does sign-up live?" means a grep through `UserService.ts` with 40 methods. | `app-cases/sign-up-user/`. The tree itself screams the intent. |
| **Blast radius of an edit** | Editing a shared service can break unrelated features. | Edits stay inside one slice. Diffs are small and easy for a person to review. |
| **Parallel agents** | Several agents editing `UserService.ts` at once leads to merge conflicts. | Each agent owns a slice. Conflicts are rare. |
| **Generating new code** | "Add a method somewhere in the right service" is ambiguous. | "Create `app-cases/<verb-noun>/` like its siblings" is a repeatable pattern that LLMs follow well. |
| **Verification loop** | Tests are global or missing, so agents guess. | Each slice has its own tests, and import boundaries are checked by a script, so the agent gets fast, precise feedback. |
| **Deleting a feature** | Hunt for the parts in every layer. | Delete the folder and remove one wiring line. |

The underlying idea is old: [Screaming Architecture](https://web.archive.org/web/20140702193834/http://blog.8thlight.com/uncle-bob/2011/09/30/Screaming-Architecture.html),
cohesion and locality. Agents simply make the cost of poor locality visible on every task.

## What makes a codebase agent-friendly

1. **Predictable structure.** Every slice looks the same. If an agent has seen one, it knows all of them.
2. **Rules written down once.** Put them in [`doc/conventions.md`](../conventions.md) and link to them from `AGENTS.md`.
3. **Rules enforced by tools, not by prose.** An agent can ignore a paragraph but cannot ignore a failing
   check. See [`scripts/check-boundaries.mjs`](../../scripts/check-boundaries.mjs).
4. **Slice cards.** A short `README.md` in each slice states intent, input, output, errors and rules,
   so the agent can understand the slice without reading its implementation.
5. **One command to verify.** For example `npm run check`, which runs typecheck, boundaries and tests.
   Agents can only iterate as fast as this command runs.
6. **Explicit dependencies.** Everything enters through `deps`. Agents (and tests) can see and replace
   every collaborator.
7. **Typed, exhaustive errors.** String-literal error codes plus `Record<Error, Status>` mean the
   compiler tells the agent when it forgot a case.

## Adopt it in your project

1. Copy [`templates/AGENTS.md`](../../templates/AGENTS.md) to the root of your repository and adjust
   the commands. [`AGENTS.md`](https://agents.md) is an open format read by most coding agents.
   For tools that use their own file name, add a one-line pointer file (for example a `CLAUDE.md`
   containing `@AGENTS.md`).
2. Copy [`scripts/check-boundaries.mjs`](../../scripts/check-boundaries.mjs) and add it to your check
   command and to CI.
3. Install the [`create-app-case`](../../skills/create-app-case/SKILL.md) skill (Agent Skills format).
   In Claude Code: `/plugin marketplace add m-arrieta-r/backend-skeleton`, then
   `/plugin install app-cases@backend-skeleton`. For other agents, copy the skill folder into the
   agent's skills folder, or paste it into the agent's instructions.
4. Ask your agent: *"Create the app case `cancel-order` in the orders module."*
