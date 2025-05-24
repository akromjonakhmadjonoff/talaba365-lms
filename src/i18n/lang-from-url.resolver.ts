import { I18nResolver } from 'nestjs-i18n';
import { Injectable, ExecutionContext } from '@nestjs/common';

@Injectable()
export class LangFromUrlResolver implements I18nResolver {
  resolve(context: ExecutionContext): string | string[] | Promise<string | string[]> {
    const request = context.switchToHttp().getRequest();
    const parts = request.originalUrl.split('/').filter(Boolean);

    return parts[2] || 'en';
  }
}
