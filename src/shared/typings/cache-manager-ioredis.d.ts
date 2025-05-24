declare module 'cache-manager-ioredis' {
  import { Store } from 'cache-manager';

  interface RedisStoreArgs {
    url: string;
    ttl?: number;
  }

  export function redisStore(args: RedisStoreArgs): Store | Promise<Store>;
}
