import { TokenType } from '../../../shared/dto/token.dto';
import { Token } from '../../domain/models/token.model';
import { User } from '../../domain/models/user.model';
import { AuthMapper } from './auth.mapper';

const mockUser = {
  id: 'userId',
  email: 'john.doe@email.com',
  name: 'John Doe',
};

const mockToken = {
  accessToken: 'jwt',
  expiresIn: 60,
  tokenType: TokenType.BEARER,
  refreshToken: 'refresh token',
  // scope: 'scope',
};

describe('AuthMapper', () => {
  it('should map User model to UserDTO', () => {
    const userModel = new User();
    userModel.id = mockUser.id;
    userModel.email = mockUser.email;
    userModel.name = mockUser.name;

    const userDTO = AuthMapper.toUserDTO(userModel);

    expect(userDTO).toBeDefined();
    expect(userDTO.id).toEqual(userModel.id);
    expect(userDTO.email).toEqual(userModel.email);
    expect(userDTO.name).toEqual(userModel.name);
  });

  it('should map Token model to TokenDTO', () => {
    const tokenModel = new Token();
    tokenModel.accessToken = mockToken.accessToken;
    tokenModel.expiresIn = mockToken.expiresIn;
    tokenModel.tokenType = mockToken.tokenType;
    tokenModel.refreshToken = mockToken.refreshToken;

    const tokenDTO = AuthMapper.toTokenDTO(tokenModel);

    expect(tokenDTO).toBeDefined();
    expect(tokenDTO.accessToken).toEqual(tokenModel.accessToken);
    expect(tokenDTO.expiresIn).toEqual(tokenModel.expiresIn);
    expect(tokenDTO.tokenType).toEqual(tokenModel.tokenType);
    expect(tokenDTO.refreshToken).toEqual(tokenModel.refreshToken);
  });
});
