import 'dotenv/config';
import * as joi from 'joi';
import { ApplicationBootstrapOptions } from './bootstrap';

interface Environment {
  NODE_ENV: string;
  PORT: number;
  NATS_SERVERS: string;
  DRIVER_TYPE: string;
  DRIVER_URI: string;
  JWT_SECRET: string;
}

const environmentSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('development', 'testing', 'production')
      .default('development'),
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    DRIVER_TYPE: joi.string().valid('mongodb').required(),
    DRIVER_URI: joi.string().required(),
    JWT_SECRET: joi.string().required(),
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
  driverUri: environment.DRIVER_URI,
  driver: environment.DRIVER_TYPE as ApplicationBootstrapOptions['driver'],
  jwtSecret: environment.JWT_SECRET,
};
