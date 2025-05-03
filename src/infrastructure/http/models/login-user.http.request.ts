import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserHTTPRequest {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
