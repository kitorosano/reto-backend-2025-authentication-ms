import { Test, TestingModule } from '@nestjs/testing';
import { UserHTTPAdapter } from './user.http.adapter';

describe('UserHTTPAdapter', () => {
  let controller: UserHTTPAdapter;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserHTTPAdapter],
      providers: [],
    }).compile();

    controller = app.get<UserHTTPAdapter>(UserHTTPAdapter);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
