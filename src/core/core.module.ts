import { DynamicModule, Module, Type } from '@nestjs/common';
import { AuthHTTPAdapter } from '../infrastructure/http/controllers/auth.http.adapter';
import { ApplicationService } from './application/application.service';
import { AuthServicePort } from './application/ports/inbounds/auth.service.port';
import { AuthenticateUserUseCase } from './application/usecases/authenticate-user.usecase';
import { RegisterUserUseCase } from './application/usecases/register-user.usecase';
import { AuthService } from './domain/services/auth.service';
import { HashService } from './domain/services/hash.service';
import { UserService } from './domain/services/user.service';
import { UuidService } from './domain/services/uuid.service';

@Module({
  controllers: [AuthHTTPAdapter],
  providers: [
    // Domain Services
    UserService,
    UuidService,
    HashService,
    AuthService,

    // Inbound Ports
    {
      provide: AuthServicePort,
      useClass: ApplicationService,
    },

    // Use Cases
    RegisterUserUseCase,
    AuthenticateUserUseCase,
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
