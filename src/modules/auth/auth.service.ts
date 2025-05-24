import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt_service: JwtService,
  ) {}

  async validate_user(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || password !== user.password_hash) {
      return null;
    }
    return user;
  }

  async login(user, res: Response) {
    const payload = { sub: user.uuid, email: user.email, full_name: user.full_name };

    const access_token: string = await this.jwt_service.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refresh_token: string = await this.jwt_service.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    await this.prisma.user.update({
      where: { email: user.email },
      data: { refresh_token },
    });

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ message: 'login_successful' });
  }

  async logout(uuid: string, res: Response): Promise<{ message: string }> {
    await this.prisma.user.update({
      where: { uuid },
      data: { refresh_token: null },
    });

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { message: 'logout_successful' };
  }

  async refresh_tokens(user, res: Response): Promise<{ message: string }> {
    const payload = { sub: user.uuid, email: user.email };

    const access_token: string = await this.jwt_service.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return { message: 'token_refreshed' };
  }
}
