import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ErrorCodesKeys } from '../../../../shared/errors/error-code-keys.enum';
import { BadModelException } from '../../../../shared/errors/exceptions/bad-model.exception';

export const BearerToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader)
      throw new BadModelException(ErrorCodesKeys.AUTH_HEADER_NOT_PROVIDED);
    return authHeader.replace('Bearer ', '').trim();
  },
);
