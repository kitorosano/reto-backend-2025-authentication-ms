import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashService {
  private readonly saltRounds: number = 10;

  constructor() {}

  hash(value: string): Promise<string> {
    // return bycript.hash(value, this.saltRounds);
    return argon2.hash(value, { type: argon2.argon2id });
  }

  compare(value: string, hashedValue: string): Promise<boolean> {
    // return bycript.compare(value, hashedValue);
    return argon2.verify(hashedValue, value);
  }
}
