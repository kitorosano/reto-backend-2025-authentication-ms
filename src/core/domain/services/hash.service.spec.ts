import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';

describe('HashService', () => {
  let service: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash method', () => {
    it('should hash a string', async () => {
      const string = 'string123';
      const hashedString = await service.hash(string);
      expect(hashedString).not.toEqual(string);
    });
  });

  describe('compare method', () => {
    it('should compare a string with a hash', async () => {
      const string = 'string123';
      const hashedString = await service.hash(string);
      const isMatch = await service.compare(string, hashedString);
      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect hash comparison', async () => {
      const string = 'string123';
      const hashedString = await service.hash(string);
      const isMatch = await service.compare('wrongString', hashedString);
      expect(isMatch).toBe(false);
    });
  });
});
