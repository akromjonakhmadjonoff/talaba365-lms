import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    api_version?: string;
    lang?: string;
  }
}

declare global {
  import { PrismaClient as SharedPrisma } from '@prisma/shared';
  import { PrismaClient as TenantPrisma } from '@prisma/tenant';

  namespace Express {
    interface Request {
      prisma: SharedPrisma | TenantPrisma;
      tenant: object
    }
  }
}

export {};
