import { BadModelException } from '../../../../shared/errors/exceptions/bad-model.exception';
import { InvalidPermissionsException } from '../../../../shared/errors/exceptions/invalid-permissions.exception';
import { BearerToken } from './bearer-token.decorator';

const mockHeaderWithoutAuthorization = {
  headers: {},
};

const mockAuthorizationWithBearer = {
  headers: {
    authorization: 'Bearer token',
  },
};
const mockAuthorizationWithoutBearer = {
  headers: {
    authorization: 'Not Bearer token',
  },
};

const mockGetRequest = jest.fn();
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getRequest: mockGetRequest,
}));
const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

jest.mock('@nestjs/common', () => {
  const originalModule = jest.requireActual('@nestjs/common');
  return {
    ...originalModule,
    createParamDecorator: jest.fn((fn) => fn),
  };
});

describe('BearerToken', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the token without "Bearer" prefix', () => {
    mockGetRequest.mockImplementationOnce(() => mockAuthorizationWithBearer);

    const token = BearerToken(null, mockArgumentsHost);

    expect(token).toBe('token');
  });

  it('should throw BadModelException if authorization header is not provided', () => {
    mockGetRequest.mockImplementationOnce(() => mockHeaderWithoutAuthorization);

    expect(() => BearerToken(null, mockArgumentsHost)).toThrow(
      BadModelException,
    );
  });

  it('should throw InvalidPermissionsException if token is not valid', () => {
    mockGetRequest.mockImplementationOnce(() => mockAuthorizationWithoutBearer);

    expect(() => BearerToken(null, mockArgumentsHost)).toThrow(
      InvalidPermissionsException,
    );
  });
});
