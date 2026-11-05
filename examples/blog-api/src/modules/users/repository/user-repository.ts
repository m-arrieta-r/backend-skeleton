import type { User } from '../domain/user.ts';

/** Port: what the users app cases need from persistence. */
export interface UserRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
}
