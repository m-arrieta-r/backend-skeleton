import { fail, ok, type Result } from '../../../shared/result.ts';

/** Enterprise business rules for a blog post. No I/O, no frameworks. */
export type PostStatus = 'draft' | 'published';

export type Post = Readonly<{
  id: string;
  authorId: string;
  title: string;
  body: string;
  status: PostStatus;
  createdAt: Date;
  publishedAt?: Date;
}>;

export type PostError = 'INVALID_TITLE' | 'INVALID_BODY' | 'ALREADY_PUBLISHED';

const MAX_TITLE_LENGTH = 120;

export function createDraft(props: {
  id: string;
  authorId: string;
  title: string;
  body: string;
  now: Date;
}): Result<Post, 'INVALID_TITLE' | 'INVALID_BODY'> {
  const title = props.title.trim();
  const body = props.body.trim();

  if (title.length === 0 || title.length > MAX_TITLE_LENGTH) {
    return fail('INVALID_TITLE', `Title must be between 1 and ${MAX_TITLE_LENGTH} characters.`);
  }
  if (body.length === 0) {
    return fail('INVALID_BODY', 'Body must not be empty.');
  }

  return ok({ id: props.id, authorId: props.authorId, title, body, status: 'draft', createdAt: props.now });
}

/** Invariant: a post can be published exactly once. */
export function publish(post: Post, now: Date): Result<Post, 'ALREADY_PUBLISHED'> {
  if (post.status === 'published') {
    return fail('ALREADY_PUBLISHED', `Post ${post.id} is already published.`);
  }
  return ok({ ...post, status: 'published', publishedAt: now });
}

export function isVisibleTo(post: Post, requesterId: string | undefined): boolean {
  return post.status === 'published' || post.authorId === requesterId;
}
