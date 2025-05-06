import { Test, TestingModule } from '@nestjs/testing';
import { InvalidPermissionsException } from '../../../shared/errors/exceptions/invalid-permissions.exception';
import { UnexpectedException } from '../../../shared/errors/exceptions/unexpected.exception';
import { AuthService } from '../../domain/services/auth.service';
import { UserRepositoryPort } from '../ports/outbounds/user.repository.port';
import { RefreshAuthenticationUseCase } from './refresh-authentication.usecase';

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

const mockVerifyRefreshToken = jest.fn().mockResolvedValue(mockDecodedToken);
const mockValidateHash = jest.fn().mockResolvedValue(true);
const mockGenerateTokens = jest.fn().mockResolvedValue(mockToken);
const mockHashRefreshToken = jest.fn().mockResolvedValue(mockUser.refreshToken);

describe('RefreshAuthenticationUseCase', () => {
  let refreshAuthenticationUseCase: RefreshAuthenticationUseCase;
  let repository: UserRepositoryPort;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshAuthenticationUseCase,
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
            verifyRefreshToken: mockVerifyRefreshToken,
            validateHash: mockValidateHash,
            generateTokens: mockGenerateTokens,
            hashRefreshToken: mockHashRefreshToken,
          }),
        },
      ],
    }).compile();

    refreshAuthenticationUseCase = module.get<RefreshAuthenticationUseCase>(
      RefreshAuthenticationUseCase,
    );
    repository = module.get<UserRepositoryPort>(UserRepositoryPort);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(refreshAuthenticationUseCase).toBeDefined();
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should refresh authentication successfully', async () => {
    const result = await refreshAuthenticationUseCase.execute(mockUser.email);

    expect(result.accessToken).toEqual(mockToken.accessToken);
    expect(result.refreshToken).toEqual(mockToken.refreshToken);
    expect(result.expiresIn).toEqual(mockToken.expiresIn);
    expect(result.tokenType).toEqual(mockToken.tokenType);
    expect(result.scope).toEqual(mockToken.scope);

    expect(service.verifyRefreshToken).toHaveBeenCalledWith(mockUser.email);
    expect(repository.findById).toHaveBeenCalledWith(mockDecodedToken.sub);
    expect(service.validateHash).toHaveBeenCalledWith({
      plainString: mockUser.email,
      hashedString: mockUser.refreshToken,
    });
    expect(service.generateTokens).toHaveBeenCalledTimes(1);
    expect(service.hashRefreshToken).toHaveBeenCalledWith(
      mockToken.refreshToken,
    );
    expect(repository.updateRefreshToken).toHaveBeenCalledWith(
      mockUser.id,
      mockUser.refreshToken,
    );
  });

  it('should throw an error if user does not exist', async () => {
    mockFindById.mockResolvedValueOnce(null);

    await expect(
      refreshAuthenticationUseCase.execute(mockUser.email),
    ).rejects.toThrow(InvalidPermissionsException);
    expect(repository.findById).toHaveBeenCalledWith(mockDecodedToken.sub);
    expect(service.verifyRefreshToken).toHaveBeenCalledWith(mockUser.email);
  });

  it('should throw an error if refresh token does not match', async () => {
    mockValidateHash.mockResolvedValueOnce(false);

    await expect(
      refreshAuthenticationUseCase.execute(mockUser.email),
    ).rejects.toThrow(InvalidPermissionsException);
    expect(repository.findById).toHaveBeenCalledWith(mockDecodedToken.sub);
    expect(service.verifyRefreshToken).toHaveBeenCalledWith(mockUser.email);
    expect(service.validateHash).toHaveBeenCalledWith({
      plainString: mockUser.email,
      hashedString: mockUser.refreshToken,
    });
  });

  it('should throw an error if refresh token is not valid', async () => {
    mockVerifyRefreshToken.mockResolvedValueOnce(null);

    await expect(
      refreshAuthenticationUseCase.execute(mockUser.email),
    ).rejects.toThrow(InvalidPermissionsException);
    expect(service.verifyRefreshToken).toHaveBeenCalledWith(mockUser.email);
  });

  it('should throw an error if token storage fails', async () => {
    mockUpdateRefreshToken.mockResolvedValueOnce(false);

    await expect(
      refreshAuthenticationUseCase.execute(mockUser.email),
    ).rejects.toThrow(UnexpectedException);
    expect(repository.findById).toHaveBeenCalledWith(mockDecodedToken.sub);
    expect(service.verifyRefreshToken).toHaveBeenCalledWith(mockUser.email);
    expect(service.validateHash).toHaveBeenCalledWith({
      plainString: mockUser.email,
      hashedString: mockUser.refreshToken,
    });

    expect(service.generateTokens).toHaveBeenCalledTimes(1);
    expect(service.hashRefreshToken).toHaveBeenCalledWith(
      mockToken.refreshToken,
    );
    expect(repository.updateRefreshToken).toHaveBeenCalledWith(
      mockUser.id,
      mockUser.refreshToken,
    );
  });
});
