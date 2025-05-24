import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as process from 'node:process';

import { Module } from '@nestjs/common';
import { AdminModule } from '@adminjs/nestjs';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CacheModule } from '@nestjs/cache-manager';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import options from './admin/options.js';
import { authenticate } from './admin/auth-provider.js';
import { LangFromUrlResolver } from './i18n/lang-from-url.resolver.js';
import { AuthModule } from './modules/auth/auth.module.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'uz-ltn',
      loaderOptions: {
        path: join(process.cwd(), 'src/i18n'),
        watch: true,
      },
      resolvers: [LangFromUrlResolver, AcceptLanguageResolver],
    }),
    CacheModule.registerAsync({
      useFactory: async () => {
        const { redisStore } = await import('cache-manager-ioredis');
        return {
          store: redisStore,
          url: 'redis://localhost:6379',
          ttl: 60,
        };
      },
      isGlobal: true,
    }),
    AdminModule.createAdminAsync({
      useFactory: async () => ({
        adminJsOptions: options,
        auth: {
          authenticate,
          cookiePassword: process.env.COOKIE_SECRET,
          cookieName: 'adminjs',
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: process.env.COOKIE_SECRET,
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, LangFromUrlResolver],
})
export class AppModule {}
