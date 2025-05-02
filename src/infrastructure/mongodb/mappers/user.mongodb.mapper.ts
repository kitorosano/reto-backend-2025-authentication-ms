import { User } from '../../../core/domain/models/user.model';
import { UserMongoDBDocument } from '../entities/user.mongodb.entity';

export class UserMongoDBMapper {
  static toModel(entity: UserMongoDBDocument): User {
    const user = new User();

    user.id = entity.id;
    user.name = entity.name;
    user.email = entity.email;
    user.password = entity.password;

    return user;
  }
}
