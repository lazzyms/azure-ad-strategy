export interface AzureJwtPayload {
  tid: string;
  preferred_username?: string;
  email?: string;
  oid?: string;
  [key: string]: any;
}
