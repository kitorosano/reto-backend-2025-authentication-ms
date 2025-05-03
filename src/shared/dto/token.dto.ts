export enum TokenType {
  BEARER = 'Bearer',
}

export class TokenDTO {
  accessToken: string;
  expiresIn: number;
  tokenType: TokenType;

  refreshToken: string;
  scope: string;
}
