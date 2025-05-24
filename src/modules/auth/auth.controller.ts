import {
  Controller, Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth_service: AuthService,
    private readonly jwt_service: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    return this.auth_service.login(req.user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req, @Res() res: Response) {
    return this.auth_service.logout(req.user.uuid, res);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refresh_token: string | undefined = req.cookies?.refresh_token;
    if (!refresh_token) return res.status(401).send('no_token_found');

    const payload = await this.jwt_service.verifyAsync(refresh_token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const user = await this.auth_service.validate_user(payload.email, '');
    if (!user || user.refresh_token !== refresh_token) return res.status(403).send('invalid_refresh_token');

    return this.auth_service.refresh_tokens(user, res);
  }

  @Get('session')
  @UseGuards(LocalAuthGuard)
  getSession(@Req() req) {
    return {
      user: req.user,
    };
  }
}
