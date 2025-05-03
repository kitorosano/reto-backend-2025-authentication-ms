import { Injectable } from '@nestjs/common';
import { RegisterUserDTO } from '../../../shared/dto/register-user.dto';
import { Log } from '../../../shared/utils/log';
import { User } from '../../domain/models/user.model';
import { UserService } from '../../domain/services/user.service';
import { UserRepositoryPort } from '../ports/outbounds/user.repository.port';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly repository: UserRepositoryPort,
    private readonly service: UserService,
  ) {}

  async execute(dto: RegisterUserDTO): Promise<User> {
    Log.info(
      'RegisterUserUseCase',
      `Registering user with email: ${dto.email}`,
    );

    this.service.validateEmail(dto.email);

    const existingUser = await this.repository.findByEmail(dto.email);

    if (existingUser) {
      Log.error(
        'RegisterUserUseCase',
        `User with email ${dto.email} already exists`,
      );
      throw new BadModelException(ErrorCodesKeys.USER_ALREADY_EXISTS);
    }

    const user = this.service.create(dto);

    const userCreated = await this.repository.save(user);

    Log.info(
      'RegisterUserUseCase',
      `User with email ${dto.email} registered successfully`,
    );

    return userCreated;
  }
}
