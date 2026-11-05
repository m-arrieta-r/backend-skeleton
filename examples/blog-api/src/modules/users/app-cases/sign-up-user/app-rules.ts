import { fail, ok, type Result } from '../../../../shared/result.ts';
import { createUser, type UserError } from '../../domain/user.ts';
import type { UserRepository } from '../../repository/user-repository.ts';

export type SignUpUserInput = { email: string; name: string };
export type SignUpUserOutput = { id: string; email: string; name: string };
export type SignUpUserError = UserError | 'EMAIL_ALREADY_TAKEN';

export type SignUpUserDeps = {
  users: UserRepository;
  generateId: () => string;
  now: () => Date;
};

/** Application rules: orchestrate domain + ports to fulfil this one app case. */
export async function signUpUser(
  input: SignUpUserInput,
  deps: SignUpUserDeps,
): Promise<Result<SignUpUserOutput, SignUpUserError>> {
  const created = createUser({ id: deps.generateId(), email: input.email, name: input.name, now: deps.now() });
  if (!created.ok) return created;
  const user = created.value;

  if (await deps.users.findByEmail(user.email)) {
    return fail('EMAIL_ALREADY_TAKEN', `A user with email ${user.email} already exists.`);
  }

  await deps.users.save(user);
  return ok({ id: user.id, email: user.email, name: user.name });
}
