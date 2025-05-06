import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationService } from './application.service';
import { AuthenticateUserUseCase } from './usecases/authenticate-user.usecase';
import { LogoutUserUseCase } from './usecases/logout-user.usecase';
import { RefreshAuthenticationUseCase } from './usecases/refresh-authentication.usecase';
import { RegisterUserUseCase } from './usecases/register-user.usecase';

const mockRegisterUserDTO = {
  name: 'John Doe',
  email: 'john.doe@email.com',
  password: '123456',
  confirmPassword: '123456',
};

const mockUser = {
  id: 'uuid',
  email: mockRegisterUserDTO.email,
  name: mockRegisterUserDTO.name,
  password: 'hashed_password',
  refreshToken: null,
};

const mockUserDTO = {
  id: mockUser.id,
  email: mockRegisterUserDTO.email,
  password: mockRegisterUserDTO.password,
};

const mockLoginUserDTO = {
  email: mockRegisterUserDTO.email,
  password: mockRegisterUserDTO.password,
};

const mockToken = {
  accessToken: 'jwt',
  expiresIn: 60,
  tokenType: 'Bearer',
  refreshToken: 'jwt',
  scope: '',
};

const mockTokenDTO = {
  accessToken: mockToken.accessToken,
  expiresIn: mockToken.expiresIn,
  tokenType: mockToken.tokenType,
  refreshToken: mockToken.refreshToken,
};

const mockRegisterUser = jest.fn().mockResolvedValue(mockUser);
const mockAuthenticateUser = jest.fn().mockResolvedValue(mockToken);
const mockRefreshAuthentication = jest.fn().mockResolvedValue(mockToken);
const mockLogoutUser = jest.fn().mockResolvedValue(undefined);

describe('ApplicationService', () => {
  let service: ApplicationService;
  let registerUserUseCase: RegisterUserUseCase;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let refreshAuthenticationUseCase: RefreshAuthenticationUseCase;
  let logoutUserUseCase: LogoutUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        {
          provide: RegisterUserUseCase,
          useFactory: () => ({
            execute: mockRegisterUser,
          }),
        },
        {
          provide: AuthenticateUserUseCase,
          useFactory: () => ({
            execute: mockAuthenticateUser,
          }),
        },
        {
          provide: RefreshAuthenticationUseCase,
          useFactory: () => ({
            execute: mockRefreshAuthentication,
          }),
        },
        {
          provide: LogoutUserUseCase,
          useFactory: () => ({
            execute: mockLogoutUser,
          }),
        },
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
    registerUserUseCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
    authenticateUserUseCase = module.get<AuthenticateUserUseCase>(
      AuthenticateUserUseCase,
    );
    refreshAuthenticationUseCase = module.get<RefreshAuthenticationUseCase>(
      RefreshAuthenticationUseCase,
    );
    logoutUserUseCase = module.get<LogoutUserUseCase>(LogoutUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(registerUserUseCase).toBeDefined();
    expect(authenticateUserUseCase).toBeDefined();
    expect(refreshAuthenticationUseCase).toBeDefined();
    expect(logoutUserUseCase).toBeDefined();
  });

  it('should register a user', async () => {
    const result = await service.registerUser(mockRegisterUserDTO);

    expect(result.id).toEqual(mockUser.id);
    expect(result.email).toEqual(mockRegisterUserDTO.email);
    expect(result.name).toEqual(mockRegisterUserDTO.name);

    expect(registerUserUseCase.execute).toHaveBeenCalledWith(
      mockRegisterUserDTO,
    );
  });

  it('should authenticate a user', async () => {
    const result = await service.authenticateUser(mockLoginUserDTO);

    expect(result.accessToken).toEqual(mockToken.accessToken);
    expect(result.expiresIn).toEqual(mockToken.expiresIn);
    expect(result.tokenType).toEqual(mockToken.tokenType);
    expect(result.refreshToken).toEqual(mockToken.refreshToken);

    expect(authenticateUserUseCase.execute).toHaveBeenCalledWith(
      mockLoginUserDTO,
    );
  });

  it('should refresh authentication', async () => {
    const result = await service.refreshAuthetication(mockToken.refreshToken);

    expect(result.accessToken).toEqual(mockToken.accessToken);
    expect(result.expiresIn).toEqual(mockToken.expiresIn);
    expect(result.tokenType).toEqual(mockToken.tokenType);
    expect(result.refreshToken).toEqual(mockToken.refreshToken);

    expect(refreshAuthenticationUseCase.execute).toHaveBeenCalledWith(
      mockToken.refreshToken,
    );
  });

  it('should logout a user', async () => {
    await service.logoutUser(mockToken.accessToken);

    expect(logoutUserUseCase.execute).toHaveBeenCalledWith(
      mockToken.accessToken,
    );
  });
});
