import { fail, ok, type Result } from '../../../../shared/result.ts';

export type __AppCase__Input = {
  // ...
};

export type __AppCase__Output = {
  // ...
};

/** One string-literal code per business failure. */
export type __AppCase__Error = 'SOMETHING_NOT_FOUND';

/** Every collaborator comes in here: repositories, clock, id generator, other modules' capabilities. */
export type __AppCase__Deps = {
  // repository: SomeRepository;
  // now: () => Date;
};

export async function __appCase__(
  input: __AppCase__Input,
  deps: __AppCase__Deps,
): Promise<Result<__AppCase__Output, __AppCase__Error>> {
  // 1. Load what you need through deps.
  // 2. Apply domain invariants (domain/) and app rules (here).
  // 3. Persist through deps.
  // 4. Return ok(...) or fail('CODE', 'Human readable message.').
  void input;
  void deps;
  void ok;
  return fail('SOMETHING_NOT_FOUND', 'Replace this template body.');
}
