import { LoginUserDTO } from '../../../../shared/dto/login-user.dto';
import { RegisterUserDTO } from '../../../../shared/dto/register-user.dto';
import { TokenDTO } from '../../../../shared/dto/token.dto';
import { UserDTO } from '../../../../shared/dto/user.dto';
export abstract class AuthServicePort {
  abstract registerUser(dto: RegisterUserDTO): Promise<UserDTO>;

  abstract authenticateUser(dto: LoginUserDTO): Promise<TokenDTO>;

  abstract refreshAuthetication(refreshToken: string): Promise<TokenDTO>;

  abstract logoutUser(token: string): Promise<void>;
}
