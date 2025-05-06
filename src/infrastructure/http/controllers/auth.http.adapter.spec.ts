import { Test, TestingModule } from '@nestjs/testing';
import { AuthServicePort } from '../../../core/application/ports/inbounds/auth.service.port';
import { AuthHTTPAdapter } from './auth.http.adapter';

const mockRegisterUserRequest = {
  name: 'John Doe',
  email: 'john.doe@email.com',
  password: '123456',
  confirmPassword: '123456',
};

const mockLoginUserRequest = {
  email: mockRegisterUserRequest.email,
  password: mockRegisterUserRequest.password,
};

const mockUser = {
  id: 'uuid',
  email: mockRegisterUserRequest.email,
  name: mockRegisterUserRequest.name,
  password: 'hashed_password',
  refreshToken: null,
};

const mockToken = {
  accessToken: 'jwt',
  expiresIn: 60,
  tokenType: 'Bearer',
  refreshToken: 'jwt',
};

const mockRegisterUser = jest.fn().mockResolvedValue(mockUser);
const mockAuthenticateUser = jest.fn().mockResolvedValue(mockToken);
const mockRefreshAuthentication = jest.fn().mockResolvedValue(mockToken);
const mockLogoutUser = jest.fn().mockResolvedValue(undefined);

describe('UserHTTPAdapter', () => {
  let controller: AuthHTTPAdapter;
  let application: AuthServicePort;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthHTTPAdapter],
      providers: [
        {
          provide: AuthServicePort,
          useFactory: () => ({
            registerUser: mockRegisterUser,
            authenticateUser: mockAuthenticateUser,
            refreshAuthentication: mockRefreshAuthentication,
            logoutUser: mockLogoutUser,
          }),
        },
      ],
    }).compile();

    controller = await app.resolve<AuthHTTPAdapter>(AuthHTTPAdapter);
    application = await app.resolve<AuthServicePort>(AuthServicePort);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(application).toBeDefined();
  });

  it('should register a user', async () => {
    const result = await controller.registerUser(mockRegisterUserRequest);

    expect(result.email).toBe(mockRegisterUserRequest.email);
    expect(result.name).toBe(mockRegisterUserRequest.name);

    expect(mockRegisterUser).toHaveBeenCalledWith(mockRegisterUserRequest);
  });

  it('should authenticate a user', async () => {
    const result = await controller.authenticateUser(mockLoginUserRequest);

    expect(result.access_token).toBe(mockToken.accessToken);
    expect(result.refresh_token).toBe(mockToken.refreshToken);
    expect(result.expires_in).toBe(mockToken.expiresIn);
    expect(result.token_type).toBe(mockToken.tokenType);

    expect(mockAuthenticateUser).toHaveBeenCalledWith(mockLoginUserRequest);
  });

  it('should refresh authentication', async () => {
    const result = await controller.refreshAuthetication(
      mockToken.refreshToken,
    );

    expect(result.access_token).toBe(mockToken.accessToken);
    expect(result.refresh_token).toBe(mockToken.refreshToken);
    expect(result.expires_in).toBe(mockToken.expiresIn);
    expect(result.token_type).toBe(mockToken.tokenType);

    expect(mockRefreshAuthentication).toHaveBeenCalledWith(
      mockToken.refreshToken,
    );
  });

  it('should logout a user', async () => {
    const result = await controller.logoutUser(mockToken.accessToken);

    expect(result).toBeUndefined();

    expect(mockLogoutUser).toHaveBeenCalledWith(mockToken.accessToken);
  });
});
