import {
  ErrorCodesKeys,
  ExceptionTypeKeys,
} from '../../../shared/errors/error-code-keys.enum';
import {
  AvailableLanguages,
  ErrorDictionary,
} from '../../../shared/errors/error-dictionary';
import { CustomException } from '../../../shared/errors/exceptions/custom.exception';
import { ErrorHTTPResponse } from '../models/error.response';

export class ErrorHTTPMapper {
  static toResponse(
    exception: CustomException,
    language: AvailableLanguages,
  ): ErrorHTTPResponse {
    const code = exception.key;
    const type = exception.name;
    const message = ErrorDictionary[language][type]?.[code]?.['message'];
    const detail = ErrorDictionary[language][type]?.[code]?.['detail'];

    const DEFAULT_ERROR_MESSAGE =
      ErrorDictionary[language][ExceptionTypeKeys.UNEXPECTED][
        ErrorCodesKeys.UNIMPLEMENTED
      ]['message'];
    const DEFAULT_ERROR_DETAIL =
      ErrorDictionary[language][ExceptionTypeKeys.UNEXPECTED][
        ErrorCodesKeys.UNIMPLEMENTED
      ]['detail'];

    return {
      error: code,
      message: message || DEFAULT_ERROR_MESSAGE,
      detail: detail || DEFAULT_ERROR_DETAIL,
      traceId: exception.traceId,
      timestamp: exception.timestamp,
    };
  }
}
