import { DynamicModule, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AzureJwtStrategy } from "./strategies/azure-jwt.strategy";
import { AzureAuthConfig } from "./interfaces/azure-auth-config.interface";
import { IUserValidator } from "./services/user-validator.interface";

@Module({})
export class AzureAuthModule {
  static register(
    config: AzureAuthConfig,
    userValidator: IUserValidator
  ): DynamicModule {
    return {
      module: AzureAuthModule,
      imports: [PassportModule],
      providers: [
        {
          provide: AzureJwtStrategy,
          useFactory: () => new AzureJwtStrategy(config, userValidator),
        },
      ],
      exports: [AzureJwtStrategy],
    };
  }
}
