import { ErrorCodesKeys, ExceptionTypeKeys } from '../error-code-keys.enum';
import { CustomException } from './custom.exception';

/**
 * Represents an exception that occurs unexpectedly.
 *
 * @remarks
 * This exception is used to indicate that an unexpected error has occurred in the application.
 * It extends the `CustomException` class and provides a specific error key for unexpected errors.
 *
 * @extends {CustomException}
 */
export class UnexpectedException extends CustomException {
  /**
   * Creates an instance of UnexpectedException.
   * @param {ErrorCodesKeys} key - The error key.
   * @param {any} [error] - The error message or details.
   */
  constructor(key: ErrorCodesKeys, error?: any) {
    super(key, ExceptionTypeKeys.UNEXPECTED, error);
  }
}
