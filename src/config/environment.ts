import 'dotenv/config';
import * as joi from 'joi';
import { AuthDrivers, PersistenceDrivers } from './bootstrap';

interface Environment {
  NODE_ENV: string;
  PORT: number;

  NATS_SERVERS: string;

  PERSISTENCE_DRIVER: string;
  PERSISTENCE_DRIVER_URI: string;

  AUTH_DRIVER: string;
  AUTH_DRIVER_SECRET: string;
  AUTH_DRIVER_EXPIRES_IN: number;
  AUTH_DRIVER_REFRESH_SECRET: string;
  AUTH_DRIVER_REFRESH_EXPIRES_IN: number;
}

const environmentSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('development', 'testing', 'production')
      .default('development'),

    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),

    PERSISTENCE_DRIVER: joi
      .string()
      .valid('mongodb', 'postgresql', 'mysql')
      .required(),
    PERSISTENCE_DRIVER_URI: joi.string().required(),

    AUTH_DRIVER: joi.string().valid('jwt', 'oauth2', 'saml').required(),
    AUTH_DRIVER_SECRET: joi.string().required(),
    AUTH_DRIVER_EXPIRES_IN: joi.number().required(),
    AUTH_DRIVER_REFRESH_SECRET: joi.string().required(),
    AUTH_DRIVER_REFRESH_EXPIRES_IN: joi.number().required(),
  })
  .unknown(true);

const { error, value } = environmentSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

const environment: Environment = value as Environment;

export default {
  name: environment.NODE_ENV,
  port: environment.PORT,

  natsServers: environment.NATS_SERVERS,

  persistenceDriver: environment.PERSISTENCE_DRIVER as PersistenceDrivers,
  persistenceDriverUri: environment.PERSISTENCE_DRIVER_URI,

  authDriver: environment.AUTH_DRIVER as AuthDrivers,
  authDriverSecret: environment.AUTH_DRIVER_SECRET,
  authDriverExpiresIn: environment.AUTH_DRIVER_EXPIRES_IN,
  authDriverRefreshSecret: environment.AUTH_DRIVER_REFRESH_SECRET,
  authDriverRefreshExpiresIn: environment.AUTH_DRIVER_REFRESH_EXPIRES_IN,
};
