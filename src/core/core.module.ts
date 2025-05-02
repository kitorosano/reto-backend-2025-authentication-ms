import { DynamicModule, Module, Type } from '@nestjs/common';
import { UserHTTPAdapter } from '../infrastructure/http/controllers/user.http.adapter';
import { ApplicationService } from './application/application.service';
import { UserServicePort } from './application/ports/inbounds/user.service.port';
import { UserService } from './domain/services/user.service';
import { UuidService } from './domain/services/uuid.service';

@Module({
  controllers: [UserHTTPAdapter],
  providers: [
    // Domain Services
    UserService,
    UuidService,

    // Inbound Ports
    {
      provide: UserServicePort,
      useClass: ApplicationService,
    },

    // Use Cases
  ],
})
export class CoreModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: CoreModule,
      imports: [infrastructureModule],
    };
  }
}
