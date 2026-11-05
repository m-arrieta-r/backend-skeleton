import type { Post } from '../domain/post.ts';
import type { PostRepository } from './post-repository.ts';

export class InMemoryPostRepository implements PostRepository {
  readonly #posts = new Map<string, Post>();

  async findById(id: string): Promise<Post | undefined> {
    return this.#posts.get(id);
  }

  async save(post: Post): Promise<void> {
    this.#posts.set(post.id, post);
  }
}
