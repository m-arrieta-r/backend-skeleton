import { fail, ok, type Result } from '../../../../shared/result.ts';
import { createDraft } from '../../domain/post.ts';
import type { PostRepository } from '../../repository/post-repository.ts';

export type CreatePostDraftInput = { authorId: string; title: string; body: string };
export type CreatePostDraftOutput = { id: string; authorId: string; title: string; body: string; status: 'draft' };
export type CreatePostDraftError = 'INVALID_TITLE' | 'INVALID_BODY' | 'AUTHOR_NOT_FOUND';

export type CreatePostDraftDeps = {
  posts: PostRepository;
  /** Cross-module need expressed as a function, not as an import of another module. */
  authorExists: (authorId: string) => Promise<boolean>;
  generateId: () => string;
  now: () => Date;
};

export async function createPostDraft(
  input: CreatePostDraftInput,
  deps: CreatePostDraftDeps,
): Promise<Result<CreatePostDraftOutput, CreatePostDraftError>> {
  if (!(await deps.authorExists(input.authorId))) {
    return fail('AUTHOR_NOT_FOUND', `Author ${input.authorId} does not exist.`);
  }

  const created = createDraft({
    id: deps.generateId(),
    authorId: input.authorId,
    title: input.title,
    body: input.body,
    now: deps.now(),
  });
  if (!created.ok) return created;
  const post = created.value;

  await deps.posts.save(post);
  return ok({ id: post.id, authorId: post.authorId, title: post.title, body: post.body, status: 'draft' });
}
