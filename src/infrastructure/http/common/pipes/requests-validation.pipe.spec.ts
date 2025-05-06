import { BadModelException } from '../../../../shared/errors/exceptions/bad-model.exception';
import { RequestValidationPipe } from '../../common/pipes/requests-validation.pipe';
import { LoginUserHTTPRequest } from '../../models/login-user.http.request';

describe('RequestValidationPipe', () => {
  let pipe: RequestValidationPipe;

  beforeEach(async () => {
    pipe = new RequestValidationPipe();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should create a BadModelException for empty password', () => {
    const email = 'john.doe@email.com';
    const password = '';

    expect(
      pipe.transform(<LoginUserHTTPRequest>{ email, password }, {
        type: 'body',
        metatype: LoginUserHTTPRequest,
      }),
    ).rejects.toThrow(BadModelException);
  });
});
