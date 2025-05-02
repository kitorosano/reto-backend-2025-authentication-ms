import { ExceptionTypeKeys } from '../error-code-keys.enum';
import { CustomException } from './custom.exception';

/**
 * Represents an exception that occurs when a resource is not found.
 *
 * @remarks
 * This exception is thrown when a requested resource cannot be found in the system or database.
 * It can be used to indicate that the resource does not exist.
 *
 * @extends {CustomException}
 */
export class NotFoundException extends CustomException {
  /**
   * Creates an instance of NotFoundException.
   * @param {string} key - The error key.
   * @param {any} [error] - The error message or details.
   */
  constructor(key: string, error?: any) {
    super(key, ExceptionTypeKeys.NOT_FOUND, error);
  }
}
