import type { Post } from '../domain/post.ts';

/** Port: what the posts app cases need from persistence. */
export interface PostRepository {
  findById(id: string): Promise<Post | undefined>;
  save(post: Post): Promise<void>;
}
