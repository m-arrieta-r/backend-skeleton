import { test } from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryUserRepository } from '../../repository/in-memory-user-repository.ts';
import { getUser } from './app-rules.ts';

test('returns an existing user', async () => {
  const users = new InMemoryUserRepository();
  await users.save({ id: 'u1', email: 'ada@example.com', name: 'Ada', createdAt: new Date() });

  const result = await getUser({ userId: 'u1' }, { users });
  assert.deepEqual(result, { ok: true, value: { id: 'u1', email: 'ada@example.com', name: 'Ada' } });
});

test('fails when the user does not exist', async () => {
  const result = await getUser({ userId: 'missing' }, { users: new InMemoryUserRepository() });
  assert.equal(!result.ok && result.error, 'USER_NOT_FOUND');
});
