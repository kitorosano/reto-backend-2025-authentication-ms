import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from '../../../shared/dto/token.dto';
import { Token } from '../models/token.model';
import { HashService } from './hash.service';
import { UnexpectedException } from '../../../shared/errors/exceptions/unexpected.exception';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';

interface ComparePasswords {
  password: string;
  hashedPassword: string;
}

interface GenerateToken {
  userId: string;
  email: string;
  name: string;
}

@Injectable()
export class AuthService {
  private readonly EXPIRATION_TIME = 3600; // 1 hour

  constructor(
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  validatePassword({
    password,
    hashedPassword,
  }: ComparePasswords): Promise<boolean> {
    return this.hashService.compare(password, hashedPassword);
  }

  async generateToken({ userId, email, name }: GenerateToken): Promise<Token> {
    const token = new Token();

    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
        name,
      },
      {
        expiresIn: NaN
      },
    ).catch((error) => {
      throw new UnexpectedException(ErrorCodesKeys.TOKEN_GENERATION_FAILED, error);
    });

    token.setAccessToken(accessToken);
    token.setTokenType(TokenType.BEARER);
    token.setExpiresIn(this.EXPIRATION_TIME);
    // token.setRefreshToken(''); // TODO: Implement refresh token logic
    // token.setScope(''); // TODO: Implement scope logic

    return token;
  }
}
