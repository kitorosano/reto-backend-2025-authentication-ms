import { ExceptionTypeKeys } from '../error-code-keys.enum';
import { CustomException } from './custom.exception';

/**
 * Represents an exception that occurs when the data provided is invalid.
 *
 * @remarks
 * This exception is thrown when the data provided to a method or function is not valid.
 * It can be used to indicate that the data does not meet the required format or constraints.
 *
 * @extends {CustomException}
 */
export class BadModelException extends CustomException {
  /**
   * Creates an instance of BadDataException.
   * @param {string} key - The error key.
   * @param {any} [error] - The error message or details.
   */
  constructor(key: string, error?: any) {
    super(key, ExceptionTypeKeys.BAD_MODEL, error);
  }
}
