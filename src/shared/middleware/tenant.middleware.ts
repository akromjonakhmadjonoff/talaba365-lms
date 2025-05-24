import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { control_prisma } from '../../../prisma/control/control_prisma.js';
import tenant_prisma from '../../../prisma/tenant/tenant_prisma.js';
import { shared_prisma } from '../../../prisma/shared/shared_prisma.js';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host || '';
    const subdomain = host.split('.')[0];

    if (!subdomain || subdomain === 'www') {
      return res.status(400).json({ error: 'Missing or invalid tenant subdomain' });
    }

    try {
      const is_local = host.includes('localhost');
      if (is_local) {
        req.tenant = {
          id: 'local',
          db_url: 'postgresql://root:toor@localhost:5432/lms_shared?schema=public',
          name: 'Local Dev',
          type: 'SHARED',
        };
        req.prisma = shared_prisma;
        return next();
      }

      const tenant = await control_prisma.tenant.findUnique({
        where: { slug: subdomain },
      });

      if (!tenant || !tenant.is_active) {
        return res.status(404).json({ error: 'Tenant not found or inactive' });
      }

      if (tenant.type === 'SHARED') {
        req.tenant = {
          id: tenant.uuid,
          name: tenant.name,
          type: 'SHARED',
        };
        req.prisma = shared_prisma;
      } else {
        if (!tenant.db_url) {
          return res.status(500).json({ error: 'Dedicated tenant missing db_url' });
        }

        req.tenant = {
          id: tenant.uuid,
          name: tenant.name,
          type: 'DEDICATED',
          db_url: tenant.db_url,
        };
        req.prisma = tenant_prisma(tenant.uuid, tenant.db_url);
      }

      return next();
    } catch (error) {
      return res.status(500).json({ error: 'Internal middleware error' });
    }
  }
}
