import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export function AzureJwtAuth() {
  return applyDecorators(UseGuards(AuthGuard("azure-jwt")));
}
