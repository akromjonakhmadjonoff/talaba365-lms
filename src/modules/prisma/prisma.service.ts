import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/shared';

import audit_log_middleware from './prisma.middleware.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    this.$use(audit_log_middleware(this));
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
