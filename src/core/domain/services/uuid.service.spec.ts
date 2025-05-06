import { Test, TestingModule } from '@nestjs/testing';
import { UuidService } from './uuid.service';

describe('UuidService', () => {
  let service: UuidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UuidService],
    }).compile();

    service = module.get<UuidService>(UuidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generate method', () => {
    it('should generate a valid UUID', () => {
      const uuid = service.generate();
      expect(service.validate(uuid)).toBe(true);
    });
  });

  describe('validate method', () => {
    it('should validate a valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      expect(service.validate(validUuid)).toBe(true);
    });

    it('should invalidate an invalid UUID', () => {
      const invalidUuid = 'invalid-uuid-string';
      expect(service.validate(invalidUuid)).toBe(false);
    });
  });
});
