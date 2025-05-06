import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { InvalidPermissionsException } from '../../../shared/errors/exceptions/invalid-permissions.exception';
import { UnexpectedException } from '../../../shared/errors/exceptions/unexpected.exception';
import { AuthService } from './auth.service';
import { HashService } from './hash.service';

const mockUserData = {
  userId: 'jwt',
  email: 'john.doe@email.com',
  name: 'John Doe',
};

const mockTokenData = {
  sub: mockUserData.userId,
  email: mockUserData.email,
  name: mockUserData.name,
  iat: 1234567890,
  exp: 1234567890,
};

const mockSignAsync = jest.fn().mockResolvedValue('jwt');
const mockVerifyAsync = jest.fn().mockResolvedValue(mockTokenData);
const mockHash = jest.fn().mockResolvedValue('hashedRefreshToken');
const mockCompare = jest.fn().mockResolvedValue(true);

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let hashService: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useFactory: () => ({
            signAsync: mockSignAsync,
            verifyAsync: mockVerifyAsync,
          }),
        },
        {
          provide: HashService,
          useFactory: () => ({
            hash: mockHash,
            compare: mockCompare,
          }),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    hashService = module.get<HashService>(HashService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(hashService).toBeDefined();
  });

  // ==== validateHash method tests ====
  it('should validate hash successfully', async () => {
    const result = await authService.validateHash({
      plainString: 'plainString',
      hashedString: 'hashedString',
    });
    expect(result).toBe(true);
  });

  it('should throw an error when hash validation fails', async () => {
    mockCompare.mockResolvedValueOnce(false);
    expect(
      await authService.validateHash({
        plainString: 'plainString',
        hashedString: 'hashedString',
      }),
    ).toBe(false);
  });

  // ==== generateTokens method tests ====

  it('should generate tokens successfully', async () => {
    const result = await authService.generateTokens(mockUserData);

    expect(result.accessToken).toBe('jwt');
    expect(result.refreshToken).toBe('jwt');
    expect(result.expiresIn).toBe(60);
    expect(result.tokenType).toBe('Bearer');
    expect(result.scope).toBe('');
    expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
  });

  it('should throw an error when token generation fails', async () => {
    mockSignAsync.mockRejectedValueOnce(
      new UnexpectedException(ErrorCodesKeys.TOKEN_GENERATION_FAILED),
    );
    await expect(authService.generateTokens(mockUserData)).rejects.toThrow(
      UnexpectedException,
    );
  });

  // ==== hashRefreshToken method tests ====
  it('should hash refresh token successfully', async () => {
    const result = await authService.hashRefreshToken('refreshToken');
    expect(result).toBe('hashedRefreshToken');
    expect(hashService.hash).toHaveBeenCalledWith('refreshToken');
  });

  it('should throw an error when hashing refresh token fails', async () => {
    mockHash.mockRejectedValueOnce(
      new UnexpectedException(ErrorCodesKeys.TOKEN_GENERATION_FAILED),
    );
    await expect(authService.hashRefreshToken('refreshToken')).rejects.toThrow(
      UnexpectedException,
    );
  });

  // ==== verifyToken method tests ====
  it('should verify token successfully', async () => {
    const result = await authService.verifyToken('token');
    expect(result.sub).toBe(mockTokenData.sub);
    expect(result.email).toBe(mockTokenData.email);
    expect(result.name).toBe(mockTokenData.name);
    expect(result.iat).toBe(mockTokenData.iat);
    expect(result.exp).toBe(mockTokenData.exp);
    expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when verifying token fails', async () => {
    mockVerifyAsync.mockRejectedValueOnce(
      new InvalidPermissionsException(ErrorCodesKeys.TOKEN_NOT_VALID),
    );
    await expect(authService.verifyToken('token')).rejects.toThrow(
      InvalidPermissionsException,
    );
  });

  // ==== verifyRefreshToken method tests ====
  it('should verify refresh token successfully', async () => {
    const result = await authService.verifyRefreshToken('refreshToken');
    expect(result.sub).toBe(mockUserData.userId);
    expect(result.email).toBe(mockUserData.email);
    expect(result.name).toBe(mockUserData.name);
    expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when verifying refresh token fails', async () => {
    mockVerifyAsync.mockRejectedValueOnce(
      new InvalidPermissionsException(ErrorCodesKeys.TOKEN_NOT_VALID),
    );
    await expect(
      authService.verifyRefreshToken('refreshToken'),
    ).rejects.toThrow(InvalidPermissionsException);
  });
});
