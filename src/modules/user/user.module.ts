import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
