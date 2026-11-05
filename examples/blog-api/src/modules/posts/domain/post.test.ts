import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDraft, isVisibleTo, publish } from './post.ts';

const now = new Date('2026-01-01T00:00:00Z');
const later = new Date('2026-01-02T00:00:00Z');

function draft() {
  const result = createDraft({ id: 'p1', authorId: 'u1', title: ' Hello ', body: 'World', now });
  assert.ok(result.ok);
  return result.value;
}

test('createDraft trims the title and starts as draft', () => {
  const post = draft();
  assert.equal(post.title, 'Hello');
  assert.equal(post.status, 'draft');
});

test('createDraft rejects an empty title', () => {
  const result = createDraft({ id: 'p1', authorId: 'u1', title: '  ', body: 'x', now });
  assert.equal(!result.ok && result.error, 'INVALID_TITLE');
});

test('publish sets status and publishedAt, and only works once', () => {
  const first = publish(draft(), later);
  assert.ok(first.ok);
  assert.equal(first.value.status, 'published');
  assert.deepEqual(first.value.publishedAt, later);

  const second = publish(first.value, later);
  assert.equal(!second.ok && second.error, 'ALREADY_PUBLISHED');
});

test('drafts are only visible to their author', () => {
  const post = draft();
  assert.equal(isVisibleTo(post, 'u1'), true);
  assert.equal(isVisibleTo(post, 'u2'), false);
  assert.equal(isVisibleTo(post, undefined), false);
});
