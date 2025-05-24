import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class LangInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const parts = req.originalUrl.split('/').filter(Boolean);
    // eslint-disable-next-line prefer-destructuring
    req.lang = parts[2];
    return next.handle();
  }
}
