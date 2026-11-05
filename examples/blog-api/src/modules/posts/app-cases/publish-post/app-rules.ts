import { fail, ok, type Result } from '../../../../shared/result.ts';
import { publish } from '../../domain/post.ts';
import type { PostRepository } from '../../repository/post-repository.ts';

export type PublishPostInput = { postId: string; requesterId: string };
export type PublishPostOutput = { id: string; status: 'published'; publishedAt: string };
export type PublishPostError = 'POST_NOT_FOUND' | 'NOT_POST_AUTHOR' | 'ALREADY_PUBLISHED';
export type PublishPostDeps = { posts: PostRepository; now: () => Date };

export async function publishPost(
  input: PublishPostInput,
  deps: PublishPostDeps,
): Promise<Result<PublishPostOutput, PublishPostError>> {
  const post = await deps.posts.findById(input.postId);
  if (!post) return fail('POST_NOT_FOUND', `Post ${input.postId} does not exist.`);
  if (post.authorId !== input.requesterId) {
    return fail('NOT_POST_AUTHOR', 'Only the author can publish this post.');
  }

  const published = publish(post, deps.now());
  if (!published.ok) return published;

  await deps.posts.save(published.value);
  return ok({
    id: published.value.id,
    status: 'published',
    publishedAt: (published.value.publishedAt ?? deps.now()).toISOString(),
  });
}
