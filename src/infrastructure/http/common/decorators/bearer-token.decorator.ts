import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ErrorCodesKeys } from '../../../../shared/errors/error-code-keys.enum';
import { BadModelException } from '../../../../shared/errors/exceptions/bad-model.exception';
import { InvalidPermissionsException } from '../../../../shared/errors/exceptions/invalid-permissions.exception';

export const BearerToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (!authorization)
      throw new BadModelException(ErrorCodesKeys.AUTH_HEADER_NOT_PROVIDED);

    const tokenWithoutBearer = authorization.replace('Bearer', '').trim();
    if (!tokenWithoutBearer)
      throw new InvalidPermissionsException(ErrorCodesKeys.TOKEN_NOT_VALID);

    return tokenWithoutBearer;
  },
);
