import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepositoryPort } from '../../core/application/ports/outbounds/user.repository.port';
import { UserMongoDBEntity, UserSchema } from './entities/user.mongodb.entity';
import { UserMongoDBAdapter } from './repositories/user.mongodb.adapter';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserMongoDBEntity.name, schema: UserSchema },
    ]),
  ],
  providers: [
    // Outbound Ports
    {
      provide: UserRepositoryPort,
      useClass: UserMongoDBAdapter,
    },
  ],
  exports: [UserRepositoryPort],
})
export class MongoDBModule {}
