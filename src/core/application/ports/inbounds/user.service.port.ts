import { RegisterUserDTO } from '../../../../shared/dto/register-user.dto';
import { UserDTO } from '../../../../shared/dto/user.dto';
export abstract class UserServicePort {
  abstract registerUser(user: RegisterUserDTO): Promise<UserDTO>;
}
