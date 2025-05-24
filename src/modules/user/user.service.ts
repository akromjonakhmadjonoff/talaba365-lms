import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { SharedPrismaClient } from '../../../prisma/shared/shared_prisma.js';

@Injectable()
export class UserService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  get_all(prisma: SharedPrismaClient) {
    return prisma.user.findMany({});
  }
}
