import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import environment from '../../../config/environment';
import { TokenType } from '../../../shared/dto/token.dto';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { InvalidPermissionsException } from '../../../shared/errors/exceptions/invalid-permissions.exception';
import { UnexpectedException } from '../../../shared/errors/exceptions/unexpected.exception';
import { Token } from '../models/token.model';
import { HashService } from './hash.service';

interface ValidateHash {
  plainString: string;
  hashedString: string;
}

interface GenerateToken {
  userId: string;
  email: string;
  name: string;
}

type DecodedToken = {
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  validateHash({ plainString, hashedString }: ValidateHash): Promise<boolean> {
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
          secret: environment.authDriverSecret,
          expiresIn: environment.authDriverExpiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          name,
        },
        {
          secret: environment.authDriverRefreshSecret,
          expiresIn: environment.authDriverRefreshExpiresIn,
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
    token.setExpiresIn(environment.authDriverExpiresIn);
    token.setRefreshToken(refreshToken);
    token.setScope(''); // TODO: Implement scope logic

    return token;
  }

  hashRefreshToken(refreshToken: string): Promise<string> {
    return this.hashService.hash(refreshToken).catch((error) => {
      throw new UnexpectedException(
        ErrorCodesKeys.TOKEN_GENERATION_FAILED,
        error,
      );
    });
  }

  verifyToken(token: string): Promise<DecodedToken> {
    return this.jwtService
      .verifyAsync(token, {
        secret: environment.authDriverSecret,
      })
      .catch(() => {
        throw new InvalidPermissionsException(ErrorCodesKeys.TOKEN_NOT_VALID);
      });
  }

  verifyRefreshToken(refreshToken: string): Promise<DecodedToken> {
    return this.jwtService
      .verifyAsync(refreshToken, {
        secret: environment.authDriverRefreshSecret,
      })
      .catch(() => {
        throw new InvalidPermissionsException(ErrorCodesKeys.TOKEN_NOT_VALID);
      });
  }
}
