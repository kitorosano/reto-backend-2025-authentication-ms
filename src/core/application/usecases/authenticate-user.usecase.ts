import { Injectable } from '@nestjs/common';
import { LoginUserDTO } from '../../../shared/dto/login-user.dto';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { NotFoundException } from '../../../shared/errors/exceptions/not-found.exception';
import { UnexpectedException } from '../../../shared/errors/exceptions/unexpected.exception';
import { Log } from '../../../shared/utils/log';
import { Token } from '../../domain/models/token.model';
import { AuthService } from '../../domain/services/auth.service';
import { UserService } from '../../domain/services/user.service';
import { UserRepositoryPort } from '../ports/outbounds/user.repository.port';

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private readonly repository: UserRepositoryPort,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async execute(dto: LoginUserDTO): Promise<Token> {
    const { email, password } = dto;

    Log.info('AuthenticateUserUseCase', `Logging user with email: ${email}`);

    this.userService.validateEmail(email);

    const existingUser = await this.repository.findByEmail(email);
    if (!existingUser) {
      Log.error(
        'AuthenticateUserUseCase',
        `User with email ${email} does not exist`,
      );
      throw new NotFoundException(ErrorCodesKeys.USER_NOT_FOUND);
    }

    const matchingPassword = await this.authService.validateHash({
      plainString: password,
      hashedString: existingUser.password,
    });
    if (!matchingPassword) {
      Log.error(
        'AuthenticateUserUseCase',
        `Password does not match for user with email ${email}`,
      );
      throw new BadModelException(ErrorCodesKeys.PASSWORD_INCORRECT);
    }

    const token = await this.authService.generateTokens({
      userId: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
    });

    const hashedRefreshToken = await this.authService.hashRefreshToken(
      token.refreshToken,
    );

    const successUpdate = await this.repository.updateRefreshToken(
      existingUser.id,
      hashedRefreshToken,
    );
    if (!successUpdate) {
      Log.error(
        'AuthenticateUserUseCase',
        `Failed to update refresh token for user with email ${email}`,
      );
      throw new UnexpectedException(ErrorCodesKeys.TOKEN_STORAGE_FAILED);
    }

    Log.info(
      'AuthenticateUserUseCase',
      `User with email ${email} registered successfully`,
    );

    return token;
  }
}
