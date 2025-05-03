import { LoginUserDTO } from '../../../shared/dto/login-user.dto';
import { RegisterUserDTO } from '../../../shared/dto/register-user.dto';
import { TokenDTO } from '../../../shared/dto/token.dto';
import { UserDTO } from '../../../shared/dto/user.dto';
import { LoginUserHTTPRequest } from '../models/login-user.http.request';
import { RegisterUserHTTPRequest } from '../models/register-user.http.request';
import { TokenHTTPResponse } from '../models/token.http.response';
import { UserHTTPResponse } from '../models/user.http.response';

export class AuthHTTPMapper {
  static toRegisterDTO(request: RegisterUserHTTPRequest): RegisterUserDTO {
    const dto = new RegisterUserDTO();

    dto.name = request.name;
    dto.email = request.email;
    dto.password = request.password;
    dto.confirmPassword = request.confirmPassword;

    return dto;
  }

  static toRegisterResponse(dto: UserDTO): UserHTTPResponse {
    const response = new UserHTTPResponse();

    response.name = dto.name;
    response.email = dto.email;

    return response;
  }

  static toLoginDTO(request: LoginUserHTTPRequest): LoginUserDTO {
    const dto = new LoginUserDTO();

    dto.email = request.email;
    dto.password = request.password;

    return dto;
  }

  static toLoginResponse(dto: TokenDTO): TokenHTTPResponse {
    const response = new TokenHTTPResponse();

    response.access_token = dto.accessToken;
    response.expires_in = dto.expiresIn;
    response.token_type = dto.tokenType;
    response.refresh_token = dto.refreshToken;
    response.scope = dto.scope;

    return response;
  }
}
