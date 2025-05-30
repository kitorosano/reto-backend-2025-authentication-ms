import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@Schema({ collection: 'users', timestamps: true })
export class UserMongoDBEntity {
  @Prop({
    required: true,
    type: MongooseSchema.Types.UUID,
    index: true,
    searchIndex: true,
  })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true, searchIndex: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  refreshToken: string;
}

export type UserMongoDBDocument = HydratedDocument<UserMongoDBEntity>;

export const UserSchema = SchemaFactory.createForClass(UserMongoDBEntity);
