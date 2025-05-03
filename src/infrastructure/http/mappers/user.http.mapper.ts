import { UserDTO } from '../../../shared/dto/user.dto';
import { UserHTTPResponse } from '../models/user.http.response';
import { RegisterUserDTO } from '../../../shared/dto/register-user.dto';
import { RegisterUserHTTPRequest } from '../models/register-user.http.request';

export class UserHTTPMapper {
  static toDTO(request: RegisterUserHTTPRequest): RegisterUserDTO {
    const dto = new RegisterUserDTO();

    dto.name = request.name;
    dto.email = request.email;
    dto.password = request.password;
    dto.confirmPassword = request.confirmPassword;

    return dto;
  }

  static toResponse(dto: UserDTO): UserHTTPResponse {
    const response = new UserHTTPResponse();

    response.name = dto.name;
    response.email = dto.email;

    return response;
  }
}
