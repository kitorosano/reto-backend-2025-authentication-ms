import { Injectable, ValidationError, ValidationPipe } from '@nestjs/common';
import { ErrorCodesKeys } from '../../../../shared/errors/error-code-keys.enum';
import { BadModelException } from '../../../../shared/errors/exceptions/bad-model.exception';
import { Log } from '../../../../shared/utils/log';

@Injectable()
export class RequestValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const errors = this.flattenValidationErrors(validationErrors);

      Log.error('RequestValidationPipe', 'Validation failed', errors);

      // TODO: Add more detailed error handling if needed

      return new BadModelException(ErrorCodesKeys.REQUEST_NOT_VALID);
    };
  }
}
