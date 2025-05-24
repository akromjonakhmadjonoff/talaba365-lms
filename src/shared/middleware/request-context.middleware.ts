import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

import { RequestContext } from '../context/request.context.js';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const context = {
      user_uuid: null,
      request_id: uuid(),
      ip: req.ip,
      user_agent: req.headers['user-agent'],
    };

    RequestContext.run(context, () => {
      next();
    });
  }
}
