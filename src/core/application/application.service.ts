import { Injectable } from '@nestjs/common';
import { RegisterUserDTO } from '../../shared/dto/register-user.dto';
import { UserDTO } from '../../shared/dto/user.dto';
import { UserMapper } from './mappers/user.mapper';
import { UserServicePort } from './ports/inbounds/user.service.port';
import { RegisterUserUseCase } from './usecases/register-user.usecase';

@Injectable()
export class ApplicationService implements UserServicePort {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  async registerUser(dto: RegisterUserDTO): Promise<UserDTO> {
    const user = await this.registerUserUseCase.execute(dto);
    return UserMapper.toDTO(user);
  }
}
