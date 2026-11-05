import { test } from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryPostRepository } from '../../repository/in-memory-post-repository.ts';
import { publishPost, type PublishPostDeps } from './app-rules.ts';

const now = new Date('2026-01-02T00:00:00Z');

async function makeDeps(): Promise<PublishPostDeps> {
  const posts = new InMemoryPostRepository();
  await posts.save({
    id: 'p1',
    authorId: 'u1',
    title: 'Hello',
    body: 'World',
    status: 'draft',
    createdAt: new Date('2026-01-01T00:00:00Z'),
  });
  return { posts, now: () => now };
}

test('the author publishes their draft', async () => {
  const deps = await makeDeps();
  const result = await publishPost({ postId: 'p1', requesterId: 'u1' }, deps);

  assert.deepEqual(result, {
    ok: true,
    value: { id: 'p1', status: 'published', publishedAt: now.toISOString() },
  });
  assert.equal((await deps.posts.findById('p1'))?.status, 'published');
});

test('someone else cannot publish the post', async () => {
  const result = await publishPost({ postId: 'p1', requesterId: 'u2' }, await makeDeps());
  assert.equal(!result.ok && result.error, 'NOT_POST_AUTHOR');
});

test('a post cannot be published twice', async () => {
  const deps = await makeDeps();
  await publishPost({ postId: 'p1', requesterId: 'u1' }, deps);
  const result = await publishPost({ postId: 'p1', requesterId: 'u1' }, deps);
  assert.equal(!result.ok && result.error, 'ALREADY_PUBLISHED');
});

test('fails for an unknown post', async () => {
  const result = await publishPost({ postId: 'nope', requesterId: 'u1' }, await makeDeps());
  assert.equal(!result.ok && result.error, 'POST_NOT_FOUND');
});
