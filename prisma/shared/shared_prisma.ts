import { PrismaClient } from '@prisma/shared';

export const shared_prisma = new PrismaClient();

export type SharedPrismaClient = typeof shared_prisma;
