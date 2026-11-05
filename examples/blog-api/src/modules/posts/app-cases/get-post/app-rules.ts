import { fail, ok, type Result } from '../../../../shared/result.ts';
import { isVisibleTo, type PostStatus } from '../../domain/post.ts';
import type { PostRepository } from '../../repository/post-repository.ts';

export type GetPostInput = { postId: string; requesterId?: string };
export type GetPostOutput = {
  id: string;
  authorId: string;
  title: string;
  body: string;
  status: PostStatus;
  publishedAt?: string;
};
export type GetPostError = 'POST_NOT_FOUND';
export type GetPostDeps = { posts: PostRepository };

export async function getPost(
  input: GetPostInput,
  deps: GetPostDeps,
): Promise<Result<GetPostOutput, GetPostError>> {
  const post = await deps.posts.findById(input.postId);
  if (!post || !isVisibleTo(post, input.requesterId)) {
    return fail('POST_NOT_FOUND', `Post ${input.postId} does not exist.`);
  }

  return ok({
    id: post.id,
    authorId: post.authorId,
    title: post.title,
    body: post.body,
    status: post.status,
    ...(post.publishedAt ? { publishedAt: post.publishedAt.toISOString() } : {}),
  });
}
