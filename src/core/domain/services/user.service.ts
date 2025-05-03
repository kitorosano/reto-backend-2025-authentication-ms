import { Injectable } from '@nestjs/common';
import { ErrorCodesKeys } from '../../../shared/errors/error-code-keys.enum';
import { BadModelException } from '../../../shared/errors/exceptions/bad-model.exception';
import { User } from '../models/user.model';
import { HashService } from './hash.service';
import { UuidService } from './uuid.service';

interface RegisterUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Injectable()
export class UserService {
  private readonly MAX_NAME_LENGTH = 20;
  private readonly MIN_PASSWORD_LENGTH = 6;

  constructor(
    private readonly uuidService: UuidService,
    private readonly hashService: HashService,
  ) {}

  async create({
    name,
    email,
    password,
    confirmPassword,
  }: RegisterUser): Promise<User> {
    const user = new User();

    user.setId(this.uuidService.generate());

    if (this.validateName(name)) user.setName(name);

    if (this.validateEmail(email)) user.setEmail(email);

    if (
      this.validatePassword(password) &&
      this.validateConfirmPassword(password, confirmPassword)
    ) {
      const hashedPassword = await this.hashPassword(password);
      user.setPassword(hashedPassword);
    }

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

  validateEmail(email: string): boolean {
    const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = REGEX_EMAIL.test(email);

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.EMAIL_FORMAT_NOT_VALID);
  }

  private validatePassword(password: string): boolean {
    const isValid = password.length >= this.MIN_PASSWORD_LENGTH;

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.PASSWORD_TOO_SHORT);
  }

  private validateConfirmPassword(
    password: string,
    ConfirmPassword: string,
  ): boolean {
    const isValid = password === ConfirmPassword;

    if (isValid) return true;

    throw new BadModelException(ErrorCodesKeys.PASSWORDS_NOT_MATCH);
  }

  private hashPassword(password: string): Promise<string> {
    return this.hashService.hash(password);
  }
}
