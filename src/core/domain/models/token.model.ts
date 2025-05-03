import { TokenType } from '../../../shared/dto/token.dto';

export class Token {
  accessToken: string;
  expiresIn: number;
  tokenType: TokenType;
  refreshToken: string;
  scope: string;

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  setExpiresIn(expiresIn: number) {
    this.expiresIn = expiresIn;
  }

  setTokenType(tokenType: TokenType) {
    this.tokenType = tokenType;
  }

  setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  setScope(scope: string) {
    this.scope = scope;
  }
}
