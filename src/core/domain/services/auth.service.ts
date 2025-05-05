import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import environment from 'src/config/environment';
import { TokenType } from '../../../shared/dto/token.dto';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { InvalidPermissionsException } from '../../../shared/errors/exceptions/invalid-permissions.exception';
import { UnexpectedException } from '../../../shared/errors/exceptions/unexpected.exception';
import { Token } from '../models/token.model';
import { HashService } from './hash.service';

interface ComparePasswords {
  plainString: string;
  hashedString: string;
}

interface GenerateToken {
  userId: string;
  email: string;
  name: string;
}

@Injectable()
export class AuthService {
  private readonly TOKEN_EXPIRATION_TIME = environment.authDriverExpiresIn;
  private readonly REFRESH_TOKEN_EXPIRATION_TIME =
    environment.authDriverRefreshExpiresIn;

  constructor(
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  validateHash({
    plainString,
    hashedString,
  }: ComparePasswords): Promise<boolean> {
    return this.hashService.compare(plainString, hashedString);
  }

  async generateTokens({ userId, email, name }: GenerateToken): Promise<Token> {
    const token = new Token();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          name,
        },
        {
          expiresIn: this.TOKEN_EXPIRATION_TIME,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          name,
        },
        {
          expiresIn: this.REFRESH_TOKEN_EXPIRATION_TIME,
        },
      ),
    ]).catch((error) => {
      throw new UnexpectedException(
        ErrorCodesKeys.TOKEN_GENERATION_FAILED,
        error,
      );
    });

    token.setAccessToken(accessToken);
    token.setTokenType(TokenType.BEARER);
    token.setExpiresIn(this.TOKEN_EXPIRATION_TIME);
    token.setRefreshToken(refreshToken);
    // token.setScope(''); // TODO: Implement scope logic

    return token;
  }

  async hashRefreshToken(refreshToken: string): Promise<string> {
    return this.hashService.hash(refreshToken).catch((error) => {
      throw new UnexpectedException(
        ErrorCodesKeys.TOKEN_GENERATION_FAILED,
        error,
      );
    });
  }

  async verifyRefreshToken(refreshToken: string) {
    return await this.jwtService.verifyAsync(refreshToken).catch(() => {
      throw new InvalidPermissionsException(ErrorCodesKeys.TOKEN_NOT_VALID);
    });
  }
}
