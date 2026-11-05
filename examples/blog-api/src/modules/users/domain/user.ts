import { fail, ok, type Result } from '../../../shared/result.ts';

/** Enterprise business rules for a user. No I/O, no frameworks. */
export type User = Readonly<{
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}>;

export type UserError = 'INVALID_EMAIL' | 'INVALID_NAME';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 80;

export function createUser(props: {
  id: string;
  email: string;
  name: string;
  now: Date;
}): Result<User, UserError> {
  const email = props.email.trim().toLowerCase();
  const name = props.name.trim();

  if (!EMAIL_PATTERN.test(email)) {
    return fail('INVALID_EMAIL', 'Email must be a valid address.');
  }
  if (name.length === 0 || name.length > MAX_NAME_LENGTH) {
    return fail('INVALID_NAME', `Name must be between 1 and ${MAX_NAME_LENGTH} characters.`);
  }

  return ok({ id: props.id, email, name, createdAt: props.now });
}
