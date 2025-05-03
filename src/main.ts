import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import environment from './config/environment';
import { Log } from './shared/utils/log';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule.register({
      persistenceDriver: environment.persistenceDriver,
      authDriver: environment.authDriver,
    }),
  );

  await app.listen(environment.port);

  Log.info(
    'Main',
    `Authentication microservice is running on port`,
    environment.port,
  );
}

bootstrap().catch((error) => {
  Log.error('Main', 'Error during bootstrap', error);
});
