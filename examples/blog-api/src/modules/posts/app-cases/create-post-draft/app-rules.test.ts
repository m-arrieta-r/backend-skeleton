import { test } from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryPostRepository } from '../../repository/in-memory-post-repository.ts';
import { createPostDraft, type CreatePostDraftDeps } from './app-rules.ts';

function makeDeps(existingAuthors: string[] = ['u1']): CreatePostDraftDeps {
  return {
    posts: new InMemoryPostRepository(),
    authorExists: async (id) => existingAuthors.includes(id),
    generateId: () => 'p1',
    now: () => new Date('2026-01-01T00:00:00Z'),
  };
}

test('creates a draft for an existing author', async () => {
  const deps = makeDeps();
  const result = await createPostDraft({ authorId: 'u1', title: 'Hello', body: 'World' }, deps);

  assert.deepEqual(result, {
    ok: true,
    value: { id: 'p1', authorId: 'u1', title: 'Hello', body: 'World', status: 'draft' },
  });
  assert.ok(await deps.posts.findById('p1'));
});

test('fails when the author does not exist', async () => {
  const result = await createPostDraft({ authorId: 'ghost', title: 'Hello', body: 'World' }, makeDeps());
  assert.equal(!result.ok && result.error, 'AUTHOR_NOT_FOUND');
});

test('propagates domain validation errors', async () => {
  const result = await createPostDraft({ authorId: 'u1', title: 'Hello', body: '   ' }, makeDeps());
  assert.equal(!result.ok && result.error, 'INVALID_BODY');
});
