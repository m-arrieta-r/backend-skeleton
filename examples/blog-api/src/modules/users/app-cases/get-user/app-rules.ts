import { fail, ok, type Result } from '../../../../shared/result.ts';
import type { UserRepository } from '../../repository/user-repository.ts';

export type GetUserInput = { userId: string };
export type GetUserOutput = { id: string; email: string; name: string };
export type GetUserError = 'USER_NOT_FOUND';
export type GetUserDeps = { users: UserRepository };

export async function getUser(
  input: GetUserInput,
  deps: GetUserDeps,
): Promise<Result<GetUserOutput, GetUserError>> {
  const user = await deps.users.findById(input.userId);
  if (!user) return fail('USER_NOT_FOUND', `User ${input.userId} does not exist.`);
  return ok({ id: user.id, email: user.email, name: user.name });
}
