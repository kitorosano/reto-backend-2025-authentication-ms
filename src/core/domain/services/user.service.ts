import { Injectable } from '@nestjs/common';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { User } from '../models/user.model';
import { UuidService } from './uuid.service';

interface RegisterUser {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

@Injectable()
export class UserService {
  private readonly MAX_NAME_LENGTH = 20;
  private readonly MIN_PASSWORD_LENGTH = 6;

  constructor(private readonly uuidService: UuidService) {}

  create({ name, email, password, passwordConfirmation }: RegisterUser): User {
    const user = new User();

    user.setId(this.uuidService.generate());

    if (this.validateName(name)) user.setName(name);

    if (this.validateEmail(email)) user.setEmail(email);

    if (
      this.validatePassword(password) &&
      this.validatePasswordConfirmation(password, passwordConfirmation)
    )
      user.setPassword(this.hashPassword(password));

    return user;
  }

  validateId(id: string): boolean {
    const isValid = this.uuidService.validate(id);

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.ID_FORMAT_NOT_VALID);
  }

  private validateName(name: string): boolean {
    const isValid = name.length > 0 && name.length <= this.MAX_NAME_LENGTH;

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.NAME_TOO_LONG);
  }

  private validateEmail(email: string): boolean {
    const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = REGEX_EMAIL.test(email);

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.EMAIL_FORMAT_NOT_VALID);
  }

  private validatePassword(password: string): boolean {
    const isValid = password.length >= this.MIN_PASSWORD_LENGTH;

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.REQUEST_NOT_VALID);
  }

  private validatePasswordConfirmation(
    password: string,
    passwordConfirmation: string,
  ): boolean {
    const isValid = password === passwordConfirmation;

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.REQUEST_NOT_VALID);
  }

  private hashPassword(password: string): string {
    return password; // TODO: Implement password hashing
  }
}
