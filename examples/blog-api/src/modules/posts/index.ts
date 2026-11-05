/**
 * Public API of the posts module. Other modules and the composition root may only
 * import from this file (enforced by scripts/check-boundaries.mjs).
 */
export type { Post } from './domain/post.ts';
export type { PostRepository } from './repository/post-repository.ts';
export { InMemoryPostRepository } from './repository/in-memory-post-repository.ts';
export { makeCreatePostDraftController } from './app-cases/create-post-draft/http-controller.ts';
export { makePublishPostController } from './app-cases/publish-post/http-controller.ts';
export { makeGetPostController } from './app-cases/get-post/http-controller.ts';
