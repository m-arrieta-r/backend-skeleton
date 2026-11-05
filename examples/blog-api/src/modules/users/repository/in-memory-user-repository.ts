import type { User } from '../domain/user.ts';
import type { UserRepository } from './user-repository.ts';

/** Adapter used by tests and the demo server. Swap for a real database adapter. */
export class InMemoryUserRepository implements UserRepository {
  readonly #users = new Map<string, User>();

  async findById(id: string): Promise<User | undefined> {
    return this.#users.get(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const normalized = email.trim().toLowerCase();
    return [...this.#users.values()].find((user) => user.email === normalized);
  }

  async save(user: User): Promise<void> {
    this.#users.set(user.id, user);
  }
}
