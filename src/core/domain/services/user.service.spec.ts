import { Test, TestingModule } from '@nestjs/testing';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { HashService } from './hash.service';
import { UserService } from './user.service';
import { UuidService } from './uuid.service';

const mockGenerateUuid = jest.fn().mockReturnValue('uuid');
const mockValidateUuid = jest.fn().mockReturnValue(true);
const mockHash = jest.fn().mockResolvedValue('hashedPassword');

describe('UserService', () => {
  let userService: UserService;
  let uuidService: UuidService;
  let hashService: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UuidService,
          useFactory: () => ({
            generate: mockGenerateUuid,
            validate: mockValidateUuid,
          }),
        },
        {
          provide: HashService,
          useFactory: () => ({
            hash: mockHash,
          }),
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    uuidService = module.get<UuidService>(UuidService);
    hashService = module.get<HashService>(HashService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(uuidService).toBeDefined();
    expect(hashService).toBeDefined();
  });

  // ===== create method tests =====
  it('should create a user with valid data', async () => {
    const user = {
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: '123456',
      confirmPassword: '123456',
    };

    const createdUser = await userService.create(user);

    expect(createdUser).toBeDefined();
    expect(createdUser.id).toBe('uuid');
    expect(createdUser.name).toBe(user.name);
    expect(createdUser.email).toBe(user.email);
    expect(createdUser.password).toBeTruthy();
    expect(createdUser.refreshToken).toBeNull();

    expect(mockGenerateUuid).toHaveBeenCalledTimes(1);
    expect(mockHash).toHaveBeenCalledWith(user.password);
  });

  it('should throw an error if the name is too long', async () => {
    const user = {
      name: 'John Doe John Doe John Doe John Doe',
      email: 'john.doe@email.com',
      password: '123456',
      confirmPassword: '123456',
    };

    await expect(userService.create(user)).rejects.toThrow(BadModelException);

    expect(mockGenerateUuid).toHaveBeenCalledTimes(1);
    expect(mockHash).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if the email is invalid', async () => {
    const user = {
      name: 'John Doe',
      email: 'john doe email com',
      password: '123456',
      confirmPassword: '123456',
    };

    await expect(userService.create(user)).rejects.toThrow(BadModelException);

    expect(mockGenerateUuid).toHaveBeenCalledTimes(1);
    expect(mockHash).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if the password is too short', async () => {
    const user = {
      name: 'John Doe',
      email: 'john doe email com',
      password: '123',
      confirmPassword: '123',
    };

    await expect(userService.create(user)).rejects.toThrow(BadModelException);

    expect(mockGenerateUuid).toHaveBeenCalledTimes(1);
    expect(mockHash).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if the password and confirm password do not match', async () => {
    const user = {
      name: 'John Doe',
      email: 'john doe email com',
      password: '123456',
      confirmPassword: '654321',
    };

    await expect(userService.create(user)).rejects.toThrow(BadModelException);

    expect(mockGenerateUuid).toHaveBeenCalledTimes(1);
    expect(mockHash).toHaveBeenCalledTimes(0);
  });

  // ===== validateId method tests =====
  it('should validate a valid UUID', () => {
    const id = '550e8400-e29b-41d4-a716-446655440000';
    const isValid = userService.validateId(id);
    expect(isValid).toBe(true);
    expect(mockValidateUuid).toHaveBeenCalledWith(id);
  });

  it('should throw an error for an invalid UUID', () => {
    const id = 'invalid-uuid';
    mockValidateUuid.mockReturnValue(false);
    expect(() => userService.validateId(id)).toThrow(BadModelException);
    expect(mockValidateUuid).toHaveBeenCalledWith(id);
  });

  // ===== validateName method tests =====
  it('should validate a valid name', () => {
    const name = 'John Doe';
    const isValid = userService.validateName(name);
    expect(isValid).toBe(true);
  });

  it('should throw an error for a name that is too long', () => {
    const name = 'John Doe John Doe John Doe John Doe';
    expect(() => userService.validateName(name)).toThrow(BadModelException);
  });

  // ===== validateEmail method tests =====
  it('should validate a valid email', () => {
    const email = 'john.doe@email.com';
    const isValid = userService.validateEmail(email);
    expect(isValid).toBe(true);
  });

  it('should throw an error for an invalid email', () => {
    const email = 'john doe email com';
    expect(() => userService.validateEmail(email)).toThrow(BadModelException);
  });

  // ===== validatePassword method tests =====
  it('should validate a valid password', () => {
    const password = '123456';
    const isValid = userService.validatePassword(password);
    expect(isValid).toBe(true);
  });

  it('should throw an error for a password that is too short', () => {
    const password = '123';
    expect(() => userService.validatePassword(password)).toThrow(
      BadModelException,
    );
  });

  // ===== validateConfirmPassword method tests =====
  it('should validate matching passwords', () => {
    const password = '123456';
    const confirmPassword = '123456';
    const isValid = userService.validateConfirmPassword(
      password,
      confirmPassword,
    );
    expect(isValid).toBe(true);
  });

  it('should throw an error for non-matching passwords', () => {
    const password = '123456';
    const confirmPassword = '654321';
    expect(() =>
      userService.validateConfirmPassword(password, confirmPassword),
    ).toThrow(BadModelException);
  });

  // ===== hashPassword method tests =====
  it('should hash a password', async () => {
    const password = '123456';
    const hashedPassword = await userService.hashPassword(password);
    expect(hashedPassword).toBe('hashedPassword');
    expect(mockHash).toHaveBeenCalledWith(password);
  });
});
