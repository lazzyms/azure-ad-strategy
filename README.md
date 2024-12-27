# azure-ad-jwt-strategy

A flexible and secure Azure AD JWT authentication strategy for NestJS applications with multi-tenant support. This package provides a seamless integration between Azure AD JWT tokens and NestJS passport-based authentication.

## Features

- 🔐 Secure JWT validation using `jwks-rsa`
- 🏢 Built-in multi-tenant support
- 🎯 Flexible user validation strategy
- 📦 Easy integration with NestJS applications
- 🔄 Configurable JWT caching and rate limiting
- 🎨 TypeScript support with full type definitions
- 🛡️ Custom guards and decorators included

## Installation

```bash
npm install azure-ad-jwt-strategy
# or
yarn add azure-ad-jwt-strategy
```

## Prerequisites

The package has the following peer dependencies:

```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/passport": "^10.0.0"
}
```

## Quick Start

### 1. Implement the User Validator

Create a validator that implements the `IUserValidator` interface:

```typescript
import { Injectable } from "@nestjs/common";
import { IUserValidator, AzureJwtPayload } from "azure-ad-jwt-strategy";

@Injectable()
class UserValidator implements IUserValidator {
  constructor(private userService: UserService) {}

  async validateToken(payload: AzureJwtPayload) {
    // Implement your validation logic here
    // Example: validate using Azure AD Object ID
    return this.userService.findByAzureId(payload.oid);
  }
}
```

### 2. Configure the Module

Import and configure the module in your `app.module.ts`:

```typescript
import { AzureAuthModule } from "azure-ad-jwt-strategy";

@Module({
  imports: [
    AzureAuthModule.register(
      {
        credentials: {
          clientID: "your-azure-client-id",
          tenantIds: ["tenant-id-1", "tenant-id-2"],
        },
        jwt: {
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
        },
      },
      new UserValidator(userService)
    ),
  ],
})
export class AppModule {}
```

### 3. Protect Your Routes

Use the included decorator to protect your routes:

```typescript
import { AzureJwtAuth } from "azure-ad-jwt-strategy";

@Controller("protected")
export class ProtectedController {
  @Get()
  @AzureJwtAuth()
  getProtectedResource() {
    return "This is protected";
  }
}
```

## Configuration Options

### AzureAuthConfig

```typescript
interface AzureAuthConfig {
  credentials: {
    clientID: string; // Your Azure AD application client ID
    tenantIds: string[]; // Array of allowed tenant IDs
  };
  jwt?: {
    jwksRequestsPerMinute?: number; // Rate limit for JWKS requests (default: 5)
    cache?: boolean; // Enable JWKS caching (default: true)
    rateLimit?: boolean; // Enable rate limiting (default: true)
  };
}
```

### AzureJwtPayload

The payload interface includes common Azure AD claims:

```typescript
interface AzureJwtPayload {
  tid: string; // Tenant ID
  oid?: string; // Object ID
  preferred_username?: string;
  email?: string;
  [key: string]: any; // Additional claims
}
```

## Multi-tenant Support

The package supports multi-tenant Azure AD applications by allowing you to specify multiple tenant IDs. Only tokens from the specified tenants will be accepted.

```typescript
AzureAuthModule.register({
  credentials: {
    clientID: "your-client-id",
    tenantIds: ["tenant-1-id", "tenant-2-id"],
  },
  // ...
});
```

## Custom Validation

The `IUserValidator` interface allows you to implement custom validation logic:

```typescript
interface IUserValidator<T = any> {
  validateToken(payload: AzureJwtPayload): Promise<T>;
}
```

You can validate users based on any token claims:

```typescript
class CustomValidator implements IUserValidator {
  async validateToken(payload: AzureJwtPayload) {
    // Example: Validate based on email domain
    const email = payload.preferred_username || payload.email;
    if (!email?.endsWith("@allowed-domain.com")) {
      return null;
    }
    return { id: payload.oid, email };
  }
}
```

## Security Considerations

- The package uses `jwks-rsa` for secure key rotation and validation
- JWT validation includes audience and issuer verification
- Multi-tenant validation ensures tokens are only accepted from allowed tenants
- Rate limiting and caching are enabled by default for JWKS endpoints

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and feature requests, please use the GitHub issues page.

---

Made after so much frustration for Azure AD
