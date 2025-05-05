import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AvailableLanguages } from '../../../../shared/errors/error-dictionary';
import { BadModelException } from '../../../../shared/errors/exceptions/bad-model.exception';
import { CustomException } from '../../../../shared/errors/exceptions/custom.exception';
import { InvalidPermissionsException } from '../../../../shared/errors/exceptions/invalid-permissions.exception';
import { NotFoundException } from '../../../../shared/errors/exceptions/not-found.exception';
import { Log } from '../../../../shared/utils/log';
import { ErrorHTTPMapper } from '../../mappers/error.http.mapper';

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const language = this.getLanguageFromRequestHeader(
      request.headers['accept-language'],
    );

    Log.error(
      'CustomExceptionFilter',
      `(${request.method}) at {${request.path}} error: `,
      { exception, cause: exception.cause },
    );

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof BadModelException)
      statusCode = HttpStatus.BAD_REQUEST;
    if (exception instanceof NotFoundException)
      statusCode = HttpStatus.NOT_FOUND;
    if (exception instanceof InvalidPermissionsException)
      statusCode = HttpStatus.UNAUTHORIZED;

    const errorResponse = ErrorHTTPMapper.toResponse(exception, language);

    response.status(statusCode).json(errorResponse);
  }

  private getLanguageFromRequestHeader(
    acceptLanguageHeader: string | undefined,
  ): AvailableLanguages {
    if (!acceptLanguageHeader) return AvailableLanguages.ES;

    const languages = acceptLanguageHeader
      .split(',')
      .map((lang) => lang.trim());

    const supportedLanguages = Object.values(AvailableLanguages);

    const matchedLanguage = languages.find((lang) =>
      supportedLanguages.includes(lang as AvailableLanguages),
    );

    if (!matchedLanguage) return AvailableLanguages.ES;

    return matchedLanguage as AvailableLanguages;
  }
}
