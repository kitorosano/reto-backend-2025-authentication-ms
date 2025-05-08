import { UserMongoDBDocument } from '../../../../dist/infrastructure/mongodb/entities/user.mongodb.entity';
import { UserMongoDBMapper } from './user.mongodb.mapper';

const mockUserDocument = {
  id: 'uuid',
  name: 'John Doe',
  email: 'john.doe@email.com',
  password: 'hashed_password',
  refreshToken: 'jwt',
} as UserMongoDBDocument;

const mockUserResponse = {
  id: mockUserDocument.id,
  email: mockUserDocument.email,
  name: mockUserDocument.name,
  password: mockUserDocument.password,
  refreshToken: mockUserDocument.refreshToken,
};

describe('AuthHTTPMapper', () => {
  it('should map UserMongoDBDocument to User', () => {
    const model = UserMongoDBMapper.toModel(mockUserDocument);

    expect(model).toBeDefined();
    expect(model.name).toEqual(mockUserResponse.name);
    expect(model.email).toEqual(mockUserResponse.email);
    expect(model.password).toEqual(mockUserResponse.password);
    expect(model.refreshToken).toEqual(mockUserResponse.refreshToken);
  });
});
