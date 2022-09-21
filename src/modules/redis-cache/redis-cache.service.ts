import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cache, CachingConfig } from 'cache-manager';
import { AppEvents } from '../../constants';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async getFromCacheWithFallback<T>(
    key: string,
    fallback: () => T,
    options?: CachingConfig,
  ) {
    const cached = await this.getFromCache(key);
    if (cached) return cached;
    const data = await fallback();
    await this.set(key, data, options);
    return data;
  }

  async getFromCache(key: string) {
    const data = await this.get(key);
    if (!data.status) return null;
    return data.data;
  }

  async get(key: string) {
    const data = await this.cache.get(key);
    if (!data) return { status: false };
    return { status: true, data };
  }

  set(key: string, value: any, options?: CachingConfig) {
    return this.cache.set(key, value, options);
  }

  remove(key: string) {
    return this.cache.del(key);
  }

  @OnEvent(AppEvents.STORE_IN_CACHE)
  async setFromEvent(payload: any) {
    const { key, value, options } = payload;
    await this.cache.set(key, value, options);
  }
}
