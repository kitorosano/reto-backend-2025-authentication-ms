import {
  ErrorCodesKeys,
  ExceptionTypeKeys,
} from '../../../shared/errors/error-code-keys.enum';
import {
  AvailableLanguages,
  ErrorDictionary,
} from '../../../shared/errors/error-dictionary';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { CustomException } from '../../../shared/errors/exceptions/custom.exception';
import { ErrorHTTPMapper } from './error.http.mapper';

const mockErrorRequest = {
  exception: new BadModelException(ErrorCodesKeys.NAME_TOO_LONG),
  language: AvailableLanguages.ES,
};

const mockErrorResponse = {
  error: ErrorCodesKeys.NAME_TOO_LONG,
  message:
    ErrorDictionary[mockErrorRequest.language][mockErrorRequest.exception.name][
      mockErrorRequest.exception.key
    ]['message'],
  detail:
    ErrorDictionary[mockErrorRequest.language][mockErrorRequest.exception.name][
      mockErrorRequest.exception.key
    ]['detail'],
  traceId: mockErrorRequest.exception.traceId,
  timestamp: mockErrorRequest.exception.timestamp,
};

describe('ErrorHTTPMapper', () => {
  it('should map BadModelException to ErrorHTTPResponse', () => {
    const response = ErrorHTTPMapper.toResponse(
      mockErrorRequest.exception,
      mockErrorRequest.language as AvailableLanguages,
    );

    expect(response).toBeDefined();
    expect(response.error).toEqual(mockErrorResponse.error);
    expect(response.message).toEqual(mockErrorResponse.message);
    expect(response.detail).toEqual(mockErrorResponse.detail);
    expect(response.traceId).toEqual(mockErrorResponse.traceId);
    expect(response.timestamp).toEqual(mockErrorResponse.timestamp);
  });

  it('should map UnimplementedException to ErrorHTTPResponse if no key or type', () => {
    const exception = new CustomException(
      ErrorCodesKeys.UNIMPLEMENTED,
      ExceptionTypeKeys.UNEXPECTED,
    );
    const response = ErrorHTTPMapper.toResponse(
      exception,
      mockErrorRequest.language as AvailableLanguages,
    );

    expect(response).toBeDefined();
    expect(response.error).toEqual(ErrorCodesKeys.UNIMPLEMENTED);
    expect(response.message).toEqual(
      ErrorDictionary[mockErrorRequest.language][ExceptionTypeKeys.UNEXPECTED][
        ErrorCodesKeys.UNIMPLEMENTED
      ]['message'],
    );
    expect(response.detail).toEqual(
      ErrorDictionary[mockErrorRequest.language][ExceptionTypeKeys.UNEXPECTED][
        ErrorCodesKeys.UNIMPLEMENTED
      ]['detail'],
    );
    expect(response.traceId).toEqual(exception.traceId);
    expect(response.timestamp).toEqual(exception.timestamp);
  });
});
