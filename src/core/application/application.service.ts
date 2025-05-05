import { Injectable } from '@nestjs/common';
import { LoginUserDTO } from '../../shared/dto/login-user.dto';
import { RegisterUserDTO } from '../../shared/dto/register-user.dto';
import { TokenDTO } from '../../shared/dto/token.dto';
import { UserDTO } from '../../shared/dto/user.dto';
import { AuthMapper } from './mappers/auth.mapper';
import { AuthServicePort } from './ports/inbounds/auth.service.port';
import { AuthenticateUserUseCase } from './usecases/authenticate-user.usecase';
import { LogoutUserUseCase } from './usecases/logout-user.usecase';
import { RefreshAuthenticationUseCase } from './usecases/refresh-authentication.usecase';
import { RegisterUserUseCase } from './usecases/register-user.usecase';

@Injectable()
export class ApplicationService implements AuthServicePort {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly refreshAuthenticationUseCase: RefreshAuthenticationUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
  ) {}

  async registerUser(dto: RegisterUserDTO): Promise<UserDTO> {
    const user = await this.registerUserUseCase.execute(dto);
    return AuthMapper.toUserDTO(user);
  }

  async authenticateUser(dto: LoginUserDTO): Promise<TokenDTO> {
    const token = await this.authenticateUserUseCase.execute(dto);
    return AuthMapper.toTokenDTO(token);
  }

  async refreshAuthetication(refreshToken: string): Promise<TokenDTO> {
    const token = await this.refreshAuthenticationUseCase.execute(refreshToken);
    return AuthMapper.toTokenDTO(token);
  }

  async logoutUser(token: string): Promise<void> {
    await this.logoutUserUseCase.execute(token);
  }
}
