import { AzureJwtPayload } from "../interfaces/azure-jwt-payload.interface";

export interface IUserValidator<T = any> {
  validateToken(payload: AzureJwtPayload): Promise<T>;
}
