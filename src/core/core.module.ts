import { DynamicModule, Module, Type } from '@nestjs/common';
import { AppController } from '../infrastructure/http/controllers/app.controller';
import { AppService } from './application/app.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class CoreModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: CoreModule,
      imports: [infrastructureModule],
    };
  }}
