import { Test, TestingModule } from '@nestjs/testing';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { NotFoundException } from '../../../shared/errors/exceptions/not-found.exception';
import { UnexpectedException } from '../../../shared/errors/exceptions/unexpected.exception';
import { AuthService } from '../../domain/services/auth.service';
import { UserService } from '../../domain/services/user.service';
import { UserRepositoryPort } from '../ports/outbounds/user.repository.port';
import { AuthenticateUserUseCase } from './authenticate-user.usecase';

const mockLoginUserDTO = {
  email: 'john.doe@email.com',
  password: '123456',
};

const mockUser = {
  id: 'uuid',
  email: mockLoginUserDTO.email,
  name: 'John Doe',
  password: 'hashed_password',
  refreshToken: null,
};

const mockAuthenticatedUser = {
  ...mockUser,
  refreshToken: 'hashedRefreshToken',
};

const mockToken = {
  accessToken: 'jwt',
  expiresIn: 60,
  tokenType: 'Bearer',
  refreshToken: 'jwt',
  scope: '',
};

const mockFindByEmail = jest.fn().mockResolvedValue(mockUser);
const mockUpdateRefreshToken = jest
  .fn()
  .mockResolvedValue(mockAuthenticatedUser);

const mockValidateEmail = jest.fn().mockReturnValue(true);

const mockValidateHash = jest.fn().mockResolvedValue(true);
const mockGenerateTokens = jest.fn().mockResolvedValue(mockToken);
const mockHashRefreshToken = jest
  .fn()
  .mockResolvedValue(mockAuthenticatedUser.refreshToken);

describe('AuthenticateUserUseCase', () => {
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let repository: UserRepositoryPort;
  let userService: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticateUserUseCase,
        {
          provide: UserRepositoryPort,
          useFactory: () => ({
            findByEmail: mockFindByEmail,
            updateRefreshToken: mockUpdateRefreshToken,
          }),
        },
        {
          provide: UserService,
          useFactory: () => ({
            validateEmail: mockValidateEmail,
          }),
        },
        {
          provide: AuthService,
          useFactory: () => ({
            validateHash: mockValidateHash,
            generateTokens: mockGenerateTokens,
            hashRefreshToken: mockHashRefreshToken,
          }),
        },
      ],
    }).compile();

    authenticateUserUseCase = module.get<AuthenticateUserUseCase>(
      AuthenticateUserUseCase,
    );
    repository = module.get<UserRepositoryPort>(UserRepositoryPort);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authenticateUserUseCase).toBeDefined();
    expect(repository).toBeDefined();
    expect(userService).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('should authenticate user successfully', async () => {
    const result = await authenticateUserUseCase.execute(mockLoginUserDTO);

    expect(result.accessToken).toBe(mockToken.accessToken);
    expect(result.expiresIn).toBe(mockToken.expiresIn);
    expect(result.tokenType).toBe(mockToken.tokenType);
    expect(result.refreshToken).toBe(mockToken.refreshToken);
    expect(result.scope).toBe(mockToken.scope);

    expect(userService.validateEmail).toHaveBeenCalledWith(
      mockLoginUserDTO.email,
    );
    expect(repository.findByEmail).toHaveBeenCalledWith(mockLoginUserDTO.email);
    expect(authService.validateHash).toHaveBeenCalledWith({
      plainString: mockLoginUserDTO.password,
      hashedString: mockUser.password,
    });
    expect(authService.generateTokens).toHaveBeenCalledWith({
      userId: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
    });
    expect(authService.hashRefreshToken).toHaveBeenCalledWith(
      mockToken.refreshToken,
    );
    expect(repository.updateRefreshToken).toHaveBeenCalledWith(
      mockUser.id,
      mockAuthenticatedUser.refreshToken,
    );
  });

  it('should throw error if user not found', async () => {
    mockFindByEmail.mockResolvedValueOnce(null);

    await expect(
      authenticateUserUseCase.execute(mockLoginUserDTO),
    ).rejects.toThrow(NotFoundException);

    expect(userService.validateEmail).toHaveBeenCalledWith(
      mockLoginUserDTO.email,
    );
    expect(repository.findByEmail).toHaveBeenCalledWith(mockLoginUserDTO.email);
  });

  it('should throw error if password does not match', async () => {
    mockValidateHash.mockResolvedValueOnce(false);

    await expect(
      authenticateUserUseCase.execute(mockLoginUserDTO),
    ).rejects.toThrow(BadModelException);

    expect(userService.validateEmail).toHaveBeenCalledWith(
      mockLoginUserDTO.email,
    );
    expect(repository.findByEmail).toHaveBeenCalledWith(mockLoginUserDTO.email);
  });

  it('should throw error if refresh token update fails', async () => {
    mockUpdateRefreshToken.mockResolvedValueOnce(false);

    await expect(
      authenticateUserUseCase.execute(mockLoginUserDTO),
    ).rejects.toThrow(UnexpectedException);

    expect(userService.validateEmail).toHaveBeenCalledWith(
      mockLoginUserDTO.email,
    );
    expect(repository.findByEmail).toHaveBeenCalledWith(mockLoginUserDTO.email);
  });
});
