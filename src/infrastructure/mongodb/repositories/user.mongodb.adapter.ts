import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepositoryPort } from '../../../core/application/ports/outbounds/user.repository.port';
import { User } from '../../../core/domain/models/user.model';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { UnexpectedException } from '../../../shared/errors/exceptions/unexpected.exception';
import {
  UserMongoDBDocument,
  UserMongoDBEntity,
} from '../entities/user.mongodb.entity';

export class UserMongoDBAdapter implements UserRepositoryPort {
  constructor(
    @InjectModel(UserMongoDBEntity.name)
    private readonly userEntity: Model<UserMongoDBDocument>,
  ) {}

  async save(user: User): Promise<User> {
    throw new UnexpectedException(ErrorCodesKeys.REPOSITORY_UNEXPECTED);
  }
}
