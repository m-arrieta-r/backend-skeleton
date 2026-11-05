import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { createApp } from '../src/main/app.ts';

let server: Server;
let baseUrl: string;

before(async () => {
  server = createApp();
  await new Promise<void>((resolve) => server.listen(0, resolve));
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(() => new Promise<void>((resolve) => server.close(() => resolve())));

async function call(method: string, path: string, options: { body?: unknown; userId?: string } = {}) {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (options.userId) headers['x-user-id'] = options.userId;
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
  });
  return { status: response.status, body: (await response.json()) as Record<string, unknown> };
}

test('full flow: sign up, draft, publish, read', async () => {
  const signUp = await call('POST', '/users', { body: { email: 'ada@example.com', name: 'Ada' } });
  assert.equal(signUp.status, 201);
  const userId = String(signUp.body.id);

  assert.equal((await call('POST', '/users', { body: { email: 'ada@example.com', name: 'Ada' } })).status, 409);
  assert.equal((await call('GET', `/users/${userId}`)).status, 200);

  const draft = await call('POST', '/posts', { userId, body: { title: 'Hello', body: 'World' } });
  assert.equal(draft.status, 201);
  const postId = String(draft.body.id);

  assert.equal((await call('GET', `/posts/${postId}`)).status, 404, 'draft hidden from anonymous');
  assert.equal((await call('POST', `/posts/${postId}/publish`, { userId: 'someone-else' })).status, 403);

  const published = await call('POST', `/posts/${postId}/publish`, { userId });
  assert.equal(published.status, 200);
  assert.equal(published.body.status, 'published');

  assert.equal((await call('POST', `/posts/${postId}/publish`, { userId })).status, 409);
  assert.equal((await call('GET', `/posts/${postId}`)).status, 200);
});

test('validation and routing errors', async () => {
  assert.equal((await call('POST', '/users', { body: { email: 'x' } })).status, 400);
  assert.equal((await call('POST', '/posts', { body: { title: 'a', body: 'b' } })).status, 401);
  assert.equal((await call('POST', '/posts', { userId: 'ghost', body: { title: 'a', body: 'b' } })).status, 404);
  assert.equal((await call('GET', '/nope')).status, 404);
});
