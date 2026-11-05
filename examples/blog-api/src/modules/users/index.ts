/**
 * Public API of the users module. Other modules and the composition root may only
 * import from this file (enforced by scripts/check-boundaries.mjs).
 */
export type { User } from './domain/user.ts';
export type { UserRepository } from './repository/user-repository.ts';
export { InMemoryUserRepository } from './repository/in-memory-user-repository.ts';
export { makeSignUpUserController } from './app-cases/sign-up-user/http-controller.ts';
export { makeGetUserController } from './app-cases/get-user/http-controller.ts';
