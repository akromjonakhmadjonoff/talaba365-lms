import { PrismaClient } from '@prisma/tenant';

const clientMap = new Map<string, PrismaClient>();

function tenant_prisma(tenant_uuid: string, db_url: string): PrismaClient {
  if (!clientMap.has(tenant_uuid)) {
    const client = new PrismaClient({
      datasources: {
        db: { url: db_url },
      },
    });
    clientMap.set(tenant_uuid, client);
  }
  return clientMap.get(tenant_uuid)!;
}

export default tenant_prisma;
