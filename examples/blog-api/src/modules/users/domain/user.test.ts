import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createUser } from './user.ts';

const now = new Date('2026-01-01T00:00:00Z');

test('createUser normalizes email and name', () => {
  const result = createUser({ id: 'u1', email: '  Ada@Example.COM ', name: ' Ada ', now });
  assert.deepEqual(result, {
    ok: true,
    value: { id: 'u1', email: 'ada@example.com', name: 'Ada', createdAt: now },
  });
});

test('createUser rejects an invalid email', () => {
  const result = createUser({ id: 'u1', email: 'not-an-email', name: 'Ada', now });
  assert.equal(result.ok, false);
  assert.equal(!result.ok && result.error, 'INVALID_EMAIL');
});

test('createUser rejects an empty name', () => {
  const result = createUser({ id: 'u1', email: 'ada@example.com', name: '   ', now });
  assert.equal(!result.ok && result.error, 'INVALID_NAME');
});
