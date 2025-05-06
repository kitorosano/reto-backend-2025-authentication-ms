import { User } from '../../../core/domain/models/user.model';
import { UserMongoDBDocument } from '../entities/user.mongodb.entity';

export class UserMongoDBMapper {
  static toModel(entity: UserMongoDBDocument): User {
    const user = new User();

    user.setId(entity.id);
    user.setName(entity.name);
    user.setEmail(entity.email);
    user.setPassword(entity.password);
    user.setRefreshToken(entity.refreshToken);

    return user;
  }
}
