import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './user.service.js';

@Controller('users')
export class UserController {
  constructor(private readonly user_service: UserService) {}

  @Get()
  findAll(@Req() request: Request) {
    return this.user_service.get_all(request.prisma);
  }
}
