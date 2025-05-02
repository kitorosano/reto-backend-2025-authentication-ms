import { Injectable } from '@nestjs/common';

@Injectable()
export class UuidService {
  generate(): string {
    return crypto.randomUUID();
  }

  validate(id: string): boolean {
    // Check if the ID is a valid UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}
