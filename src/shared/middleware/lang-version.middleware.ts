import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LangVersionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const segments = req.path.split('/');
    if (segments.length >= 4 && segments[1] === 'api') {
      const version = segments[2];
      const lang = segments[3];

      if (version && lang) {
        req.api_version = version;
        req.lang = lang;
        return next();
      }
    }

    return res.status(400).json({ error: 'Invalid URL format. Use /api/:version/:lang/...' });
  }
}
