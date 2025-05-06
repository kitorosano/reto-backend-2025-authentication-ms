import { Test, TestingModule } from '@nestjs/testing';
import { AuthHTTPAdapter } from './auth.http.adapter';

describe.skip('UserHTTPAdapter', () => {
  let controller: AuthHTTPAdapter;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthHTTPAdapter],
      providers: [],
    }).compile();

    controller = app.get<AuthHTTPAdapter>(AuthHTTPAdapter);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
