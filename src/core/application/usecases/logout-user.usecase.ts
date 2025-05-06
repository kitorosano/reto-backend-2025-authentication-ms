import { Injectable } from '@nestjs/common';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { InvalidPermissionsException } from '../../../shared/errors/exceptions/invalid-permissions.exception';
import { UnexpectedException } from '../../../shared/errors/exceptions/unexpected.exception';
import { Log } from '../../../shared/utils/log';
import { AuthService } from '../../domain/services/auth.service';
import { UserRepositoryPort } from '../ports/outbounds/user.repository.port';

@Injectable()
export class LogoutUserUseCase {
  constructor(
    private readonly repository: UserRepositoryPort,
    private readonly service: AuthService,
  ) {}

  async execute(token: string): Promise<void> {
    const decodedToken = await this.service.verifyToken(token);
    if (!decodedToken)
      throw new InvalidPermissionsException(ErrorCodesKeys.TOKEN_NOT_VALID);

    Log.info(
      'LogoutUserUseCase',
      `User with email ${decodedToken.email} is logging out`,
    );

    const user = await this.repository.findById(decodedToken.sub);
    if (!user || !user.refreshToken) {
      Log.error(
        'LogoutUserUseCase',
        `User with email ${decodedToken.email} does not exist`,
      );
      throw new InvalidPermissionsException(
        ErrorCodesKeys.USER_NOT_AUTHENTICATED,
      );
    }

    const matchingTokens = await this.service.validateHash({
      plainString: token,
      hashedString: user.refreshToken,
    });
    if (matchingTokens) {
      Log.error('LogoutUserUseCase', 'Cannot use refresh token to logout user');
      throw new InvalidPermissionsException(ErrorCodesKeys.TOKEN_NOT_VALID);
    }

    const updatedUser = await this.repository.updateRefreshToken(user.id, null);
    if (!updatedUser) {
      Log.error(
        'LogoutUserUseCase',
        `Failed to update refresh token for user with email ${decodedToken.email}`,
      );
      throw new UnexpectedException(ErrorCodesKeys.TOKEN_CLEARING_FAILED);
    }

    Log.info(
      'LogoutUserUseCase',
      `User with email ${decodedToken.email} has logged out`,
    );
  }
}
