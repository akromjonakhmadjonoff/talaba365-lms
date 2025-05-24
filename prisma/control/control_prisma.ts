import { PrismaClient } from '@prisma/control';

export const control_prisma = new PrismaClient();

export type ControlPrismaClient = typeof control_prisma;
