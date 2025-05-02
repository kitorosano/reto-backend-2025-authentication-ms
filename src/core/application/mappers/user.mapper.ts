import { UserDTO } from '../../../shared/dto/user.dto';
import { User } from '../../domain/models/user.model';

export class UserMapper {
  static toDTO(model: User): UserDTO {
    const dto = new UserDTO();

    dto.email = model.email;
    dto.name = model.name;

    return dto;
  }
}
