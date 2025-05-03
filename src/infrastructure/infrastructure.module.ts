import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthDrivers, PersistenceDrivers } from '../config/bootstrap';
import environment from '../config/environment';
import { MongoDBModule } from './mongodb/mongodb.module';

@Module({})
export class InfrastructureModule {
  static use(persistenceDriver: PersistenceDrivers, authDriver: AuthDrivers) {
    const persistenceModule =
      persistenceDriver === 'mongodb' ? MongoDBModule : MongoDBModule; // TODO: Add other persistence modules

    const persistenceImports =
      persistenceDriver === 'mongodb'
        ? [MongooseModule.forRoot(environment.persistenceDriverUri)]
        : [];

    const authModule =
      authDriver === 'jwt'
        ? JwtModule.register({
            secret: environment.authDriverSecret,
          })
        : JwtModule.register({
            secret: environment.authDriverSecret,
          }); // TODO: Add other auth modules

    return {
      module: InfrastructureModule,
      imports: [...persistenceImports, persistenceModule, authModule],
      exports: [persistenceModule, authModule],
    };
  }
}
