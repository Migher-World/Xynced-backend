import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cache, CachingConfig } from 'cache-manager';
import { AppEvents } from '../../constants';
import RedisStore from '../../shared/plugins/redis/redis';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async get(key: string) {
    const data = await this.cache.get(key);
    if (!data) return { status: false };
    return { status: true, data };

    // return RedisStore.get(key);
  }

  set(key: string, value: any, options?: CachingConfig) {
    return this.cache.set(key, value, options);
    // return RedisStore.set(key, value, options);
  }

  remove(key: string) {
    return this.cache.del(key);
    // return RedisStore.remove(key);
  }

  @OnEvent(AppEvents.STORE_IN_CACHE)
  async setFromEvent(payload: any) {
    console.log({ payload });
    const { key, value, options } = payload;
    await this.cache.set(key, value, options);
  }
}
