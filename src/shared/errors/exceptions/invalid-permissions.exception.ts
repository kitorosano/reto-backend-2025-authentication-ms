import { ExceptionTypeKeys } from '../error-code-keys.enum';
import { CustomException } from './custom.exception';

/**
 * Represents an exception that occurs when invalid permissions are provided.
 *
 * @remarks
 * This exception is thrown when the permissions provided to a method or function are not valid.
 * It can be used to indicate that the user cannot perform the requested action due to insufficient permissions.
 *
 * @extends {CustomException}
 */
export class InvalidPermissionsException extends CustomException {
  /**
   * Creates an instance of InvalidPermissionsException.
   * @param {string} key - The error key.
   * @param {any} [error] - The error message or details.
   */
  constructor(key: string, error?: any) {
    super(key, ExceptionTypeKeys.INVALID_PERMISSIONS, error);
  }
}
