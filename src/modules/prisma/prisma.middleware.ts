import { PrismaClient } from '@prisma/client';

import { RequestContext } from '../../shared/context/request.context.js';

export function auditLogMiddleware(prisma: PrismaClient) {
  return async (params, next) => {
    const result = await next(params);

    const trackedActions = ['create', 'update', 'delete'];
    if (!trackedActions.includes(params.action)) return result;

    const model = params.model?.toLowerCase();
    if (model === 'log') return result;

    const oldData = params.action === 'update' || params.action === 'delete'
      ? await prisma[model].findUnique({ where: params.args.where })
      : undefined;

    const newData = params.action !== 'delete' ? result : undefined;

    const context = RequestContext.get();

    await prisma.log.create({
      data: {
        user_uuid: context?.userUuid,
        action: params.action,
        model,
        model_id: result?.id?.toString() ?? result?.uuid ?? null,
        old_data: oldData,
        new_data: newData,
        request_id: context?.requestId,
        ip_address: context?.ip,
        user_agent: context?.userAgent,
      },
    });

    return result;
  };
}
