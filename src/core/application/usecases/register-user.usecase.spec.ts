import { Test, TestingModule } from '@nestjs/testing';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { UserService } from '../../domain/services/user.service';
import { UserRepositoryPort } from '../ports/outbounds/user.repository.port';
import { RegisterUserUseCase } from './register-user.usecase';

const mockRegisterUserDTO = {
  name: 'John Doe',
  email: 'john.doe@email.com',
  password: '123456',
  confirmPassword: '123456',
};

const mockUserData = {
  id: 'uuid',
  email: 'john.doe@email.com',
  name: 'John Doe',
  password: 'hashed_password',
  refreshToken: null,
};

const mockFindByEmail = jest.fn().mockResolvedValue(null);
const mockSave = jest.fn().mockResolvedValue(mockUserData);

const mockValidateEmail = jest.fn().mockReturnValue(true);
const mockCreate = jest.fn().mockResolvedValue(mockUserData);

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;
  let repository: UserRepositoryPort;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        {
          provide: UserRepositoryPort,
          useFactory: () => ({
            findByEmail: mockFindByEmail,
            save: mockSave,
          }),
        },
        {
          provide: UserService,
          useFactory: () => ({
            validateEmail: mockValidateEmail,
            create: mockCreate,
          }),
        },
      ],
    }).compile();

    registerUserUseCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
    repository = module.get<UserRepositoryPort>(UserRepositoryPort);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(registerUserUseCase).toBeDefined();
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should register a user successfully', async () => {
    const result = await registerUserUseCase.execute(mockRegisterUserDTO);

    expect(result.id).toBe(mockUserData.id);
    expect(result.email).toBe(mockRegisterUserDTO.email);
    expect(result.name).toBe(mockRegisterUserDTO.name);
    expect(result.password).not.toEqual(mockRegisterUserDTO.password);
    expect(result.refreshToken).toBeNull();

    expect(service.validateEmail).toHaveBeenCalledWith(
      mockRegisterUserDTO.email,
    );
    expect(repository.findByEmail).toHaveBeenCalledWith(
      mockRegisterUserDTO.email,
    );
    expect(service.create).toHaveBeenCalledWith(mockRegisterUserDTO);
    expect(repository.save).toHaveBeenCalledWith(mockUserData);
  });

  it('should throw an error if user already exists', async () => {
    mockFindByEmail.mockResolvedValueOnce(mockUserData);

    await expect(registerUserUseCase.execute(mockRegisterUserDTO)).rejects.toThrow(
      BadModelException,
    );

    expect(service.validateEmail).toHaveBeenCalledWith(
      mockRegisterUserDTO.email,
    );
    expect(repository.findByEmail).toHaveBeenCalledWith(
      mockRegisterUserDTO.email,
    );
    expect(service.create).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });
});
