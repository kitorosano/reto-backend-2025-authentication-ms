import { Injectable } from '@nestjs/common';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { InvalidPermissionsException } from '../../../shared/errors/exceptions/invalid-permissions.exception';
import { UnexpectedException } from '../../../shared/errors/exceptions/unexpected.exception';
import { Log } from '../../../shared/utils/log';
import { Token } from '../../domain/models/token.model';
import { AuthService } from '../../domain/services/auth.service';
import { UserRepositoryPort } from '../ports/outbounds/user.repository.port';

type DecodedToken = {
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
};

@Injectable()
export class RefreshAuthenticationUseCase {
  constructor(
    private readonly repository: UserRepositoryPort,
    private readonly service: AuthService,
  ) {}

  async execute(refreshToken: string): Promise<Token> {
    const decodedToken =
      await this.service.verifyRefreshToken(refreshToken);
    if (!decodedToken)
      throw new InvalidPermissionsException(ErrorCodesKeys.TOKEN_NOT_VALID);

    Log.info(
      'RefreshAuthenticationUseCase',
      `User with email ${decodedToken.email} is refreshing token`,
    );

    const user = await this.repository.findById(decodedToken.sub);
    if (!user || !user.refreshToken) {
      Log.error(
        'RefreshAuthenticationUseCase',
        `User with email ${decodedToken.email} does not exist`,
      );
      throw new InvalidPermissionsException(
        ErrorCodesKeys.USER_NOT_AUTHENTICATED,
      );
    }

    const matchingTokens = await this.service.validateHash({
      plainString: refreshToken,
      hashedString: user.refreshToken,
    });
    if (!matchingTokens) {
      Log.error(
        'RefreshAuthenticationUseCase',
        `Refresh token does not match for user with email ${decodedToken.email}`,
      );
      throw new InvalidPermissionsException(ErrorCodesKeys.TOKEN_NOT_VALID);
    }

    const token = await this.service.generateTokens({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const hashedRefreshToken = await this.service.hashRefreshToken(
      token.refreshToken,
    );

    const successUpdate = await this.repository.updateRefreshToken(
      user.id,
      hashedRefreshToken,
    );
    if (!successUpdate) {
      Log.error(
        'AuthenticateUserUseCase',
        `Failed to update refresh token for user with email ${decodedToken.email}`,
      );
      throw new UnexpectedException(ErrorCodesKeys.TOKEN_STORAGE_FAILED);
    }

    Log.info('RefreshAuthenticationUseCase', `New token generated`);

    return token;
  }
}
