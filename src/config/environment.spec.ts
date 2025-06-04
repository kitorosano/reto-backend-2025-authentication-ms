const mockEnvs = {
  NODE_ENV: 'testing',
  PORT: 3001,
  NATS_SERVERS: 'string',
  PERSISTENCE_DRIVER: 'string',
  PERSISTENCE_DRIVER_URI: 'string',
  AUTH_DRIVER: 'string',
  AUTH_DRIVER_SECRET: 'string',
  AUTH_DRIVER_EXPIRES_IN: 60,
  AUTH_DRIVER_REFRESH_SECRET: 'string',
  AUTH_DRIVER_REFRESH_EXPIRES_IN: 60,
};

jest.mock('joi', () => {
  return {
    object: jest.fn().mockReturnValue({
      unknown: jest.fn().mockReturnValue({
        validate: jest.fn().mockReturnValue({
          error: new Error('Validation error'),
          value: {},
        }),
      }),
    }),
    string: jest.fn().mockReturnValue({
      valid: jest.fn().mockReturnValue({
        default: jest.fn(),
        required: jest.fn(),
      }),
      required: jest.fn(),
    }),
    number: jest.fn().mockReturnValue({
      required: jest.fn(),
    }),
    array: jest.fn().mockReturnValue({
      items: jest.fn().mockReturnValue({
        required: jest.fn(),
      }),
    }),
  };
});

describe('Environment', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if environment validation fails', () => {
    expect(import('./environment')).rejects.toThrow(
      'Environment validation error: Validation error',
    );
  });
});
