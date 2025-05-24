import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContextData {
  user_uuid?: string;
  request_id?: string;
  ip?: string;
  user_agent?: string;
}

const async_local_storage = new AsyncLocalStorage<RequestContextData>();

export const RequestContext = {
  run: <T>(data: RequestContextData, callback: () => T): T => async_local_storage.run(data, callback),

  get: (): RequestContextData | undefined => async_local_storage.getStore(),
};
