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
import { UserMongoDBMapper } from '../mappers/user.mongodb.mapper';

export class UserMongoDBAdapter implements UserRepositoryPort {
  constructor(
    @InjectModel(UserMongoDBEntity.name)
    private readonly userEntity: Model<UserMongoDBDocument>,
  ) {}

  async save(user: User): Promise<User> {
    try {
      const entity = new this.userEntity(user);
      const savedEntity = await entity.save();

      return UserMongoDBMapper.toModel(savedEntity);
    } catch (error) {
      throw new UnexpectedException(
        ErrorCodesKeys.REPOSITORY_UNEXPECTED,
        error as Error,
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const entity = await this.userEntity.findOne({ email }).exec();

      if (!entity) return null;

      return UserMongoDBMapper.toModel(entity);
    } catch (error) {
      throw new UnexpectedException(
        ErrorCodesKeys.REPOSITORY_UNEXPECTED,
        error as Error,
      );
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const entity = await this.userEntity.findOne({ id }).exec();

      if (!entity) return null;

      return UserMongoDBMapper.toModel(entity);
    } catch (error) {
      throw new UnexpectedException(
        ErrorCodesKeys.REPOSITORY_UNEXPECTED,
        error as Error,
      );
    }
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<User | null> {
    try {
      const entity = await this.userEntity
        .findOneAndUpdate(
          { id: userId },
          { refreshToken },
          { new: true, runValidators: true },
        )
        .exec();

      if (!entity) return null;

      return UserMongoDBMapper.toModel(entity);
    } catch (error) {
      throw new UnexpectedException(
        ErrorCodesKeys.REPOSITORY_UNEXPECTED,
        error as Error,
      );
    }
  }
}
