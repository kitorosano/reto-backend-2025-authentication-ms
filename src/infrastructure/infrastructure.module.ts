import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import environment from 'src/config/environment';
import { MongoDBModule } from './mongodb/mongodb.module';

@Module({})
export class InfrastructureModule {
  static use(driver: 'mongodb') {
    // const persistenceModule = driver === 'mongodb' ? MongoDBModule : null;
    const persistenceModule = MongoDBModule;

    // const driverImport =
    //   driver === 'mongodb'
    //     ? MongooseModule.forRoot(environment.mongoUri)
    //     : null;
    const driverImport = MongooseModule.forRoot(environment.driverUri);

    return {
      module: InfrastructureModule,
      imports: [driverImport, persistenceModule],
      exports: [persistenceModule],
    };
  }
}
