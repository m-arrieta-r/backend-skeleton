import { test } from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryPostRepository } from '../../repository/in-memory-post-repository.ts';
import { getPost } from './app-rules.ts';

async function postsWithDraft() {
  const posts = new InMemoryPostRepository();
  await posts.save({
    id: 'p1',
    authorId: 'u1',
    title: 'Hello',
    body: 'World',
    status: 'draft',
    createdAt: new Date('2026-01-01T00:00:00Z'),
  });
  return posts;
}

test('the author can read their draft', async () => {
  const result = await getPost({ postId: 'p1', requesterId: 'u1' }, { posts: await postsWithDraft() });
  assert.ok(result.ok);
  assert.equal(result.value.status, 'draft');
});

test('a draft is hidden from other users', async () => {
  const result = await getPost({ postId: 'p1', requesterId: 'u2' }, { posts: await postsWithDraft() });
  assert.equal(!result.ok && result.error, 'POST_NOT_FOUND');
});

test('a draft is hidden from anonymous requests', async () => {
  const result = await getPost({ postId: 'p1' }, { posts: await postsWithDraft() });
  assert.equal(!result.ok && result.error, 'POST_NOT_FOUND');
});
