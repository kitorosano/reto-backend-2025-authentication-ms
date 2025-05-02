import { Injectable } from '@nestjs/common';
import { UserServicePort } from './ports/inbounds/user.service.port';

@Injectable()
export class ApplicationService implements UserServicePort {
  constructor() {}
}
