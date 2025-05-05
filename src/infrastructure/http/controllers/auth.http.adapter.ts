import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthServicePort } from '../../../core/application/ports/inbounds/auth.service.port';
import { BearerToken } from '../common/decorators/bearer-token.decorator';
import { CustomExceptionFilter } from '../common/filters/custom-exception.filter';
import { RequestValidationPipe } from '../common/pipes/requests-validation.pipe';
import { AuthHTTPMapper } from '../mappers/auth.http.mapper';
import { LoginUserHTTPRequest } from '../models/login-user.http.request';
import { RegisterUserHTTPRequest } from '../models/register-user.http.request';
import { TokenHTTPResponse } from '../models/token.http.response';
import { UserHTTPResponse } from '../models/user.http.response';

@Controller('auth')
@UseFilters(CustomExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(RequestValidationPipe)
export class AuthHTTPAdapter {
  constructor(private application: AuthServicePort) {}

  @Post('register')
  @HttpCode(201)
  async registerUser(
    @Body() request: RegisterUserHTTPRequest,
  ): Promise<UserHTTPResponse> {
    const dto = AuthHTTPMapper.toRegisterDTO(request);

    const user = await this.application.registerUser(dto);

    return AuthHTTPMapper.toRegisterResponse(user);
  }

  @Post('login')
  @HttpCode(200)
  async authenticateUser(
    @Body() request: LoginUserHTTPRequest,
  ): Promise<TokenHTTPResponse> {
    const dto = AuthHTTPMapper.toLoginDTO(request);

    const token = await this.application.authenticateUser(dto);

    return AuthHTTPMapper.toLoginResponse(token);
  }

  @Get('refresh')
  @HttpCode(200)
  async refreshAuthetication(
    @BearerToken() refreshToken: string,
  ): Promise<TokenHTTPResponse> {
    const token = await this.application.refreshAuthetication(refreshToken);
    return AuthHTTPMapper.toLoginResponse(token);
  }

  @Get('logout')
  @HttpCode(204)
  async logoutUser(@BearerToken() token: string): Promise<void> {
    await this.application.logoutUser(token);
  }
}
