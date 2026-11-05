# Contributing to Backend Skeleton

Thanks for considering a contribution! This repository is a **reference**: its value is clear
ideas and small, correct examples. Contributions that make either clearer are the most welcome.

## Good contributions

- Corrections and clarifications to [`doc/`](doc), especially [`doc/conventions.md`](doc/conventions.md).
- New app cases in [`examples/blog-api`](examples/blog-api) that show a rule not yet illustrated.
- Examples in other stacks or frameworks. Open an issue first, because these may fit better in a
  separate repository that links back here.
- Improvements to [`scripts/check-boundaries.mjs`](scripts/check-boundaries.mjs), with tests.
- Experience reports: did this structure work (or not) for you or your AI agents?

## Before opening a pull request

1. Read [`AGENTS.md`](AGENTS.md). Its working rules apply to people too.
2. If you change a rule, update `doc/conventions.md`, `templates/AGENTS.md`,
   `skills/create-app-case/SKILL.md` and the checker in the same pull request.
3. Run the checks:
   ```bash
   npm ci --prefix examples/blog-api
   npm run check
   ```
4. Keep `examples/blog-api` free of runtime dependencies.

## Reporting problems and ideas

Search the [issue tracker](https://github.com/m-arrieta-r/backend-skeleton/issues) first, then open
an issue describing the problem or idea and why it matters to people using this structure.

## Commit messages

- Use the imperative mood: "Add publish-post example", not "Added …".
- Keep the first line to 72 characters or fewer. [Conventional Commits](https://www.conventionalcommits.org)
  prefixes (`docs:`, `feat:`, `fix:`) are welcome.

## Code of conduct

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
