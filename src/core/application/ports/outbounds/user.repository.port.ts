import { User } from '../../../domain/models/user.model';

export abstract class UserRepositoryPort {
  abstract save(user: User): Promise<User>;

  abstract findByEmail(email: string): Promise<User | null>;
}
