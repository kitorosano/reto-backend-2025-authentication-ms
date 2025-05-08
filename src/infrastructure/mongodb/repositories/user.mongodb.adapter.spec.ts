import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../../core/domain/models/user.model';
import { UnexpectedException } from '../../../shared/errors/exceptions/unexpected.exception';
import { UserMongoDBDocument } from '../entities/user.mongodb.entity';
import { UserMongoDBAdapter } from './user.mongodb.adapter';

const mockUserModel = {
  id: 'uuid',
  name: 'John Doe',
  email: 'john.doe@email.com',
  password: 'hashed_password',
  refreshToken: null,
};

const mockUserEntity = {
  id: 'uuid',
  name: 'John Doe',
  email: 'john.doe@email.com',
  password: 'hashed_password',
  refreshToken: 'jwt',
} as UserMongoDBDocument;

const mockSave = jest.fn();
const mockFindOne = jest.fn();
const mockFindOneAndUpdate = jest.fn();

describe('UserMongoDBAdapter Entity With Constructor', () => {
  let repository: UserMongoDBAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserMongoDBAdapter,
        {
          provide: getModelToken('UserMongoDBEntity'),
          useValue: jest.fn().mockReturnValue({
            save: mockSave.mockResolvedValue(mockUserEntity),
          }),
        },
      ],
    }).compile();

    repository = module.get<UserMongoDBAdapter>(UserMongoDBAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // ==== save method ===
  it('should save a new user', async () => {
    const user = new User();
    user.setId(mockUserModel.id);
    user.setName(mockUserModel.name);
    user.setEmail(mockUserModel.email);
    user.setPassword(mockUserModel.password);
    user.setRefreshToken(mockUserModel.refreshToken);

    const result = await repository.save(user);

    expect(result.id).toEqual(mockUserEntity.id);
    expect(result.name).toEqual(mockUserEntity.name);
    expect(result.email).toEqual(mockUserEntity.email);
    expect(result.password).toEqual(mockUserEntity.password);
    expect(result.refreshToken).toEqual(mockUserEntity.refreshToken);

    expect(mockSave).toHaveBeenCalled();
  });

  it('should throw an error if save fails', async () => {
    mockSave.mockRejectedValue(new Error('Save failed'));

    const user = new User();
    user.setId(mockUserModel.id);
    user.setName(mockUserModel.name);
    user.setEmail(mockUserModel.email);
    user.setPassword(mockUserModel.password);
    user.setRefreshToken(mockUserModel.refreshToken);

    await expect(repository.save(user)).rejects.toThrow(UnexpectedException);

    expect(mockSave).toHaveBeenCalled();
  });
});

describe('UserMongoDBAdapter Entity Without Constructor', () => {
  let repository: UserMongoDBAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserMongoDBAdapter,
        {
          provide: getModelToken('UserMongoDBEntity'),
          useValue: {
            findOne: jest.fn().mockReturnValue({
              exec: mockFindOne.mockResolvedValue(mockUserEntity),
            }),
            findOneAndUpdate: jest.fn().mockReturnValue({
              exec: mockFindOneAndUpdate.mockResolvedValue(mockUserEntity),
            }),
          },
        },
      ],
    }).compile();

    repository = module.get<UserMongoDBAdapter>(UserMongoDBAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // ==== findByEmail method ===
  it('should find a user by email', async () => {
    const result = await repository.findByEmail('tests');

    expect(result?.id).toEqual(mockUserEntity.id);
    expect(result?.name).toEqual(mockUserEntity.name);
    expect(result?.email).toEqual(mockUserEntity.email);
    expect(result?.password).toEqual(mockUserEntity.password);
    expect(result?.refreshToken).toEqual(mockUserEntity.refreshToken);

    expect(mockFindOne).toHaveBeenCalled();
  });

  it('should return null if user is not found', async () => {
    mockFindOne.mockResolvedValue(null);

    const result = await repository.findByEmail('not found');

    expect(result).toBeNull();
    expect(mockFindOne).toHaveBeenCalled();
  });

  it('should throw an error if findByEmail fails', async () => {
    mockFindOne.mockRejectedValue(new Error('Find failed'));

    await expect(repository.findByEmail('tests')).rejects.toThrow(
      UnexpectedException,
    );

    expect(mockFindOne).toHaveBeenCalled();
  });

  // ==== findById method ===
  it('should find a user by id', async () => {
    const result = await repository.findById('tests');

    expect(result?.id).toEqual(mockUserEntity.id);
    expect(result?.name).toEqual(mockUserEntity.name);
    expect(result?.email).toEqual(mockUserEntity.email);
    expect(result?.password).toEqual(mockUserEntity.password);
    expect(result?.refreshToken).toEqual(mockUserEntity.refreshToken);

    expect(mockFindOne).toHaveBeenCalled();
  });

  it('should return null if user is not found', async () => {
    mockFindOne.mockResolvedValue(null);

    const result = await repository.findById('not found');

    expect(result).toBeNull();
    expect(mockFindOne).toHaveBeenCalled();
  });

  it('should throw an error if findById fails', async () => {
    mockFindOne.mockRejectedValue(new Error('Find failed'));

    await expect(repository.findById('tests')).rejects.toThrow(
      UnexpectedException,
    );

    expect(mockFindOne).toHaveBeenCalled();
  });

  // ==== updateRefreshToken method ===
  it('should update the refresh token of a user', async () => {
    const result = await repository.updateRefreshToken('id', 'jwt');

    expect(result?.id).toEqual(mockUserEntity.id);
    expect(result?.name).toEqual(mockUserEntity.name);
    expect(result?.email).toEqual(mockUserEntity.email);
    expect(result?.password).toEqual(mockUserEntity.password);
    expect(result?.refreshToken).toEqual(mockUserEntity.refreshToken);

    expect(mockFindOneAndUpdate).toHaveBeenCalled();
  });

  it('should return null if user is not found', async () => {
    mockFindOneAndUpdate.mockResolvedValue(null);

    const result = await repository.updateRefreshToken('not found', 'jwt');

    expect(result).toBeNull();
    expect(mockFindOneAndUpdate).toHaveBeenCalled();
  });

  it('should throw an error if updateRefreshToken fails', async () => {
    mockFindOneAndUpdate.mockRejectedValue(new Error('Update failed'));

    await expect(repository.updateRefreshToken('id', 'jwt')).rejects.toThrow(
      UnexpectedException,
    );

    expect(mockFindOneAndUpdate).toHaveBeenCalled();
  });
});
