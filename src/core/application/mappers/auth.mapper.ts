import { TokenDTO } from '../../../shared/dto/token.dto';
import { UserDTO } from '../../../shared/dto/user.dto';
import { Token } from '../../domain/models/token.model';
import { User } from '../../domain/models/user.model';

export class AuthMapper {
  static toUserDTO(model: User): UserDTO {
    const dto = new UserDTO();

    dto.email = model.email;
    dto.name = model.name;

    return dto;
  }
  static toTokenDTO(model: Token): TokenDTO {
    const dto = new TokenDTO();

    dto.accessToken = model.accessToken;
    dto.expiresIn = model.expiresIn;
    dto.tokenType = model.tokenType;
    // dto.refreshToken = model.refreshToken;
    // dto.scope = model.scope;

    return dto;
  }
}
