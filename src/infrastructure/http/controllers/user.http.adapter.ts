import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UserServicePort } from '../../../core/application/ports/inbounds/user.service.port';
import { CustomExceptionFilter } from '../common/filters/custom-exception.filter';
import { RequestValidationPipe } from '../common/pipes/requests-validation.pipe';

@Controller('users')
@UseFilters(CustomExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(RequestValidationPipe)
export class UserHTTPAdapter {
  constructor(private application: UserServicePort) {}
}
