import { UserDTO } from '../../../shared/dto/user.dto';
import { UserHTTPResponse } from '../models/user.http.response';

export class UserHTTPMapper {
  static toResponse(dto: UserDTO): UserHTTPResponse {
    const response = new UserHTTPResponse();

    response.name = dto.name;
    response.email = dto.email;

    return response;
  }
}
