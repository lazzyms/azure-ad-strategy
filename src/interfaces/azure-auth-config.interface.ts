export interface AzureAuthConfig {
  credentials: {
    clientID: string;
    tenantIds: string[];
  };
  jwt?: {
    jwksRequestsPerMinute?: number;
    cache?: boolean;
    rateLimit?: boolean;
  };
}
