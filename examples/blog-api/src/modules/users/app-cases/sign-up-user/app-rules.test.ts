import { test } from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryUserRepository } from '../../repository/in-memory-user-repository.ts';
import { signUpUser, type SignUpUserDeps } from './app-rules.ts';

function makeDeps(): SignUpUserDeps {
  let next = 0;
  return {
    users: new InMemoryUserRepository(),
    generateId: () => `user-${++next}`,
    now: () => new Date('2026-01-01T00:00:00Z'),
  };
}

test('signs up a new user', async () => {
  const deps = makeDeps();
  const result = await signUpUser({ email: 'Ada@example.com', name: 'Ada' }, deps);

  assert.deepEqual(result, { ok: true, value: { id: 'user-1', email: 'ada@example.com', name: 'Ada' } });
  assert.ok(await deps.users.findById('user-1'));
});

test('rejects an email that is already taken (case-insensitive)', async () => {
  const deps = makeDeps();
  await signUpUser({ email: 'ada@example.com', name: 'Ada' }, deps);
  const result = await signUpUser({ email: 'ADA@example.com', name: 'Other Ada' }, deps);

  assert.equal(!result.ok && result.error, 'EMAIL_ALREADY_TAKEN');
});

test('propagates domain validation errors', async () => {
  const result = await signUpUser({ email: 'nope', name: 'Ada' }, makeDeps());
  assert.equal(!result.ok && result.error, 'INVALID_EMAIL');
});
