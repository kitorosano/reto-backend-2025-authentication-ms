import { Module } from '@nestjs/common';
import { ApplicationBootstrapOptions } from './config/bootstrap';
import { CoreModule } from './core/core.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

@Module({})
export class AppModule {
  static register(options: ApplicationBootstrapOptions) {
    return {
      module: AppModule,
      imports: [
        CoreModule.withInfrastructure(InfrastructureModule.use(options.driver)),
      ],
    };
  }
}
