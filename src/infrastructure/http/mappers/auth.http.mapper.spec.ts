import { TokenType } from '../../../shared/dto/token.dto';
import { AuthHTTPMapper } from './auth.http.mapper';

const mockRegisterUserRequest = {
  name: 'John Doe',
  email: 'john.doe@email.com',
  password: '123456',
  confirmPassword: '123456',
};

const mockUserResponse = {
  id: 'uuid',
  email: mockRegisterUserRequest.email,
  name: mockRegisterUserRequest.name,
  password: 'hashed_password',
  refreshToken: null,
};

const mockLoginUserRequest = {
  email: mockRegisterUserRequest.email,
  password: mockRegisterUserRequest.password,
};

const mockLoginUserResponse = {
  access_token: 'jwt',
  expires_in: 60,
  token_type: TokenType.BEARER,
  refresh_token: 'jwt',
  scope: '',
};

const mockTokenDTO = {
  accessToken: mockLoginUserResponse.access_token,
  expiresIn: mockLoginUserResponse.expires_in,
  tokenType: mockLoginUserResponse.token_type,
  refreshToken: mockLoginUserResponse.refresh_token,
  scope: mockLoginUserResponse.scope,
};

describe('AuthHTTPMapper', () => {
  it('should map RegisterUserHTTPRequest to RegisterUserDTO', () => {
    const dto = AuthHTTPMapper.toRegisterDTO(mockRegisterUserRequest);

    expect(dto).toBeDefined();
    expect(dto.name).toEqual(mockRegisterUserRequest.name);
    expect(dto.email).toEqual(mockRegisterUserRequest.email);
    expect(dto.password).toEqual(mockRegisterUserRequest.password);
    expect(dto.confirmPassword).toEqual(
      mockRegisterUserRequest.confirmPassword,
    );
  });

  it('should map UserDTO to UserHTTPResponse', () => {
    const response = AuthHTTPMapper.toRegisterResponse(mockUserResponse);

    expect(response).toBeDefined();
    expect(response.name).toEqual(mockUserResponse.name);
    expect(response.email).toEqual(mockUserResponse.email);
  });

  it('should map LoginUserHTTPRequest to LoginUserDTO', () => {
    const dto = AuthHTTPMapper.toLoginDTO(mockLoginUserRequest);

    expect(dto).toBeDefined();
    expect(dto.email).toEqual(mockLoginUserRequest.email);
    expect(dto.password).toEqual(mockLoginUserRequest.password);
  });

  it('should map TokenDTO to TokenHTTPResponse', () => {
    const response = AuthHTTPMapper.toLoginResponse(mockTokenDTO);

    expect(response).toBeDefined();
    expect(response.access_token).toEqual(mockTokenDTO.accessToken);
    expect(response.expires_in).toEqual(mockTokenDTO.expiresIn);
    expect(response.token_type).toEqual(mockTokenDTO.tokenType);
    expect(response.refresh_token).toEqual(mockTokenDTO.refreshToken);
  });
});
