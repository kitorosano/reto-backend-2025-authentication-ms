import { User } from '../../../domain/models/user.model';

export abstract class UserRepositoryPort {
  abstract save(user: User): Promise<User>;

  abstract findByEmail(email: string): Promise<User | null>;

  abstract findById(id: string): Promise<User | null>;

  abstract updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<User | null>;
}
