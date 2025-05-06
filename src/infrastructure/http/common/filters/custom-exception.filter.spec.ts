import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ErrorCodesKeys } from '../../../../shared/errors/error-code-keys.enum';
import {
  AvailableLanguages,
  ErrorDictionary,
} from '../../../../shared/errors/error-dictionary';
import { BadModelException } from '../../../../shared/errors/exceptions/bad-model.exception';
import { InvalidPermissionsException } from '../../../../shared/errors/exceptions/invalid-permissions.exception';
import { NotFoundException } from '../../../../shared/errors/exceptions/not-found.exception';
import { UnexpectedException } from '../../../../shared/errors/exceptions/unexpected.exception';
import { CustomExceptionFilter } from '../filters/custom-exception.filter';

const mockBadModelException = new BadModelException(
  ErrorCodesKeys.NAME_TOO_LONG,
);

const mockNotFoundException = new NotFoundException(
  ErrorCodesKeys.USER_NOT_FOUND,
);

const mockInvalidPermissionsException = new InvalidPermissionsException(
  ErrorCodesKeys.USER_NOT_AUTHENTICATED,
);

const mockUnexpectedException = new UnexpectedException(
  ErrorCodesKeys.UNIMPLEMENTED,
);

const mockBadRequestErroResponse = {
  error: mockBadModelException.key,
  message:
    ErrorDictionary[AvailableLanguages.ES][mockBadModelException.name][
      mockBadModelException.key
    ].message,
  detail:
    ErrorDictionary[AvailableLanguages.ES][mockBadModelException.name][
      mockBadModelException.key
    ].detail,
  traceId: mockBadModelException.traceId,
  timestamp: mockBadModelException.timestamp,
};

const mockNotFoundErrorResponse = {
  error: mockNotFoundException.key,
  message:
    ErrorDictionary[AvailableLanguages.ES][mockNotFoundException.name][
      mockNotFoundException.key
    ].message,
  detail:
    ErrorDictionary[AvailableLanguages.ES][mockNotFoundException.name][
      mockNotFoundException.key
    ].detail,
  traceId: mockNotFoundException.traceId,
  timestamp: mockNotFoundException.timestamp,
};

const mockInvalidPermissionsErrorResponse = {
  error: mockInvalidPermissionsException.key,
  message:
    ErrorDictionary[AvailableLanguages.ES][
      mockInvalidPermissionsException.name
    ][mockInvalidPermissionsException.key].message,
  detail:
    ErrorDictionary[AvailableLanguages.ES][
      mockInvalidPermissionsException.name
    ][mockInvalidPermissionsException.key].detail,
  traceId: mockInvalidPermissionsException.traceId,
  timestamp: mockInvalidPermissionsException.timestamp,
};

const mockUnexpectedErrorResponse = {
  error: mockUnexpectedException.key,
  message:
    ErrorDictionary[AvailableLanguages.ES][mockUnexpectedException.name][
      mockUnexpectedException.key
    ].message,
  detail:
    ErrorDictionary[AvailableLanguages.ES][mockUnexpectedException.name][
      mockUnexpectedException.key
    ].detail,
  traceId: mockUnexpectedException.traceId,
  timestamp: mockUnexpectedException.timestamp,
};

const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockGetRequest = jest.fn().mockImplementation(() => ({
  headers: {
    'accept-language': AvailableLanguages.ES,
  },
  method: 'GET',
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
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

describe('CustomExceptionFilter', () => {
  let filter: CustomExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomExceptionFilter],
    }).compile();
    filter = module.get<CustomExceptionFilter>(CustomExceptionFilter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should catch BadModelException and return BadRequestErrorResponse', () => {
    filter.catch(mockBadModelException, mockArgumentsHost);

    expect(mockHttpArgumentsHost).toHaveBeenCalled();
    expect(mockGetRequest).toHaveBeenCalled();
    expect(mockGetResponse).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(mockBadRequestErroResponse);
  });

  it('should catch NotFoundException and return NotFoundErrorResponse', () => {
    filter.catch(mockNotFoundException, mockArgumentsHost);

    expect(mockHttpArgumentsHost).toHaveBeenCalled();
    expect(mockGetRequest).toHaveBeenCalled();
    expect(mockGetResponse).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith(mockNotFoundErrorResponse);
  });

  it('should catch InvalidPermissionsException and return UnauthorizedErrorResponse', () => {
    filter.catch(mockInvalidPermissionsException, mockArgumentsHost);

    expect(mockHttpArgumentsHost).toHaveBeenCalled();
    expect(mockGetRequest).toHaveBeenCalled();
    expect(mockGetResponse).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockJson).toHaveBeenCalledWith(mockInvalidPermissionsErrorResponse);
  });

  it('should catch UnexpectedException and return InternalServerErrorResponse', () => {
    filter.catch(mockUnexpectedException, mockArgumentsHost);

    expect(mockHttpArgumentsHost).toHaveBeenCalled();
    expect(mockGetRequest).toHaveBeenCalled();
    expect(mockGetResponse).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith(mockUnexpectedErrorResponse);
  });

  it('should use default language if accept-language header is not present', () => {
    const mockGetRequestWithoutLanguage = jest.fn().mockImplementation(() => ({
      headers: {},
      method: 'GET',
    }));
    const mockHttpArgumentsHostWithoutLanguage = jest
      .fn()
      .mockImplementation(() => ({
        getResponse: mockGetResponse,
        getRequest: mockGetRequestWithoutLanguage,
      }));

    const mockArgumentsHostWithoutLanguage = {
      switchToHttp: mockHttpArgumentsHostWithoutLanguage,
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    };

    filter.catch(mockBadModelException, mockArgumentsHostWithoutLanguage);

    expect(mockGetRequestWithoutLanguage).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(mockBadRequestErroResponse);
  });

  it('should use default language if accept-language header is not supported', () => {
    const mockGetRequestWithUnsupportedLanguage = jest
      .fn()
      .mockImplementation(() => ({
        headers: {
          'accept-language': 'unsupported-language',
        },
        method: 'GET',
      }));
    const mockHttpArgumentsHostWithUnsupportedLanguage = jest
      .fn()
      .mockImplementation(() => ({
        getResponse: mockGetResponse,
        getRequest: mockGetRequestWithUnsupportedLanguage,
      }));

    const mockArgumentsHostWithUnsupportedLanguage = {
      switchToHttp: mockHttpArgumentsHostWithUnsupportedLanguage,
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    };

    filter.catch(
      mockBadModelException,
      mockArgumentsHostWithUnsupportedLanguage,
    );

    expect(mockGetRequestWithUnsupportedLanguage).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(mockBadRequestErroResponse);
  });
});
