import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UserServicePort } from '../../../core/application/ports/inbounds/user.service.port';
import { CustomExceptionFilter } from '../common/filters/custom-exception.filter';
import { RequestValidationPipe } from '../common/pipes/requests-validation.pipe';
import { UserHTTPMapper } from '../mappers/user.http.mapper';
import { RegisterUserHTTPRequest } from '../models/register-user.http.request';
import { UserHTTPResponse } from '../models/user.http.response';

@Controller('users')
@UseFilters(CustomExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(RequestValidationPipe)
export class UserHTTPAdapter {
  constructor(private application: UserServicePort) {}

  @Post()
  @HttpCode(201)
  async registerUser(
    @Body() request: RegisterUserHTTPRequest,
  ): Promise<UserHTTPResponse> {
    const dto = UserHTTPMapper.toDTO(request);

    const user = await this.application.registerUser(dto);

    return UserHTTPMapper.toResponse(user);
  }
}
