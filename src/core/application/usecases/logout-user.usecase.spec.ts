import { Test, TestingModule } from '@nestjs/testing';
import { InvalidPermissionsException } from '../../../shared/errors/exceptions/invalid-permissions.exception';
import { UnexpectedException } from '../../../shared/errors/exceptions/unexpected.exception';
import { AuthService } from '../../domain/services/auth.service';
import { UserRepositoryPort } from '../ports/outbounds/user.repository.port';
import { LogoutUserUseCase } from './logout-user.usecase';

const mockUser = {
  id: 'uuid',
  email: 'john.doe@email.com',
  name: 'John Doe',
  password: 'hashed_password',
  refreshToken: 'hashedRefreshToken',
};

const mockDecodedToken = {
  sub: mockUser.id,
  email: mockUser.email,
  name: mockUser.name,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 60 * 60,
};

const mockToken = {
  accessToken: 'jwt',
  expiresIn: 60,
  tokenType: 'Bearer',
  refreshToken: 'jwt',
  scope: '',
};

const mockFindById = jest.fn().mockResolvedValue(mockUser);
const mockUpdateRefreshToken = jest.fn().mockResolvedValue(mockUser);

const mockVerifyToken = jest.fn().mockResolvedValue(mockDecodedToken);
const mockValidateHash = jest.fn().mockResolvedValue(false);

describe('LogoutUserUseCase', () => {
  let logoutUserUseCase: LogoutUserUseCase;
  let repository: UserRepositoryPort;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogoutUserUseCase,
        {
          provide: UserRepositoryPort,
          useFactory: () => ({
            findById: mockFindById,
            updateRefreshToken: mockUpdateRefreshToken,
          }),
        },
        {
          provide: AuthService,
          useFactory: () => ({
            verifyToken: mockVerifyToken,
            validateHash: mockValidateHash,
          }),
        },
      ],
    }).compile();

    logoutUserUseCase = module.get<LogoutUserUseCase>(LogoutUserUseCase);
    repository = module.get<UserRepositoryPort>(UserRepositoryPort);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(logoutUserUseCase).toBeDefined();
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should logout user successfully', async () => {
    const result = await logoutUserUseCase.execute('token');

    expect(result).toBeUndefined();

    expect(repository.findById).toHaveBeenCalledWith(mockUser.id);
    expect(repository.updateRefreshToken).toHaveBeenCalledWith(
      mockUser.id,
      null,
    );
  });

  it('should throw InvalidPermissionsException if token is not valid', async () => {
    mockVerifyToken.mockResolvedValueOnce(null);

    await expect(logoutUserUseCase.execute('token')).rejects.toThrow(
      InvalidPermissionsException,
    );

    expect(repository.findById).not.toHaveBeenCalled();
  });

  it('should throw InvalidPermissionsException if user does not exist', async () => {
    mockFindById.mockResolvedValueOnce(null);

    await expect(logoutUserUseCase.execute('token')).rejects.toThrow(
      InvalidPermissionsException,
    );

    expect(repository.findById).toHaveBeenCalledWith(mockUser.id);
  });

  it('should throw InvalidPermissionsException if tries to logout with refresh token', async () => {
    mockValidateHash.mockResolvedValueOnce(true);

    await expect(logoutUserUseCase.execute('token')).rejects.toThrow(
      InvalidPermissionsException,
    );

    expect(repository.findById).toHaveBeenCalledWith(mockUser.id);
  });

  it('should throw UnexpectedException if update refresh token fails', async () => {
    mockUpdateRefreshToken.mockResolvedValueOnce(null);

    await expect(logoutUserUseCase.execute('token')).rejects.toThrow(
      UnexpectedException,
    );

    expect(repository.updateRefreshToken).toHaveBeenCalledWith(
      mockUser.id,
      null,
    );
  });
});
