import { Injectable } from '@nestjs/common';
import * as bycript from 'bcrypt';

@Injectable()
export class HashService {
  private readonly saltRounds: number = 10;

  constructor() {}

  hash(value: string): Promise<string> {
    return bycript.hash(value, this.saltRounds);
  }

  compare(value: string, hashedValue: string): Promise<boolean> {
    return bycript.compare(value, hashedValue);
  }
}
