import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import * as jwksRsa from "jwks-rsa";
import { AzureAuthConfig } from "../interfaces/azure-auth-config.interface";
import { AzureJwtPayload } from "../interfaces/azure-jwt-payload.interface";
import { IUserValidator } from "../services/user-validator.interface";

@Injectable()
export class AzureJwtStrategy extends PassportStrategy(Strategy, "azure-jwt") {
  constructor(
    private readonly config: AzureAuthConfig,
    private readonly userValidator: IUserValidator
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: config.jwt?.cache ?? true,
        rateLimit: config.jwt?.rateLimit ?? true,
        jwksRequestsPerMinute: config.jwt?.jwksRequestsPerMinute ?? 5,
        jwksUri: `https://login.microsoftonline.com/common/discovery/v2.0/keys`,
      }),
      issuerValidation: (issuer: string) => {
        return config.credentials.tenantIds.some((tenantId) =>
          issuer.startsWith(
            `https://login.microsoftonline.com/${tenantId}/v2.0`
          )
        );
      },
      algorithms: ["RS256"],
      audience: config.credentials.clientID,
    });
  }

  async validate(payload: AzureJwtPayload) {
    if (!this.config.credentials.tenantIds.includes(payload.tid)) {
      throw new UnauthorizedException("Organization not authorized");
    }

    const user = await this.userValidator.validateToken(payload);
    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }

    return user;
  }
}
