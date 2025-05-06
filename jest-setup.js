process.env.NODE_ENV = 'testing';
process.env.PORT = 3001;

process.env.NATS_SERVERS = 'nats://localhost:4222,nats://localhost:4223';

process.env.PERSISTENCE_DRIVER = 'mongodb';
process.env.PERSISTENCE_DRIVER_URI =
  'mongodb://localhost:27017/authentication-ms';

process.env.AUTH_DRIVER = 'jwt';
process.env.AUTH_DRIVER_SECRET = 'secret';
process.env.AUTH_DRIVER_EXPIRES_IN = 60;
process.env.AUTH_DRIVER_REFRESH_SECRET = 'secret-refresh';
process.env.AUTH_DRIVER_REFRESH_EXPIRES_IN = 86400;
